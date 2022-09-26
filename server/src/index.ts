import _ from "lodash";
import WebSocket, { WebSocketServer } from "ws";
import { AutoAction, UserAction } from "./request";
import { Game, User, getCircularReplacer } from "./utils";
import animalsList from "./commonAnimals";

const wss = new WebSocketServer({ port: 8080 });

console.log("server started");

let games: Game[] = [];
let landing: WebSocket[] = [];
const lostUsers: Record<string, number> = {};

// function to handle when a user dissconnections
// waits a bit before booting them, and it they reconnect it will not dq them
const TIMEOUT_DQ_LEN = 3000;
function handleClose(user: User, game: Game) {
  const timestamp = new Date().getTime();
  setTimeout(() => {
    if (lostUsers[user.id] === timestamp) {
      game.lobby.removePlayer(user.id);
    }
  }, TIMEOUT_DQ_LEN);
}

function emitToLanding() {
  landing.forEach((socket) => {
    socket.send(JSON.stringify(games, getCircularReplacer()));
  });
}

const getNewGameId = () =>
  _.sample(
    animalsList.filter(
      (animal) => !games.find((game) => !!game && game.lobby.id === animal)
    )
  ) ?? "Panda";

wss.on("connection", (ws) => {
  let user: User | null = null;
  let game: Game | null = null;

  console.log("socket open");

  ws.onclose = () => {
    landing = landing.filter((l) => l === ws);
    if (user && game) {
      if (game?.state === "lobby") {
        handleClose(user, game);
      }
    }
    console.log("socket closed");
  };

  ws.onmessage = ({ data }) => {
    //remove later
    if (typeof data !== "string") return;

    console.log(data);
    console.log(games);
    const message = <UserAction | AutoAction>JSON.parse(data);

    // this logic is kinda terrible, might fix later
    if (message.type === "connect") {
      if (!message.name) {
        if (!landing.includes(ws)) landing.push(ws);
        ws.send(
          JSON.stringify(
            games.filter((game) => game),
            getCircularReplacer()
          )
        );
        return;
      }
      // who needs a db when you have .find
      game =
        games
          .filter((game) => game)
          .find((game) =>
            game.lobby.users.find((user) => user.name === message.name)
          ) ?? null;
      if (game === null) {
        console.error("tried to connect to a game that doesn't exist");
        ws.send("/");
        return;
      }
      game.lobby.users = game.lobby.users.map((user) =>
        user.name === message.name ? { ...user, websocket: ws } : user
      );
      user =
        game.lobby.users.find((user) => user.name === message.name) ?? null;
      if (!user) throw "thought there would be a user here";
      game.emit();
      return;
    }

    if (message.type === "create" || message.type === "join") {
      if (message.type === "create") {
        game = new Game(getNewGameId().toString());
        games.push(game);
        emitToLanding();
      } else {
        const tempGame = games.find((g) => g.lobby.id === message.lobbyId);
        if (!tempGame) return;
        game = tempGame;
      }

      if (game.state !== "lobby") return;

      // console.log("WARNING THIS IS DEV CODE"); _.times(4, (n) => { game?.lobby.addPlayer(message.name + n, ws); });
      user = game.lobby.addPlayer(message.name, ws) ?? null;
      game.emit();
      delete lostUsers[user.id];
      return;
    }

    if (!game) throw "no game";
    if (!user) throw "no user";
    console.log(user);

    if (message.type === "start") {
      if (game.state !== "lobby") return;
      game.start();
      game.emit();
      return;
    }
    if (message.type === "leave") {
      if (game.state !== "lobby") return;
      game.lobby.removePlayer(user.id);
      game.emit();
      return;
    }

    if (game.state !== message.type) {
      console.error("user attempted an invalid message");
      console.error(user);
      console.error(game);
      return;
    }

    switch (message.type) {
      case "suggest":
        game.suggest(user, message.suggested);
        break;
      case "vote":
        //game.vote(user, message.vote);
        game.vote(user, message.vote);
        break;
      case "act":
        //game.act(user, message.action);
        game.act(user, message.action);
        break;
      case "guess":
        game.guess(message.guess);
        break;
    }
    game.emit();
    games = games.filter((game) => game.state !== "done");
  };
});

import WebSocket, { WebSocketServer } from "ws";
import { AutoAction, UserAction } from "./request";
import { Game, removeSocket, User } from "./utils";

const wss = new WebSocketServer({ port: 8080 });

console.log("server started");

const games: Game[] = [];
let landing: WebSocket[] = [];
function emitToLanding() {
  landing.forEach((socket) => {
    const data = games.map(removeSocket);
    socket.send(JSON.stringify(data));
  });
}

const getNewGameId = () => {
  games.forEach((_, index, a) => {
    if (index.toString() !== a[index].lobby.id) return index;
  });
  return games.length;
};

wss.on("connection", (ws) => {
  let user: User | null = null;
  let game: Game | null = null;

  console.log("socket open");

  ws.onclose = () => {
    landing = landing.filter((l) => l === ws);
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
        ws.send(JSON.stringify(games.map(removeSocket)));
        return;
      }
      // who needs a db when you have .find
      game =
        games.find((game) =>
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
        games[parseInt(game.lobby.id)] = game;
        emitToLanding();
      } else {
        game = games[message.lobbyId];
      }

      user = game.lobby.addPlayer(message.name, ws) ?? null;
      game.emit();
      return;
    }

    if (!game) throw "no game";
    if (!user) throw "no user";

    if (message.type === "start") {
      if (game.state !== "lobby") return;
      game.start();
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
        game.vote(user, message.vote);
        break;
      case "act":
        game.act(user, message.action);
        break;
      case "guess":
        game.guess(message.guess);
        break;
    }
    game.emit();
  };
});

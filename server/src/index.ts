import WebSocket, { WebSocketServer } from "ws";
import { AutoAction, UserAction } from "./request";
import { Game, Lobby, User } from "./utils";

const wss = new WebSocketServer({ port: 8080 });

console.log("server started");

const games: Game[] = [];

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
    console.log("socket closed");
    if (user) user.websocket = null;
  };

  ws.onmessage = ({ data }) => {
    console.log(data);
    if (typeof data !== "string") return;

    const message = <UserAction | AutoAction>JSON.parse(data);

    switch (message.type) {
      case "create":
        game = new Game(getNewGameId().toString());
        user = game?.lobby.addPlayer(message.name, ws) ?? null;
        break;
      case "join":
        user = game?.lobby.addPlayer(message.name, ws) ?? null;
        break;
    }
  };
});

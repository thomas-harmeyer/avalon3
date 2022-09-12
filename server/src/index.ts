import WebSocket, { WebSocketServer } from "ws";
import { addUserToLobby, lobbies, removeUserFromLobby } from "./lobby";
import { LobbyMessage, Message } from "./request";

const wss = new WebSocketServer({ port: 8080 });

console.log("server started");

wss.on("connection", (ws) => {
  let name = "";
  let lobbyId = -1;
  let lobby: null | typeof lobbies[keyof typeof lobbies] = null;

  console.log("socket open");
  removeUserFromLobby(lobbyId, name);
  ws.onclose = () => {
    if (lobby) emit({ to: lobbyId, type: "lobby", data: lobby });
  };

  ws.onmessage = ({ data }) => {
    if (typeof data !== "string") return;
    const obj = <Message>JSON.parse(data);
    if (obj.to === "server") {
      const { data, type } = obj;
      switch (type) {
        case "join":
          name = data.username;
          lobbyId = data.lobbyId;
          addUserToLobby(data.lobbyId, data.username, ws);
          lobby = lobbies[lobbyId];
          emit({ to: lobbyId, type: "lobby", data: lobby });
          break;
      }
    } else if (typeof obj.to === "number") {
      emit(obj);
    }
  };
});

function emit({ to, type, data }: LobbyMessage) {
  Object.values(lobbies[to]).forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send({ type, data });
    }
  });
}

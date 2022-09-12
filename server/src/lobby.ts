import { WebSocket } from "ws";

const lobbies: Record<string, Record<string, WebSocket>> = {};

function addUserToLobby(lobbyId: number, username: string, ws: WebSocket) {
  if (!lobbies[lobbyId]) lobbies[lobbyId] = {};
  lobbies[lobbyId][username] = ws;
}

function removeUserFromLobby(lobbyId: number, username: string) {
  delete lobbies[lobbyId][username];
  if (!Object.keys(lobbies[lobbyId])) {
    delete lobbies[lobbyId];
  }
}

export { lobbies, addUserToLobby, removeUserFromLobby };

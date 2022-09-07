import { Game, Lobby } from "./utils";
export const lobbies: Record<string, Lobby> = {};
export const games: Record<string, Game> = {};

export function createLobby(id: string) {
  lobbies[id] = new Lobby(id);
}

export function startGame(id: string) {
  games[id] = new Game(lobbies[id]);
}

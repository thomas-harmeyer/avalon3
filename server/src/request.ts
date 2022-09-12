type Message = ServerMessage | LobbyMessage;

type ServerMessage = {
  to: "server";
  type: "join";
  data: { username: string; lobbyId: number };
};

type LobbyMessage = {
  to: number;
  type: "game" | "lobby";
  data: Record<string, unknown>;
};

export type { Message, ServerMessage, LobbyMessage };

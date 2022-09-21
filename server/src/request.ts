type UserAction =
  | { type: "start" }
  | { type: "leave" }
  | { type: "vote"; vote: boolean }
  | { type: "suggest"; suggested: string[] }
  | { type: "act"; action: boolean }
  | { type: "guess"; guess: string };

type AutoAction =
  | { type: "join"; name: string; lobbyId: string }
  | { type: "create"; name: string }
  | { type: "connect"; name?: string };

export { UserAction, AutoAction };

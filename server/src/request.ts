type UserAction =
  | { type: "vote"; vote: boolean }
  | { type: "suggest"; suggested: string[] }
  | { type: "act"; action: boolean }
  | { type: "guess"; guess: string };

type AutoAction =
  | { type: "join"; name: string }
  | { type: "create"; name: string };

export { UserAction, AutoAction };

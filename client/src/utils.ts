import Game from './Components/Game/Game';

//roles
type Role = 'Merlin' | 'Assassin' | 'Minion' | 'Percival' | 'Loyal Servant';
type VoteOption = 'approve' | 'reject';
type MissionOption = 'support' | 'sabotage';

//  types

// game
type Game = {
  id: string;
  users: Player[];
  rounds: Round[];
  postGame: PostGame;
  status: 'Lobby' | 'Night' | 'InProgress' | 'PostGame' | 'Finished';
  active?: boolean;
};

type Lobby = Omit<Game, 'rounds' | 'postGame' | 'users'> & {
  status: 'Lobby';
  users: Omit<Player, 'role'>[];
};
type PostGame = {
  originalWinner: 'Good' | 'Evil';
  correctMerlinGuess?: boolean;
  winner: ' Good' | 'Evil';
};

type Round = {
  suggestions: Suggestion[];
  mission: Mission;
};

type Suggestion = {
  suggestor: Player;
  suggested: Player[];
  Ms: Vote[];
};

type Vote = {
  player: Player;
  vote: VoteOption;
};

type Mission = {
  Suggestion: Suggestion;
  actions: MissionAction[];
};

type MissionAction = {
  player: Player;
  vote: MissionOption;
};

type MissionsProfile = {
  numOfFails: number[];
};

//players
type Player = {
  id: string;
  name: string;
  role: Role;
};

//lobby
type LobbyUser = Omit<Player, 'role'>;
//exports
export type {
  Game,
  Lobby,
  Round,
  Suggestion,
  Mission,
  Vote,
  Player,
  LobbyUser,
};

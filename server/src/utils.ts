import { randomUUID } from "crypto";
import _, { random } from "lodash";
import { WebSocket } from "ws";

const MissionProfiles: Record<number, number[]> = {
  "5": [2, 3, 2, 3, 3],
  "6": [2, 3, 4, 3, 4],
  "7": [2, 3, 3, 4, 4],
  "8": [3, 4, 4, 5, 5],
  "9": [3, 4, 4, 5, 5],
  "10": [3, 4, 4, 5, 5],
};

type Side = "Good" | "Bad";
type GoodRole = "Loyal Servant of Arthur" | "Percival" | "Merlin";
type BadRole = "Minion of Mordred" | "Assassin" | "Morgana";
type Role = GoodRole | BadRole;

export class User {
  id: string;
  name: string;
  websocket: WebSocket | null;
  role?: Role;
  constructor(name: string, websocket: WebSocket) {
    this.name = name;
    this.id = randomUUID();
    this.websocket = websocket;
  }
}

type Vote = {
  user: string;
  vote: boolean;
};

type Action = Vote;

type Mission = {
  suggester: string;
  suggested: string[];
  votes: Vote[];
};

type Round = {
  missions: Mission[];
  actions: Action[];
  passed?: boolean;
};

export class Lobby {
  id: string;
  users: User[];

  constructor(id: string) {
    this.id = id;
    this.users = [];
  }

  addPlayer(name: string, websocket: WebSocket) {
    const user = { name, websocket, id: randomUUID() };
    this.users.push(user);
    return user;
  }

  removePlayer(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

function generateRoles(n: number) {
  const roles: Role[] = [
    "Loyal Servant of Arthur",
    "Merlin",
    "Percival",
    "Assassin",
    "Minion of Mordred",
  ];
  while (roles.length !== n) {
    roles.push("Loyal Servant of Arthur");
    if (roles.length === n) break;
    roles.push("Minion of Mordred");
  }

  return _.shuffle(roles);
}

export class Game {
  lobby: Lobby;
  rounds: Round[] = [];
  missionProfile: number[] = [];
  state: "Lobby" | "Suggest" | "Vote" | "Mission" | "Guess Merlin" | "Done" =
    "Lobby";
  winner?: Side;

  constructor(id: string) {
    this.lobby = new Lobby(id);
  }

  start() {
    const n = this.lobby.users.length;
    const roles = generateRoles(n);
    this.lobby.users = this.lobby.users.map((user, index) => ({
      ...user,
      role: roles[index],
    }));
    this.rounds = [];
    this.missionProfile = MissionProfiles[n];
    this.state = "Suggest";
  }

  emit() {
    this.lobby.users.forEach(
      (user) =>
        user.websocket?.readyState === WebSocket.OPEN &&
        user.websocket.send(this)
    );
  }

  suggest(suggester: string, suggested: string[]) {
    const curMissions = this.rounds.at(-1)?.missions;
    if (!curMissions) throw "No current mission";
    curMissions.push({
      suggested,
      suggester,
      votes: [],
    });
    this.state = "Vote";
  }

  vote(user: string, vote: boolean) {
    const currentRound = this.rounds.at(-1);
    const currentMission = currentRound?.missions.at(-1);
    if (!currentRound || !currentMission) throw "Missing round or mission";
    currentMission.votes.push({ user, vote });
    if (currentMission.votes.length === this.lobby.users.length) {
      const goodVotes = currentMission.votes.filter((vote) => vote.vote).length;
      const badVotes = currentMission.votes.length - goodVotes;
      if (goodVotes > badVotes) {
        this.state = "Mission";
      } else {
        this.state = "Suggest";
        // bad wins after 5 failed suggestions
        const numOfSuggestions = currentRound.missions.length;
        if (numOfSuggestions === 5) {
          this.state = "Done";
          this.winner = "Bad";
          return;
        }
      }
    }
  }

  act(user: string, action: boolean) {
    const currentRound = this.rounds.at(-1);
    if (!currentRound) throw "No round";
    const actions = currentRound.actions;
    actions.push({ user, vote: action });
    //if last action
    if (actions.length === this.missionProfile[this.rounds.length - 1]) {
      const numOfFailVotes = currentRound.actions.filter(
        (act) => !act.vote
      ).length;
      currentRound.passed = numOfFailVotes > 0;

      const numOfPassedRounds = this.rounds.filter(
        (round) => round.passed
      ).length;
      const numOfFailedRounds = this.rounds.length - numOfPassedRounds;

      if (numOfPassedRounds >= 3) {
        this.state = "Guess Merlin";
      } else if (numOfFailedRounds >= 3) {
        this.state = "Done";
        this.winner = "Bad";
      } else {
        this.state = "Suggest";
        this.rounds.push({ actions: [], missions: [] });
      }
    }
  }

  guess(guess: string) {
    const guessedPlayer = this.lobby.users.find((user) => user.id === guess);
    if (!guessedPlayer || !guessedPlayer.role)
      throw "No matching player to guess";
    const { role } = guessedPlayer;
    this.winner = role === "Merlin" ? "Good" : "Bad";
  }
}

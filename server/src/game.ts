import { randomUUID } from 'crypto';

const MissionProfiles: Record<number, number[]> = {
    5: [0, 1, 2],
    6: [1, 1, 1],
    7: [1, 1, 1],
    8: [1, 1, 1],
    9: [1, 1, 1],
    10: [1, 1, 1],
};

type Role = 'Good' | 'Bad';

class User {
    id: string;
    name: string;
    constructor(name: string) {
        this.name = name;
        this.id = randomUUID();
    }
}

type vote = {
  user: string;
  vote: boolean;
};

type Mission = {
  suggestor: string;
  suggested: string[];
  votes: vote[];
};

type Round = {
  missions: Mission[];
  actions: vote[];
  passed?: boolean;
};

type Player = User & { role: Role };

class Lobby {
    id: string;
    users: User[];

    constructor(id: string) {
        this.id = id;
        this.users = [];
    }
    addPlayer(name: string) {
        this.users = [...this.users, { name, id: randomUUID() }];
    }
    removePlayer(id: string) {
        this.users = this.users.filter((user) => user.id !== id);
    }
}

class Game {
    id: string;
    players: Player[];
    rounds: Round[];
    missionProfile: number[];
    state: 'Lobby' | 'Suggest' | 'Vote' | 'Mission' | 'Guess Merlin' | 'Done';
    winner?: 'Good' | 'Bad';

    constructor(lobby: Lobby) {
        this.id = lobby.id;
        this.players = lobby.users.map((user) => ({ ...user, role: 'Good' }));
        this.rounds = [];
        this.missionProfile = MissionProfiles[5];
        this.state = 'Suggest';
    }

    suggest(suggestor: string, suggested: string[]) {
        const curMissions = this.rounds.at(-1)!.missions;
        curMissions.push({
            suggested,
            suggestor,
            votes: [],
        });
        this.state = 'Vote';
    }

    vote(user: string, vote: boolean) {
        const currentMission = this.rounds.at(-1)!.missions.at(-1)!;
        currentMission.votes.push({ user, vote });
        if (currentMission.votes.length === this.players.length) {
            const goodVotes = currentMission.votes.filter((vote) => vote.vote).length;
            const badVotes = currentMission.votes.length - goodVotes;
            if (goodVotes > badVotes) {
                this.state = 'Mission';
            } else {
                this.state = 'Suggest';

                // bad wins after 5 failed suggestions
                if (this.rounds.at(-1)!.missions.length === 5) {
                    this.state = 'Done';
                    this.winner = 'Bad';
                    return;
                }
            }
        }
    }

    act(user: string, action: boolean) {
        const currentRound = this.rounds.at(-1)!;
        const actions = currentRound.actions;
        actions.push({ user, vote: action });
        if (actions.length === this.missionProfile[this.rounds.length - 1]) {
            currentRound.passed = !currentRound.actions.filter((act) => act.vote)
                .length;
        }
        this.addRound();
    }

    guess(guess: string) {
        this.winner = this.players.find((player) => player.id === guess)!.role
            ? 'Good'
            : 'Bad';
    }

    addRound() {
        const rounds = this.rounds;
        const goodRounds = rounds.filter((round) => round.passed);
        this.rounds.push({ actions: [], missions: [] });
    }
}

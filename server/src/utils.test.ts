import { WebSocket } from "ws";
import { Game, goodRoles, User } from "./utils";
import _ from "lodash";

jest.mock("ws");
const name = "Test User";
const ws = new WebSocket("");
let game: Game;
const users: User[] = [];
const startGame = (n: number) => {
  for (let i = 0; i < n; i++) {
    users.push(game.lobby.addPlayer(name + i, new WebSocket("")));
  }
  game.start();
};

const getMissionUsers = () =>
  game.lobby.users.filter(
    (_user, index) =>
      index > 0 && index <= game.missionProfile[game.rounds.length - 1]
  );

const suggestMission = () => {
  game.suggest(
    game.lobby.users[0],
    getMissionUsers().map((user) => user.id)
  );
};

const voteForMission = (vote: boolean) =>
  game.lobby.users.forEach((user) => game.vote(user, vote));

const actOnMission = (action: boolean) =>
  getMissionUsers().forEach((user) => game.act(user, action));

beforeEach(() => {
  game = new Game("test");
});

test("Create default game", () => {
  expect(game).toStrictEqual(new Game("test".toString()));
});

describe("Add plyers to lobby", () => {
  _.times(10, (n) => {
    n++;
    test(`Add ${n} players to lobby`, () => {
      _.times(n, (n) => {
        n++;
        const name = "Test Player: " + n;
        const ws = new WebSocket("");
        game.lobby.addPlayer(name, ws);
        expect(game.lobby.users.length).toBe(n);
      });
      expect(game.lobby.users.length).toBe(n);
    });
  });
});

test("Remove Player from lobby", () => {
  const user = game.lobby.addPlayer(name, ws);
  expect(game.lobby.users.length).toBe(1);
  game.lobby.removePlayer(user.id);
  expect(game.lobby.users.length).toBe(0);
});

for (let n = 5; n <= 10; n++) {
  describe(`With ${n} players`, () => {
    test(`Start game`, () => {
      startGame(n);
      expect(
        game.lobby.users.forEach((user) => {
          expect(user.role).toBeTruthy();
        })
      );
      expect(game.missionProfile.length).toBe(5);
      expect(game.state).toBe("suggest");
    });

    test(`Suggest, Vote, and Act on a mission`, () => {
      startGame(n);
      suggestMission();
      voteForMission(false);
      expect(game.rounds.length).toBe(1);
      expect(game.rounds[0].missions.length).toBe(1);
      suggestMission();
      expect(game.rounds[0].missions.length).toBe(2);
      voteForMission(true);
      actOnMission(false);
      expect(game.rounds.length).toBe(2);
      expect(game.rounds.filter((round) => round.passed).length).toBe(0);
      expect(game.rounds.filter((round) => round.passed === false).length).toBe(
        1
      );
    });

    test(`Bad wins if 5 failed suggests`, () => {
      startGame(n);
      for (let i = 0; i < 5; i++) {
        expect(game.winner).toBeUndefined();
        suggestMission();
        voteForMission(false);
      }
      expect(game.winner).toBe("bad");
    });

    for (let goodWins = true, cnt = 0; cnt < 2; cnt++, goodWins = !goodWins)
      describe(`${goodWins ? "Good" : "Bad"} wins after 3 missions`, () => {
        for (let winningRound = 3; winningRound <= 5; winningRound++) {
          test(`on the ${winningRound} mission`, () => {
            startGame(n);
            const failedMissions = winningRound - 3;
            //fail first n-3 missions
            _.times(failedMissions, () => {
              {
                suggestMission();
                expect(game.state).toBe("vote");
                voteForMission(true);
                expect(game.state).toBe("act");
                actOnMission(!goodWins);
                expect(game.state).toBe("suggest");
              }
            });
            //pass next 3 missions
            _.times(3, (n) => {
              suggestMission();
              expect(game.state).toBe("vote");
              voteForMission(true);
              expect(game.state).toBe("act");
              actOnMission(goodWins);
              if (n < 2) expect(game.state).toBe("suggest");
            });
            if (goodWins) {
              expect(game.state).toBe("guess");
              const notMerlin = game.lobby.users.find(
                (user) => user.role !== "Merlin"
              );
              if (!notMerlin) throw "everyone is merlin!!";
              game.guess(notMerlin.id);
              expect(game.state).toBe("done");
              expect(game.winner).toBe("good");
            } else {
              expect(game.state).toBe("done");
              expect(game.winner).toBe("bad");
            }
          });
        }
      });

    test("Number of generated good roles > bad roles", () => {
      startGame(n);
      const numGood = game.lobby.users.filter((user) =>
        goodRoles.find((role) => role === user.role)
      ).length;
      const numBad = n - numGood;
      expect(numGood).toBeGreaterThan(numBad);
    });

    test("Get user by id", () => {
      startGame(n);
      const users = game.lobby.users;
      users.forEach((user) => expect(game.getUserFromId(user.id)).toBe(user));
    });
  });
}

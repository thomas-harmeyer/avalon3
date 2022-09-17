import { Game as GameType, goodRoles } from "@backend/utils"
import {
  AppBar,
  AppBarProps,
  Box,
  CircularProgress,
  Container,
  styled,
} from "@mui/material"
import { useMemo } from "react"
import useGame from "../Hooks/useGame"
import useName from "../Hooks/useName"
import Lobby from "../Lobby/Lobby"
import Navbar from "./Navbar"
import Suggest from "./Suggest"
import Vote from "./Vote"

const url = import.meta.env.VITE_WS_SERVER_URL
if (url === undefined) throw new Error("missing url env var")

export const BottomBar = styled(AppBar)<AppBarProps>(() => ({
  position: "fixed",
  top: "auto",
  bottom: 0,
}))

//make type with game required
const RenderGame = ({ usedGame }: { usedGame: ReturnType<typeof useGame> }) => {
  const { act, guess, start, suggest, vote } = usedGame
  const title = useMemo(
    () => game.state.charAt(0).toUpperCase() + game.state.substring(1),
    [game.state]
  )

  const currentMission = useMemo(
    () => game?.rounds.at(-1)?.missions.at(-1) ?? "",
    [game?.rounds]
  )

  const users = useMemo(() => {
    const users = game.lobby.users
    const missionUsers = currentMission
      ? users.filter((user) => currentMission.suggested.includes(user))
      : []
    const guessUsers = users.filter((user) =>
      goodRoles.find((role) => role === user.role)
    )
    switch (game.state) {
      case "lobby":
        return users
      case "suggest":
        return users
      case "act":
        return missionUsers
      case "vote":
        return missionUsers
      case "guess":
        return guessUsers
    }
    return []
  }, [currentMission, game.lobby.users, game.state])

  return (
    <Container>
      <Navbar />
      {game.state === "lobby" && (
        <Lobby
          users={game.lobby.users.map((user) => user.name)}
          id={game.lobby.id}
          start={start}
        />
      )}
      {game.state === "suggest" && (
        <Suggest
          users={game.lobby.users.map(({ name, id }) => ({ name, id }))}
          missionSize={game.missionProfile[game.rounds.length - 1]}
          suggestMission={suggest}
        />
      )}
      {game.state === "vote" && !!currentMission && (
        <Vote
          suggester={currentMission.suggester.name}
          suggested={currentMission.suggested.map((s) => s.name)}
          vote={vote}
        />
      )}
      {/* {game.state === "act" && <Act />} */}
    </Container>
  )
}
const Game = () => {
  const name = useName()
  const usedGame = useGame(name)

  if (!game)
    return (
      <Box height={1} width={1} justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    )
}

export default Game

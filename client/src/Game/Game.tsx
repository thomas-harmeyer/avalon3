import { Box, CircularProgress, Container, Paper } from "@mui/material"
import { useState } from "react"
import { errorMessages, useError } from "../Hooks/useError"
import useGame from "../Hooks/useGame"
import useName from "../Hooks/useName"
import ActionArea from "./ActionArea"
import ActionButtons from "./ActionButtons"
import Navbar from "./Navbar"
import ScoreBoard from "./ScoreBoard"
import Warning from "./Warning"

const url = import.meta.env.VITE_WS_SERVER_URL
if (url === undefined) throw new Error("missing url env var")

type AllNonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

type UsedGame = AllNonNullable<ReturnType<typeof useGame>>

//make type with game required
const RenderGame = ({
  name,
  usedGame,
}: {
  name: string
  usedGame: UsedGame
}) => {
  const [suggestedUsers, setSuggestedUsers] = useState<string[]>([])
  const [guessUser, setGuessUser] = useState<null | string>(null)
  const { game, act, guess, start, suggest, vote, leave, navigateToLobby } =
    usedGame
  const { warning, handleError } = useError(game?.state ?? null)

  function handleStartGame() {
    const users = game.lobby.users
    if (users.length >= 5 && users.length <= 10) return start()
    else handleError(errorMessages["start"](users.length))
  }

  function handleGuess() {
    if (guessUser) {
      guess(guessUser)
      setGuessUser(null)
    } else {
      handleError(errorMessages["guess"])
    }
  }

  function handleSuggest() {
    const missionPlayerCount = game.missionProfile[game.rounds.length - 1]
    const validSuggestion = suggestedUsers.length === missionPlayerCount
    if (validSuggestion) {
      suggest(suggestedUsers)
      setSuggestedUsers([])
      return
    } else handleError(errorMessages["suggest"](missionPlayerCount))
  }

  return (
    <Container>
      <Box flexDirection="column" display="flex" height={1} width={1}>
        <Navbar game={game} name={name} />
        <Box pb={3} pt={1}>
          <ScoreBoard
            numberOfPlayers={game.lobby.users.length}
            state={game.state}
            missionProfile={game.missionProfile}
            rounds={game.rounds}
          />
        </Box>
        <Box display="flex" flexDirection="column" flexGrow={1} flexBasis={1}>
          <ActionArea
            name={name}
            game={game}
            setGuessUser={setGuessUser}
            setSuggestedUsers={setSuggestedUsers}
            guessUser={guessUser}
            suggestedUsers={suggestedUsers}
          />
          <Box py={1} flexGrow={1} />
          <Box pb={2} key={game.state}>
            <Warning {...warning} />
            <ActionButtons
              guessUser={guessUser}
              suggestedUsers={suggestedUsers}
              name={name}
              game={game}
              suggest={handleSuggest}
              leave={leave}
              act={act}
              vote={vote}
              guess={handleGuess}
              start={handleStartGame}
              navigateToLobby={navigateToLobby}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

const Game = () => {
  const name = useName()
  const usedGame = useGame(name)
  if (!name) return <>You should really have a name</>
  const { game } = usedGame
  if (game === null)
    return (
      <Box height={1} width={1} justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    )
  return <RenderGame usedGame={{ ...usedGame, game: game }} name={name} />
}

export default Game

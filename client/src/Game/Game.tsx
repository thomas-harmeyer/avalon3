import { User } from "@backend/utils"
import { Check, Close } from "@mui/icons-material"
import {
  AppBar,
  AppBarProps,
  Box,
  CircularProgress,
  Container,
  styled,
} from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import Body, { Action } from "../Body"
import { errorMessages, useError } from "../Hooks/useError"
import useGame from "../Hooks/useGame"
import useName from "../Hooks/useName"

export const goodRoles = [
  "Loyal Servant of Arthur",
  "Percival",
  "Merlin",
] as const

const url = import.meta.env.VITE_WS_SERVER_URL
if (url === undefined) throw new Error("missing url env var")

export const BottomBar = styled(AppBar)<AppBarProps>(() => ({
  position: "fixed",
  top: "auto",
  bottom: 0,
}))

type AllNonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

type UsedGame = AllNonNullable<ReturnType<typeof useGame>>

const acceptLabelMap = {
  act: <Check />,
  done: "",
  guess: "Guess",
  lobby: "Start Game",
  suggest: "Suggest Mission",
  vote: <Check />,
}

const rejectLabelMap = {
  act: <Close />,
  vote: <Close />,
}

//make type with game required
const RenderGame = ({ usedGame }: { usedGame: UsedGame }) => {
  const { game, act, guess, start, suggest, vote } = usedGame
  const [suggestedUsers, setSuggestedUsers] = useState<string[]>([])
  const [guessUser, setGuessUser] = useState<null | string>(null)
  const { warning, handleError } = useError(game?.state ?? null)

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

  const handleAccept: Action["handle"] = useCallback(() => {
    switch (game.state) {
      case "lobby": {
        const users = game.lobby.users
        if (users.length >= 5 && users.length <= 10) return start()
        else handleError(errorMessages["start"](users.length))
        break
      }
      case "suggest": {
        const missionPlayerCount = game.missionProfile[game.rounds.length - 1]
        const validSuggestion = suggestedUsers.length === missionPlayerCount
        console.log("handle accept", { validSuggestion })
        if (validSuggestion) return suggest(suggestedUsers)
        else handleError(errorMessages["suggest"](missionPlayerCount))
        break
      }
      case "act":
        act(true)
        break
      case "vote":
        vote(true)
        break
      case "guess":
        if (guessUser) guess(guessUser)
        break
    }
  }, [
    act,
    game.lobby.users,
    game.missionProfile,
    game.rounds.length,
    game.state,
    guess,
    guessUser,
    handleError,
    start,
    suggest,
    suggestedUsers,
    vote,
  ])

  const handleReject: Action["handle"] = useCallback(() => {
    switch (game.state) {
      case "vote":
        vote(false)
        break
      case "act":
        vote(false)
        break
    }
  }, [game.state, vote])

  const handleUserClick = (user: User) => {
    if (game.state === "suggest") {
      setSuggestedUsers((suggestedUsers) => [...suggestedUsers, user.id])
    } else if (game.state === "guess") {
      setGuessUser(user.id)
    }
  }

  const accept: Action = useMemo(
    () => ({ label: acceptLabelMap[game.state], handle: handleAccept }),
    [game.state, handleAccept]
  )

  const reject = useMemo(
    () =>
      game.state === "act" || game.state === "vote"
        ? { label: rejectLabelMap[game.state], handle: handleReject }
        : null,
    [game.state, handleReject]
  )

  return (
    <Container>
      <Body
        users={users}
        accept={accept}
        reject={reject ?? undefined}
        title={title}
        handleUserClick={handleUserClick}
        warning={warning}
      />
    </Container>
  )
}
const Game = () => {
  const name = useName()
  const usedGame = useGame(name)
  const { game } = usedGame
  if (game === null)
    return (
      <Box height={1} width={1} justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    )
  return <RenderGame usedGame={{ ...usedGame, game: game }} />
}

export default Game

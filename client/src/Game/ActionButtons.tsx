import { Game, User } from "@backend/utils"
import { Check, Close, ThumbUp, ThumbDown } from "@mui/icons-material"
import { Box, Button, Fab, Zoom } from "@mui/material"
import { useCallback, useMemo } from "react"

export type Action = {
  handle(): void
  label: React.ReactNode
}

export type BodyProps = {
  users: User[]
  userOptions: { allowSelection: boolean; selectedUsers: string[] }
  handleUserClick(user: User): void
}

const acceptLabelMap = {
  act: <Check color="action" />,
  done: "",
  guess: "Guess",
  lobby: "Start Game",
  suggest: "Suggest Mission",
  vote: <ThumbUp color="action" />,
}

const rejectLabelMap = {
  act: <Close />,
  vote: <ThumbDown color="action" />,
}

type Props = {
  game: Game
  handleError(error: string): void
  suggestedUsers: string[]
  suggest(): void
  act(action: boolean): void
  vote(vote: boolean): void
  guess(): void
  start(): void
  name: string
}
function ActionButtons({
  game,
  suggest,
  act,
  vote,
  guess,
  start,
  name,
}: Props) {
  const currentMission = useMemo(
    () => game?.rounds.at(-1)?.missions.at(-1) ?? "",
    [game?.rounds]
  )

  const handleAccept: Action["handle"] = useCallback(() => {
    // idea: validate and execute
    switch (game.state) {
      case "lobby": {
        start()
        break
      }
      case "suggest": {
        suggest()
        break
      }
      case "act":
        act(true)
        break
      case "vote":
        vote(true)
        break
      case "guess":
        guess()
        break
    }
  }, [act, game.state, guess, start, suggest, vote])

  const handleReject: Action["handle"] = useCallback(() => {
    switch (game.state) {
      case "vote":
        vote(false)
        break
      case "act":
        act(false)
        break
    }
  }, [act, game.state, vote])

  const accept: Action = useMemo(
    () => ({ label: acceptLabelMap[game.state], handle: handleAccept }),
    [game.state, handleAccept]
  )

  const reject: Action | null = useMemo(
    () =>
      game.state === "act" || game.state === "vote"
        ? { label: rejectLabelMap[game.state], handle: handleReject }
        : null,
    [game.state, handleReject]
  )

  const showActionButtons = useMemo(() => {
    switch (game.state) {
      case "vote":
        if (!currentMission) throw Error("missing current mission")
        return !currentMission.votes.find((vote) => vote.user.name === name)
      case "act": {
        const currentRound = game.rounds.at(-1)
        if (!currentRound) throw Error("missing current round")
        return !currentRound.actions.find((action) => action.user.name === name)
      }
    }
    return true
  }, [currentMission, game.rounds, game.state, name])

  return (
    <Box display="flex" flexDirection="row">
      {reject && (
        <Zoom in={showActionButtons}>
          <Box width={1}>
            <ActionButton {...reject} reject />
          </Box>
        </Zoom>
      )}
      <Zoom in={showActionButtons}>
        <Box width={1}>
          <ActionButton {...accept} />
        </Box>
      </Zoom>
    </Box>
  )
}

type ButtonProps = Action & { reject?: boolean }
const ActionButton = (props: ButtonProps) => {
  return (
    <Fab
      variant="contained"
      color={props.reject ? "error" : "primary"}
      sx={{ my: 1, p: 1, borderRadius: 0 }}
      onClick={props.handle}
      fullWidth
    >
      {props.label}
    </Fab>
  )
}

export default ActionButtons

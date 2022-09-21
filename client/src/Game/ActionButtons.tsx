import { Game, User } from "@backend/utils"
import { Check, Close, ThumbDown, ThumbUp } from "@mui/icons-material"
import { Box, Fab, Zoom } from "@mui/material"
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
  done: "Back to Lobby",
  guess: "Guess",
  lobby: "Start Game",
  suggest: "Suggest Mission",
  vote: <ThumbUp color="action" />,
}

const rejectLabelMap = {
  act: <Close />,
  vote: <ThumbDown color="action" />,
  lobby: "Leave Lobby",
}

type Props = {
  game: Game
  suggestedUsers: string[]
  guessUser: string | null
  suggest(): void
  act(action: boolean): void
  vote(vote: boolean): void
  guess(): void
  start(): void
  leave(): void
  navigateToLobby(): void
  name: string
}
function ActionButtons({
  game,
  suggestedUsers,
  guessUser,
  suggest,
  act,
  vote,
  guess,
  start,
  leave,
  navigateToLobby,
  name,
}: Props) {
  const currentMission = useMemo(
    () => game.rounds.at(-1)?.missions.at(-1) ?? null,
    [game.rounds]
  )

  const showButtons = useMemo(
    () =>
      ({
        act:
          !!currentMission?.suggested.find(
            (suggestion) => suggestion.name === name
          ) &&
          !game.rounds
            .at(-1)
            ?.actions.find((action) => action.user.name === name),
        done: true,
        guess:
          game.lobby.users.find((user) => user.name === name)?.role ===
          "Assassin",
        lobby: true,
        suggest: true,
        vote: !game.rounds
          .at(-1)
          ?.missions.at(-1)
          ?.votes.find((vote) => vote.user.name === name),
      }[game.state]),
    [currentMission?.suggested, game.lobby.users, game.rounds, game.state, name]
  )

  const disableAcceptButton = useMemo(
    () =>
      ({
        act: false,
        done: false,
        guess: !guessUser,
        lobby: game.lobby.users.length > 10 || game.lobby.users.length < 5,
        suggest:
          suggestedUsers.length !== game.missionProfile[game.rounds.length - 1],
        vote: false,
      }[game.state]),
    [
      game.lobby.users.length,
      game.missionProfile,
      game.rounds.length,
      game.state,
      guessUser,
      suggestedUsers,
    ]
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
      case "done":
        navigateToLobby()
        break
    }
  }, [act, game.state, guess, navigateToLobby, start, suggest, vote])

  const handleReject: Action["handle"] = useCallback(() => {
    switch (game.state) {
      case "vote":
        vote(false)
        break
      case "act":
        act(false)
        break
      case "lobby":
        leave()
        break
    }
  }, [act, game.state, leave, vote])

  const accept: Action = useMemo(
    () => ({ label: acceptLabelMap[game.state], handle: handleAccept }),
    [game.state, handleAccept]
  )

  const reject: Action | null = useMemo(
    () =>
      game.state === "act" || game.state === "vote" || game.state === "lobby"
        ? { label: rejectLabelMap[game.state], handle: handleReject }
        : null,
    [game.state, handleReject]
  )

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="flex-end"
      justifyContent="center"
    >
      {reject && (
        <>
          <Zoom in={showButtons}>
            <Box>
              <ActionButton {...reject} reject />
            </Box>
          </Zoom>
          <Box p={1} />
        </>
      )}
      <Zoom in={showButtons}>
        <Box>
          <ActionButton {...accept} disabled={disableAcceptButton} />
        </Box>
      </Zoom>
    </Box>
  )
}

type ButtonProps = Action & { reject?: boolean; disabled?: boolean }
const ActionButton = (props: ButtonProps) => {
  return (
    <Fab
      disabled={!!props.disabled}
      color={props.reject ? "error" : "primary"}
      onClick={props.handle}
      variant={typeof props.label === "string" ? "extended" : "circular"}
    >
      {props.label}
    </Fab>
  )
}

export default ActionButtons

import { Game, User } from "@backend/utils"
import {
  Box,
  Button,
  Card,
  Grow,
  List,
  Paper,
  Typography,
  Zoom,
} from "@mui/material"
import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from "react"
import { TransitionGroup } from "react-transition-group"

export const goodRoles = [
  "Loyal Servant of Arthur",
  "Percival",
  "Merlin",
] as const

type Props = {
  game: Game
  suggestedUsers: string[]
  setSuggestedUsers: Dispatch<SetStateAction<string[]>>
  guessUser: string | null
  setGuessUser: Dispatch<SetStateAction<string | null>>
}
function ActionArea({
  game,
  suggestedUsers,
  setSuggestedUsers,
  guessUser,
  setGuessUser,
}: Props) {
  const currentMission = useMemo(
    () => game?.rounds.at(-1)?.missions.at(-1) ?? "",
    [game?.rounds]
  )

  const handleUserClick = (user: User) => {
    if (game.state === "suggest") {
      setSuggestedUsers((suggestedUsers) => {
        if (suggestedUsers.includes(user.id))
          return suggestedUsers.filter((suggestion) => suggestion !== user.id)
        else return [...suggestedUsers, user.id]
      })
    } else if (game.state === "guess") {
      if (guessUser === user.id) {
        setGuessUser(null)
      }
      setGuessUser(user.id)
    }
  }
  const users: User[] = useMemo(() => {
    const users = game.lobby.users

    const missionUsers = () =>
      currentMission
        ? users.filter((user) =>
            currentMission.suggested.find(
              (suggested) => suggested.id === user.id
            )
          )
        : []

    const guessUsers = () =>
      users.filter((user) => goodRoles.find((role) => role === user.role))

    switch (game.state) {
      case "lobby":
        return users
      case "suggest":
        return users
      case "act":
        return missionUsers()
      case "vote":
        return missionUsers()
      case "guess":
        return guessUsers()
    }
    return []
  }, [currentMission, game.lobby.users, game.state])

  const handleClick = (user: User) => () => handleUserClick(user)

  const userOptions = useMemo(() => {
    let selectedUsers = [] as string[]
    if (game.state === "suggest") selectedUsers = suggestedUsers
    if (game.state === "guess" && guessUser) selectedUsers = [guessUser]
    return {
      allowSelection: game.state === "suggest" || game.state === "guess",
      selectedUsers,
    }
  }, [game.state, guessUser, suggestedUsers])

  const isUserSelected = useCallback(
    (user: User) =>
      !!userOptions.selectedUsers.find((selected) => selected === user.id),
    [userOptions.selectedUsers]
  )

  return (
    <List key={game.state}>
      <TransitionGroup>
        {users.map((user, index) => {
          return (
            <Zoom
              style={{
                transitionDelay: `${index * 250}ms`,
              }}
              key={user.id + game.state}
            >
              <Box>
                {userOptions.allowSelection ? (
                  <ListItemButton
                    handleClick={handleClick(user)}
                    user={user}
                    isActive={isUserSelected(user)}
                    state={game.state}
                  />
                ) : (
                  <ListItem user={user} state={game.state} />
                )}
              </Box>
            </Zoom>
          )
        })}
      </TransitionGroup>
    </List>
  )
}

type ListItemProps = {
  user: User
  state: Game["state"]
}
function ListItem(props: ListItemProps) {
  return (
    <Paper
      sx={{
        width: 1,
        my: 1,
        p: 1,
        textAlign: "center",
      }}
      elevation={20}
      key={props.user.id + props.state}
    >
      <Typography color={(theme) => theme.palette.text.primary} variant="body1">
        {props.user.name}
      </Typography>
    </Paper>
  )
}

type ListItemButtonProps = {
  user: User
  isActive: boolean
  handleClick(): void
  state: Game["state"]
}
function ListItemButton(props: ListItemButtonProps) {
  return (
    <Paper
      // variant={props.isActive ? "contained" : "outlined"}
      sx={{
        width: 1,
        my: 1,
        p: 1,
        textAlign: "center",
      }}
      key={props.user.id + props.state}
      onClick={props.handleClick}
    >
      <Typography
        color={(theme) =>
          props.isActive
            ? theme.palette.text.primary
            : theme.palette.text.secondary
        }
        variant="body1"
      >
        {props.user.name}
      </Typography>
    </Paper>
  )
}

export default ActionArea

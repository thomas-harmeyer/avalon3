import { Game, User } from "@backend/utils"
import {
  Face,
  HikingTwoTone,
  QuestionMark,
  QuestionMarkRounded,
} from "@mui/icons-material"
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grow,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Radio,
  Typography,
  Zoom,
} from "@mui/material"
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
} from "react"
import { TransitionGroup } from "react-transition-group"

export const goodRoles = [
  "Loyal Servant of Arthur",
  "Percival",
  "Merlin",
] as const

const userIconMap: Record<Game["state"], ReactNode | undefined> = {
  lobby: <Face />,
  act: <HikingTwoTone />,
  done: undefined,
  guess: <QuestionMark />,
  suggest: undefined,
  vote: <QuestionMark />,
}

type Props = {
  name: string
  game: Game
  suggestedUsers: string[]
  setSuggestedUsers: Dispatch<SetStateAction<string[]>>
  guessUser: string | null
  setGuessUser: Dispatch<SetStateAction<string | null>>
}
function ActionArea({
  name,
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

  const overSelected = useMemo(() => {
    return (
      userOptions.selectedUsers.length >
      game.missionProfile[game.rounds.length - 1]
    )
  }, [
    game.missionProfile,
    game.rounds.length,
    userOptions.selectedUsers.length,
  ])

  //short circuit
  if (game.state === "done") {
    const role = game.lobby.users.find((user) => user.name === name)?.role
    if (!role) return null
    const won =
      (game.winner === "good") ===
      !!goodRoles.find((goodRole) => goodRole === role)

    return (
      <Grow in>
        <Box>{won ? "Congratulations, You Win!" : "Sorry, You Lose!"}</Box>
      </Grow>
    )
  }

  if (game.state === "guess") {
    const role = game.lobby.users.find((user) => user.name === name)?.role
    if (role !== "Assassin") return null
  }

  return (
    <Paper>
      <Box p={1}>
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
                  <ListItem key={user.id + game.state}>
                    {userOptions.allowSelection ? (
                      <UserButton
                        type={game.state === "guess" ? "guess" : "suggest"}
                        handleClick={handleClick(user)}
                        user={user}
                        isActive={isUserSelected(user)}
                        overSelected={overSelected}
                      />
                    ) : (
                      <UserItem user={user} icon={userIconMap[game.state]} />
                    )}
                  </ListItem>
                </Zoom>
              )
            })}
          </TransitionGroup>
        </List>
      </Box>
    </Paper>
  )
}

type UserItemProps = {
  user: User
  icon?: ReactNode
}
function UserItem(props: UserItemProps) {
  return (
    <>
      {!!props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}
      <ListItemText>
        <Typography
          color={(theme) => theme.palette.text.primary}
          variant="body1"
        >
          {props.user.name}
        </Typography>
      </ListItemText>
    </>
  )
}

type UserButton = {
  user: User
  isActive: boolean
  handleClick(): void
  overSelected: boolean
  type: "suggest" | "guess"
}
function UserButton(props: UserButton) {
  return (
    <FormControlLabel
      control={
        <ListItemIcon>
          {props.type === "suggest" ? (
            <Checkbox
              color={props.overSelected ? "error" : "primary"}
              checked={props.isActive}
              onChange={props.handleClick}
            />
          ) : (
            <Radio checked={props.isActive} onChange={props.handleClick} />
          )}
        </ListItemIcon>
      }
      label={
        <ListItemText>
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
        </ListItemText>
      }
    />
  )
}

export default ActionArea

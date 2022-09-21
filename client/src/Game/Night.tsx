import { User } from "@backend/utils"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemText,
} from "@mui/material"

type Props = {
  users: User[]
  user?: User
  show?: boolean
  handleClose(): void
}
const roles = {
  "Loyal Servant of Arthur": "good",
  Percival: "good",
  Merlin: "good",
  "Minion of Mordred": "bad",
  Assassin: "bad",
  Morgana: "bad",
}

export default function Night(props: Props) {
  if (!props.user?.role) return null
  const knownUsers: { name: string; role: string }[] = {
    "Loyal Servant of Arthur": [],
    Percival: props.users
      .filter((user) => user.role === "Merlin" || user.role === "Morgana")
      .map((user) => ({ name: user.name, role: "Merlin or Morgana" })),
    Merlin: props.users
      .filter((user) => user.role && roles[user.role] === "bad")
      .map((user) => ({ name: user.name, role: "Evil" })),
    "Minion of Mordred": props.users
      .filter((user) => user.role && roles[user.role] === "bad")
      .map((user) => ({ name: user.name, role: "Evil" })),
    Assassin: props.users
      .filter((user) => user.role && roles[user.role] === "bad")
      .map((user) => ({ name: user.name, role: "Evil" })),
    Morgana: props.users
      .filter((user) => user.role && roles[user.role] === "bad")
      .map((user) => ({ name: user.name, role: "Evil" })),
  }[props.user.role]

  return (
    <Dialog open={!!props.show}>
      <DialogTitle>Known Roles</DialogTitle>
      <DialogContent>
        <List>
          {knownUsers.map((known) => (
            <ListItemText key={known.name}>
              {known.name}: {known.role}
            </ListItemText>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

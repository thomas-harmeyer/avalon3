import { faker } from "@faker-js/faker"
import {
  Button,
  Container,
  List,
  Paper,
  Stack,
  Typography,
  Zoom,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { TransitionGroup } from "react-transition-group"
import { Lobby, LobbyUser } from "../utils"

const getUsers = (n: number): LobbyUser[] =>
  !n
    ? []
    : [
        { id: faker.random.alpha(1000), name: faker.name.firstName() },
        ...getUsers(n - 1),
      ]

const View = () => {
  const socket = useRef<WebSocket | null>(null)

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080")

    socket.current.onopen = () => console.log("socket open")
    socket.current.onclose = () => console.log("socket closed")

    const cur = socket.current
    return () => {
      console.log(cur)
      cur.close()
    }
  }, [])

  useEffect(() => {
    if (!socket.current) return
    socket.current.onmessage = ({ data }) => console.log(data)
  }, [])

  const [lobby, setLobby] = useState<Lobby>({
    users: getUsers(10),
    id: "12",
    status: "Lobby",
  })

  const haveDelay = useRef(true)

  /*
  function setUsers(users: LobbyUser[]) {
    setLobby((lobby) => ({ ...lobby, users: users }))
  }
  */

  function addUser(user: LobbyUser) {
    setLobby((lobby) => ({ ...lobby, users: [...lobby.users, user] }))
  }

  function removeUser(userId: string) {
    setLobby((lobby) => ({
      ...lobby,
      users: lobby.users.filter((user) => user.id !== userId),
    }))
  }

  return (
    <Container maxWidth="xs">
      <Button
        onClick={() =>
          addUser({
            id: (100 * Math.random() * 100).toString(),
            name: Math.random().toString(),
          })
        }
      >
        Add
      </Button>
      <Stack justifyContent="space-between" height={1}>
        <div />
        <Paper sx={{ width: 1, px: 2 }} elevation={12}>
          <List>
            <TransitionGroup>
              {lobby.users.map((user, index) => {
                const delay = () => {
                  const d = (haveDelay.current ? 100 * index : 0) + "ms"
                  if (index === lobby.users.length - 1) {
                    haveDelay.current = false
                  }
                  return d
                }
                return (
                  <Zoom
                    style={{
                      transitionDelay: delay(),
                    }}
                    key={user.id}
                  >
                    <Paper
                      sx={{ width: 1, my: 1, p: 1, textAlign: "center" }}
                      key={user.id}
                      onClick={() => removeUser(user.id)}
                    >
                      <Typography
                        color={(theme) => theme.palette.text.secondary}
                        variant="body1"
                      >
                        {user.name}
                      </Typography>
                    </Paper>
                  </Zoom>
                )
              })}
            </TransitionGroup>
          </List>
        </Paper>
        <Button variant="contained" sx={{ my: 2, width: 1, p: 2 }}>
          Start Game
        </Button>
      </Stack>
    </Container>
  )
}

export default View

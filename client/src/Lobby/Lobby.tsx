import {
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  Paper,
  Stack,
  Typography,
  Zoom,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { TransitionGroup } from "react-transition-group"
import { Lobby } from "@backend/utils"

const View = () => {
  const socket = useRef<WebSocket | null>(null)
  const [lobby, setLobby] = useState<Lobby | null>()

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080")

    socket.current.onopen = () => console.log("socket open")
    socket.current.onclose = () => console.log("socket closed")

    const cur = socket.current
    return () => {
      cur.close()
    }
  }, [])

  useEffect(() => {
    if (!socket.current) return
    socket.current.onmessage = ({ data }) => console.log(data)
  }, [])

  const haveDelay = useRef(true)

  if (!lobby) {
    return (
      <Box height={1} width={1} justifyContent='center' alignItems='center'>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xs">
      <Stack justifyContent="space-between" height={1}>
        <Paper sx={{ width: 1, px: 2 }} elevation={12}>
          <List>
            <TransitionGroup>
              {lobby.users.map((user, index) => {
                const getDelay = () => {
                  const delay = (haveDelay.current ? 100 * index : 0) + "ms"
                  if (index === lobby.users.length - 1) {
                    haveDelay.current = false
                  }
                  return delay
                }
                return (
                  <Zoom
                    style={{
                      transitionDelay: getDelay(),
                    }}
                    key={user.id}
                  >
                    <Paper
                      sx={{ width: 1, my: 1, p: 1, textAlign: "center" }}
                      key={user.id}>
                      <Typography
                        color={(theme) => theme.palette.text.secondary}
                        variant="body1">
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

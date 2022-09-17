import { AutoAction } from "@backend/request"
import { Game } from "@backend/utils"
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Container,
  Divider,
  Grid,
  LinearProgress,
} from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import useWebSocket, { ReadyState } from "react-use-websocket"

const url = import.meta.env.VITE_WS_SERVER_URL
if (!url) throw "missing url env var"

const Landing = () => {
  const name = useMemo(() => localStorage.getItem("username"), [])
  const navigate = useNavigate()
  const [lobbies, setLobbies] = useState<Game[] | null>(null)
  const {
    sendJsonMessage: sendMsg,
    lastJsonMessage: lastMsg,
    readyState,
  } = useWebSocket(url)

  const createLobby = useCallback(() => {
    if (!name) return
    const msg: AutoAction = { type: "create", name }
    sendMsg(msg)
  }, [name, sendMsg])

  const joinLobby = useCallback(
    (lobbyId: number) => () => {
      if (!name) return
      const msg: AutoAction = { type: "join", name, lobbyId }
      sendMsg(msg)
    },
    [name, sendMsg]
  )

  useEffect(() => {
    const msg: AutoAction = { type: "connect" }
    sendMsg(msg)
  }, [sendMsg])

  useEffect(() => {
    if (lastMsg != null) {
      if (Array.isArray(lastMsg)) {
        setLobbies(lastMsg as unknown as Game[])
      } else {
        setLobbies([lastMsg as unknown as Game])
      }
      console.log(lastMsg)
    }
  }, [lastMsg])

  useEffect(() => {
    if (!name) {
      console.log("navigating to login")
      navigate("/login")
    }
  }, [name, navigate])

  const isInLobby = useMemo(
    () =>
      lobbies != null &&
      !(
        lobbies.find((lobby) =>
          lobby.lobby.users.find((user) => user.name === name)
        ) == null
      ),
    [lobbies, name]
  )

  useEffect(() => {
    if (isInLobby) {
      console.log("navigating to lobby")
      navigate("/game")
    }
  }, [isInLobby, navigate])

  return (
    <Container>
      <Box
        height={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card>
          <CardHeader title={"Welcome to Avalon, " + name} />
          {lobbies == null || readyState !== ReadyState.OPEN ? (
            <LinearProgress />
          ) : (
            <CardActions>
              <Grid spacing={2} container>
                {lobbies.map((_, index) => (
                  <Grid item xs={3} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={joinLobby(index)}
                    >
                      {index}
                    </Button>
                  </Grid>
                ))}
                <Grid item xs>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={createLobby}
                    fullWidth
                  >
                    create new lobby
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          )}
        </Card>
      </Box>
    </Container>
  )
}

export default Landing

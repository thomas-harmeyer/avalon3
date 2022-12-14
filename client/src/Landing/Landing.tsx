import { AutoAction } from "@backend/request"
import { Game } from "@backend/utils"
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Container,
  Grid,
  LinearProgress,
  Snackbar,
} from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import Div100vh from "react-div-100vh"
import { useNavigate } from "react-router-dom"
import useWebSocket, { ReadyState } from "react-use-websocket"

const url = import.meta.env.VITE_WS_SERVER_URL
if (!url) throw "missing url env var"

function DoubleNameToast({
  handleClose,
  name,
}: {
  handleClose(): void
  name: string
}) {
  return (
    <Snackbar open onClose={handleClose}>
      <Alert>There is already someone named {name} is that lobby</Alert>
    </Snackbar>
  )
}
const Landing = () => {
  const name = useMemo(() => localStorage.getItem("username"), [])
  const navigate = useNavigate()
  const [lobbies, setLobbies] = useState<Game[] | null>(null)
  const [showDoubleNameToast, setShowDoubleNameToast] = useState(false)
  const {
    sendJsonMessage: sendMsg,
    lastJsonMessage: lastMsg,
    readyState,
  } = useWebSocket(url, {
    shouldReconnect: () => true,
  })

  const createLobby = useCallback(() => {
    if (!name) return
    const msg: AutoAction = { type: "create", name }
    sendMsg(msg)
  }, [name, sendMsg])

  const joinLobby = useCallback(
    (lobby: Game["lobby"]) => () => {
      if (!name) return
      if (lobby.users.find((user) => user.name === name)) {
        setShowDoubleNameToast(true)
        return
      }
      const msg: AutoAction = {
        type: "join",
        name,
        lobbyId: lobby.id,
      }
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
    <Div100vh>
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
                  {lobbies
                    .filter((lobby) => lobby.state === "lobby")
                    .map(({ lobby }, index) => (
                      <Grid item md={4} xs={6} key={index} p={1}>
                        <Button
                          fullWidth
                          sx={{ height: 1 }}
                          variant="outlined"
                          onClick={joinLobby(lobby)}
                        >
                          {lobby.id}
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
        {showDoubleNameToast && (
          <DoubleNameToast
            name={name ?? ""}
            handleClose={() => setShowDoubleNameToast(false)}
          />
        )}
      </Container>
    </Div100vh>
  )
}

export default Landing

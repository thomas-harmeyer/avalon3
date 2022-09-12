import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Container,
  Divider,
  LinearProgress,
} from "@mui/material"
import { Message } from "@backend/request"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import useWebSocket, { ReadyState } from "react-use-websocket"

const url = import.meta.env.VITE_WS_SERVER_URL
if (!url) throw "missing url env var"

const Landing = () => {
  const username = useMemo(() => localStorage.getItem("username"), [])
  const navigate = useNavigate()
  useEffect(() => {
    if (!username) navigate("/login", { replace: true })
  }, [])

  const [lobbies, setLobbies] = useState<string[]>([])
  const {
    sendJsonMessage: send,
    lastJsonMessage: lastMsg,
    readyState,
  } = useWebSocket(url)

  useEffect(() => {
    if (lastMsg && lastMsg.data !== lobbies) {
      setLobbies
    }
  }, [])

  return (
    <Container>
      <Box
        height={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card>
          <CardHeader title={"Welcome to Avalon, " + username} />
          {!lobbies.length ? (
            <LinearProgress />
          ) : (
            <CardActions>
              {lobbies.map((lobby) => (
                <Button variant="outlined">{lobby}</Button>
              ))}
              <Divider flexItem orientation="vertical" />
              <Button color="secondary" variant="contained">
                create new lobby
              </Button>
            </CardActions>
          )}
        </Card>
      </Box>
    </Container>
  )
}

export default Landing

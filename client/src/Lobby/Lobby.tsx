import { Alert, Box, Container, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import Body from "../Body"

const url = import.meta.env.VITE_WS_SERVER_URL
if (url === undefined) throw new Error("missing url env var")

type LobbyProps = {
  users: string[]
  id: string
  start(): void
}
const Lobby = ({ users, id, start }: LobbyProps) => {
  const [showWarning, setShowWarning] = useState(false)

  const startGame = useCallback(() => {
    if (5 <= users.length && users.length <= 10) {
      start()
    } else {
      setShowWarning(true)
    }
  }, [start, users.length])

  return (
    <Container maxWidth="xs">
      <Box display="flex" height={1} p={1} flexDirection="column">
        <Box></Box>
        {showWarning && (
          <Alert severity="warning" onClose={() => setShowWarning(false)}>
            {users.length < 5
              ? "You need at least 5 players to begin a game"
              : "You can have at most 10 players in one game"}
          </Alert>
        )}
        <Body
          state={
            <Typography variant="h4" color="snow">
              Lobby: {id}
            </Typography>
          }
          users={users}
          accept={{ handle: startGame, label: "Start Game" }}
        />
      </Box>
    </Container>
  )
}

export default Lobby

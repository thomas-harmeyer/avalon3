import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Container,
  Divider,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import useServer from "../Hooks/useServer"

const Landing = () => {
  const username = useMemo(() => localStorage.getItem("username"), [])

  const navigate = useNavigate()
  useEffect(() => {
    if (!username) navigate("/login", { replace: true })
  }, [])

  const [lobbies, setLobbies] = useState<string[]>([])
  const onmessage = (lobbies: string[]) => setLobbies(lobbies)
  useServer({ onmessage })

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
          <CardActions>
            {lobbies.map((lobby) => (
              <Button variant="outlined">{lobby}</Button>
            ))}
            <Divider flexItem orientation="vertical" />
            <Button color="secondary" variant="contained">
              create new lobby
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  )
}

export default Landing

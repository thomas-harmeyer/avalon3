import { Box, Button, Paper, TextField } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import Div100vh from "react-div-100vh"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const hasUsername = useMemo(() => !!localStorage.getItem("username"), [])
  const navigate = useNavigate()

  useEffect(() => {
    if (hasUsername) {
      console.log("navigating to /")
      navigate("/", { replace: true })
    }
  }, [hasUsername, navigate])

  const [input, setInput] = useState("")

  const handleChange = (e: { target: { value: string } }) =>
    setInput(e.target.value)

  const handleSubmit = () => {
    localStorage.setItem("username", input)
    console.log("navigating to /")
    navigate("/")
  }

  return (
    <Div100vh>
      <Box
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Paper elevation={6}>
          <Box m={1}>
            <TextField label="Name" value={input} onChange={handleChange} />
          </Box>
          <Box m={1} display="flex" justifyContent="end">
            <Button variant="outlined" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </Div100vh>
  )
}

export default Login

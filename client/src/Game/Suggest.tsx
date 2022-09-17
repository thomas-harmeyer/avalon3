import { Alert, Box, Grid, Typography } from "@mui/material"
import { useState } from "react"
import Body from "../Body"

type SuggestProps = {
  users: { name: string; id: string }[]
  missionSize: number
  suggestMission(suggested: string[]): void
}
const Suggest = (props: SuggestProps) => {
  const [suggestions, setSuggestions] = useState<Record<string, boolean>>(
    Object.fromEntries(props.users.map((user) => [user.id, false]))
  )
  const [showWarning, setShowWarning] = useState(false)

  const handleUserChange = (userId: string) => () =>
    setSuggestions((suggestions) => ({
      ...suggestions,
      [userId]: !suggestions[userId],
    }))

  const handleSubmit = () => {
    const selected = Object.entries(suggestions)
      .filter((user) => user[1])
      .map((user) => user[0])
    if (selected.length === props.missionSize) {
      console.log(JSON.stringify({ selected }))
      props.suggestMission(selected)
    } else {
      setShowWarning(true)
    }
  }

  return (
    <>
      <Box>
        <Typography variant="h5">Suggest A Mission</Typography>
        <hr />
      </Box>
      <Grid container spacing={1}>
        {showWarning && (
          <Grid item xs={12}>
            <Alert severity="warning" onClose={() => setShowWarning(false)}>
              You must have {props.missionSize} people on this mission
            </Alert>
          </Grid>
        )}
        <Body
          users={props.users.map((user) => user.name)}
          accept={{ handle: handleSubmit, label: "Suggest Mission" }}
        />
      </Grid>
    </>
  )
}

export default Suggest

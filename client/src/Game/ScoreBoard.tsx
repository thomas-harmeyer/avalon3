import Close from "@mui/icons-material/Close"
import { Game } from "@backend/utils"
import CheckIcon from "@mui/icons-material/Check"
import { Stack } from "@mui/material"

type ScoreBoardProps = {
  rounds: Game["rounds"]
}
const ScoreBoard = (props: ScoreBoardProps) => {
  return (
    <Stack direction="row">
      {props.rounds.map((round) => {
        if (round.passed === undefined) {
          return null
        }
        return round.passed ? <CheckIcon /> : <Close />
      })}
    </Stack>
  )
}

export default ScoreBoard

import { Close } from "@mui/icons-material"
import Check from "@mui/icons-material/Check"
import { Box } from "@mui/system"
import Body from "../Body"

type VoteProps = {
  suggested: string[]
  suggester: string
  vote(vote: boolean): void
}

const Vote = (props: VoteProps) => {
  const accept = () => props.vote(true)
  const reject = () => props.vote(false)
  return (
    <Box>
      <Box>Vote on mission suggested by {props.suggester}</Box>

      <Body
        users={props.suggested}
        accept={{ handle: accept, label: <Check /> }}
        reject={{ handle: reject, label: <Close /> }}
      />
    </Box>
  )
}

export default Vote

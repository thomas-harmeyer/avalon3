import { Game } from "@backend/utils"
import CheckIcon from "@mui/icons-material/Check"
import Close from "@mui/icons-material/Close"
import QuestionMarkIcon from "@mui/icons-material/QuestionMark"
import {
  Box,
  List,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Zoom,
} from "@mui/material"
import { useState } from "react"
import { TransitionGroup } from "react-transition-group"
import VoteModal from "./VoteModal"

type ScoreBoardProps = {
  rounds: Game["rounds"]
  numberOfPlayers: number
  state: Game["state"]
  missionProfile: Game["missionProfile"]
}
const ScoreBoard = (props: ScoreBoardProps) => {
  const [voteModalIndex, setVoteModalIndex] = useState<number | null>(null)
  console.log(voteModalIndex)
  if (props.state === "lobby") return null

  const handleVoteModalClick = (index: number) => () => {
    if (index >= props.rounds.length) return
    setVoteModalIndex(index)
  }
  function getResult(index: number) {
    const result = props.rounds[index]?.passed
    if (result === undefined) return result
    if (result) return "pass"
    return "fail"
  }

  return (
    <Paper>
      <VoteModal
        numberOfPlayers={props.numberOfPlayers}
        missions={
          voteModalIndex === null ? null : props.rounds[voteModalIndex].missions
        }
        handleClose={() => setVoteModalIndex(null)}
        show={voteModalIndex !== null}
      />

      <Stack justifyContent="space-evenly" direction="row" p={1}>
        {props.missionProfile.map((numberOfPlayers, index) => (
          <ScoreBox
            key={index}
            state={props.state}
            result={getResult(index)}
            round={props.rounds[index]}
            numOfPlayers={numberOfPlayers}
            onClick={handleVoteModalClick(index)}
          />
        ))}
      </Stack>
    </Paper>
  )
}

type ScoreBoxProps = {
  result?: "pass" | "fail"
  round: Game["rounds"][number] | undefined
  numOfPlayers: number
  state: Game["state"]
  onClick(): void
}
function ScoreBox(props: ScoreBoxProps) {
  function renderIcons() {
    if (!props.round)
      return (
        <Zoom in>
          <Box>
            <QuestionMarkIcon />
          </Box>
        </Zoom>
      )
    if (props.round.actions.length === 0) {
      const bgcolor: Partial<Record<Game["state"], string>> = {
        act: "violet",
        suggest: "gray",
      }
      return (
        <Zoom in>
          <Skeleton sx={{ bgcolor }} variant="circular" />
        </Zoom>
      )
    }
    return (
      <List>
        <TransitionGroup>
          {props.round.actions
            .sort((a, b) => (a.vote === b.vote ? 0 : a ? -1 : 1))
            .map((action, index) => (
              <Zoom
                key={action.user.name}
                style={{ transitionDelay: `${index * 250}ms` }}
              >
                <Box>
                  {action.vote ? (
                    <CheckIcon color="disabled" />
                  ) : (
                    <Close color="disabled" />
                  )}
                </Box>
              </Zoom>
            ))}
        </TransitionGroup>
      </List>
    )
  }

  const getBgColor = () => {
    switch (props.result) {
      case "pass":
        return "green"
      case "fail":
        return "red"
      default:
        return "gray"
    }
  }
  return (
    <Paper>
      <Box
        height={1}
        px={2}
        textAlign="center"
        display="flex"
        flexDirection="column"
        bgcolor={getBgColor()}
        borderRadius={2}
        onClick={props.onClick}
      >
        <Typography variant="h4">{props.numOfPlayers}</Typography>
        {renderIcons()}
      </Box>
    </Paper>
  )
}
export default ScoreBoard

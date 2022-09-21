import { Mission } from "@backend/utils"
import { QuestionMark, ThumbDown, ThumbUp } from "@mui/icons-material"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material"
import { useEffect, useState } from "react"

type VoteModalProp = {
  missions: Mission[] | null
  numberOfPlayers: number
  show: boolean
  handleClose(): void
}
export default function VoteModal({
  numberOfPlayers,
  missions,
  show,
  handleClose,
}: VoteModalProp) {
  const [lastMissions, setLastMissions] = useState(missions)
  useEffect(() => {
    if (missions !== lastMissions) {
      if (missions) setLastMissions(missions)
    }
  }, [lastMissions, missions])
  function renderVoteIcon(numberOfVotes: number, vote?: boolean) {
    if (vote === undefined || numberOfVotes !== numberOfPlayers)
      return <QuestionMark />
    if (vote) return <ThumbUp />
    return <ThumbDown />
  }
  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>Votes</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="row">
          {lastMissions?.map((lastMission, index) => (
            <Box px={1} key={index}>
              <List>
                <ListItem>
                  <ListItemText>Suggestion {index + 1}</ListItemText>
                </ListItem>
                <Divider />
                {lastMission.votes.map((vote, index) => (
                  <ListItem key={index}>
                    <ListItemText>{vote.user.name}</ListItemText>
                    <ListItemSecondaryAction>
                      {renderVoteIcon(lastMission.votes.length, vote.vote)}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

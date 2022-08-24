import { Box } from "@mui/system"
import { Game, Player } from "../utils"
import { useState } from "react"
import { Collapse } from "@mui/material"
export type Props = {
  game: Game
  user: Player
}

function getRolesToShow(_role: string): string[] {
  return ["", ""]
}

const Night = ({ game: { users }, user: { role } }: Props) => {
  const [hide, setHide] = useState({ role: false, other: false })

  return (
    <Box>
      Your role is:
      <Collapse in={!hide.role}>
        <Box onClick={() => setHide((hide) => ({ ...hide, role: !hide.role }))}>
          {role}
        </Box>
      </Collapse>
      The other roles you know are:
      <Collapse in={!hide.other}>
        <Box
          onClick={() => setHide((hide) => ({ ...hide, other: !hide.other }))}
        >
          {getRolesToShow(role).map((oRule) => {
            const oUser = users.find((user) => user.role === oRule)
            if (oUser)
              return (
                <Box>
                  {oUser.name} is {oRule}
                </Box>
              )
            else return null
          })}
        </Box>
      </Collapse>
    </Box>
  )
}

export default Night

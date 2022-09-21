import { Game } from "@backend/utils"
import { BedtimeOutlined } from "@mui/icons-material"
import { AppBar, Box, IconButton, styled, Toolbar } from "@mui/material"
import { useMemo, useState } from "react"
import Night from "./Night"

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar)

type NavbarProps = {
  game: Game
  name: string
}

function Navbar({ name, game }: NavbarProps) {
  const [showNight, setShowNight] = useState(true)
  const title = useMemo(() => {
    const formattedTitle =
      game.state.charAt(0).toUpperCase() + game.state.substring(1)

    const titleMap: Record<Game["state"], string> = {
      lobby: `${formattedTitle}: ${game.lobby.id}`,
      suggest: `${formattedTitle} ${
        game.missionProfile[game.rounds.length - 1]
      } users`,
      act: `Choose good or evil`,
      guess: `Guess who Merlin is`,
      vote: `Vote on mission suggested by: ${
        game.rounds.at(-1)?.missions.at(-1)?.suggester.name ?? "Error"
      }`,
      done: "Had fun? Play again!",
    }

    return titleMap[game.state]
  }, [game.lobby.id, game.missionProfile, game.rounds, game.state])
  return (
    <>
      <AppBar>
        <Night
          handleClose={() => setShowNight(false)}
          show={showNight}
          user={game.lobby.users.find((user) => user.name === name)}
          users={game.lobby.users}
        />
        <Toolbar>
          {title}
          <Box flexGrow={1} />
          {game.state !== "lobby" && (
            <IconButton onClick={() => setShowNight(true)}>
              <BedtimeOutlined />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  )
}

export default Navbar

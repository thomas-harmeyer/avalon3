import { Game } from "@backend/utils"
import { AppBar, styled, Toolbar } from "@mui/material"
import { useMemo } from "react"

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar)

type NavbarProps = {
  game: Game
}

function Navbar({ game }: NavbarProps) {
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
        <Toolbar>{title}</Toolbar>
      </AppBar>
      <Offset />
    </>
  )
}

export default Navbar

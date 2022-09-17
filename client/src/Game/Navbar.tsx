import { AppBar, styled, Toolbar } from "@mui/material"

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar)

const Navbar = () => {
  return (
    <>
      <AppBar>
        <Toolbar></Toolbar>
      </AppBar>
      <Offset />
    </>
  )
}
export default Navbar

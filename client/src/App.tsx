//views
import GameView from "./Game/Game"
import Landing from "./Landing/Landing"
import Lobby from "./Lobby/Lobby"
import Login from "./Login/Login"

//Contexts
//npm
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

//css
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import "./App.css"

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            height: "100vh",
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<GameView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App;

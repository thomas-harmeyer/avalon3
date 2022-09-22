//views
import Game from "./Game/Game"
import Landing from "./Landing/Landing"

import Login from "./Login/Login"

//Contexts
//npm
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

//css
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
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
            height: "100%",
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
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

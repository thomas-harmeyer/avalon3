import { User } from "@backend/utils"
import {
  Alert,
  AppBar,
  Box,
  Button,
  List,
  Paper,
  Stack,
  styled,
  Toolbar,
  Typography,
  Zoom,
} from "@mui/material"
import { useRef } from "react"
import { TransitionGroup } from "react-transition-group"

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar)

export type Action = {
  handle(): void
  label: React.ReactNode
}

export type BodyProps = {
  title: string
  users: User[]
  handleUserClick(user: User): void
  warning: { label?: string; handleClose(): void }
  accept: Action
  reject?: Action
}

const ActionView = (props: Action) => {
  return (
    <Button variant="contained" sx={{ my: 1, p: 1 }} onClick={props.handle}>
      {props.label}
    </Button>
  )
}

const Body = (props: BodyProps) => {
  const haveDelay = useRef(true)
  const handleClick = (user: User) => () => props.handleUserClick(user)
  console.log(props)
  return (
    <Stack justifyContent="space-between" flexGrow={1} flexBasis={1} py={2}>
      {props.title && (
        <>
          <AppBar>
            <Toolbar>{props.title}</Toolbar>
          </AppBar>
          <Offset />
        </>
      )}
      <Paper sx={{ width: 1, px: 2 }} elevation={12}>
        <List>
          <TransitionGroup>
            {!!props.warning.label && (
              <Alert severity="warning" onClose={props.warning.handleClose}>
                {props.warning.label}
              </Alert>
            )}
            {props.users.map((user, index) => {
              const getDelay = () => {
                const delay = (haveDelay.current ? 100 * index : 0) + "ms"
                if (index === props.users.length - 1) {
                  haveDelay.current = false
                }
                return delay
              }
              return (
                <Zoom
                  style={{
                    transitionDelay: getDelay(),
                  }}
                  key={user.id}
                >
                  <Box onClick={handleClick(user)}>
                    <Paper
                      sx={{ width: 1, my: 1, p: 1, textAlign: "center" }}
                      key={user.id}
                    >
                      <Typography
                        color={(theme) => theme.palette.text.secondary}
                        variant="body1"
                      >
                        {user.name}
                      </Typography>
                    </Paper>
                  </Box>
                </Zoom>
              )
            })}
          </TransitionGroup>
        </List>
      </Paper>
      <ActionView {...props.accept} />
      {!!props.reject && <ActionView {...props.reject} />}
    </Stack>
  )
}

//  <Box display="flex">
//           <Box flexGrow={1}>
//             <BottomButton color="error" variant="contained" fullWidth>
//               <CloseIcon fontSize="large" />
//             </BottomButton>
//           </Box>
//           <Box flexGrow={1}>
//             <BottomButton color="success" variant="contained" fullWidth>
//               <CheckIcon fontSize="large" />
//             </BottomButton>
//           </Box>
//         </Box>

export default Body

import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  CardActions,
  Button,
  } from "@mui/material";
import HelpDisplay from "./HelpDisplay";

const Landing = () => {
  return (
    <Container>
      <Box
        height={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card>
          <CardHeader title="Welcome to Avalon" action={<HelpDisplay />} />
          <CardContent>
            <Typography variant="subtitle1">
              If you're new here, welcome! Click the help icon in the corner to
              get fimiliar with how to play. Otherwise, welcome back have fun
              playing Avalon!
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="outlined">{"1"}</Button>
            <Button variant="outlined">{"2"}</Button>
            <Divider flexItem orientation="vertical" />
            <Button color="secondary" variant="contained">
              {"create new lobby"}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};

export default Landing;

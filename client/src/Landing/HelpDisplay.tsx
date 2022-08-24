import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";

import { useState } from "react";

const HelpDisplay = () => {
  const [displayHelp, setDisplayHelp] = useState(false);
  const showHelp = () => setDisplayHelp(true);
  const hideHelp = () => setDisplayHelp(false);

  return (
    <>
      <IconButton onClick={showHelp}>
        <HelpOutlineIcon />
      </IconButton>
      <Dialog open={displayHelp} onClose={hideHelp}>
        <DialogTitle>Help</DialogTitle>
        <DialogContent>Here's how you play:</DialogContent>
      </Dialog>
    </>
  );
};
export default HelpDisplay;

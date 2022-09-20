import { Alert, Zoom } from "@mui/material"
import { useEffect, useState } from "react"

function Warning(props: { label?: string; handleClose(): void }) {
  const [message, setMessage] = useState("")
  useEffect(() => {
    if (props.label) setMessage(props.label)
  }, [props.label])

  return (
    <Zoom mountOnEnter unmountOnExit in={!!props.label}>
      <Alert severity="warning" onClose={props.handleClose}>
        {message}
      </Alert>
    </Zoom>
  )
}

export default Warning

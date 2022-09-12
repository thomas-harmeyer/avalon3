import { useRef, useEffect } from "react"

type UserServerProps = {
  onmessage: (data: any) => void
}

const useServer = ({ onmessage }: UserServerProps) => {
  const url = import.meta.env.VITE_WS_SERVER_URL
  if (!url) throw "missing url env var"
  console.log({url})

  const socket = useRef<WebSocket | null>()

  useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocket(url)

      socket.current.onopen = () => console.log("socket opened")
      socket.current.onclose = () => console.log("socket closed")

      const cur = socket.current
      return () => {
        cur.close()
      }
    }
  }, [socket])

  useEffect(() => {
    if (socket.current) {
      socket.current.onmessage = onmessage
    }
  }, [socket.current, onmessage])

  return socket
}

export default useServer

import { AutoAction, UserAction } from "@backend/request"
import { Game } from "@backend/utils"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { JsonValue } from "react-use-websocket/dist/lib/types"

const url = import.meta.env.VITE_WS_SERVER_URL
if (url === undefined) throw new Error("missing url env var")

const useGame = (name: string | null) => {
  const navigate = useNavigate()
  const [game, setGame] = useState<Game | null>(null)
  const { sendJsonMessage, lastJsonMessage, lastMessage, readyState } =
    useWebSocket(url)

  useEffect(() => {
    if (!lastMessage) return
    if (lastMessage.data.charAt(0) === "/") navigate(lastMessage.data)
  }, [lastMessage, navigate])

  useEffect(() => {
    if (!name || readyState !== ReadyState.OPEN) return
    const msg: AutoAction = { type: "connect", name }
    console.log("sending message", msg)
    sendJsonMessage(msg)
  }, [name, readyState, sendJsonMessage])

  useEffect(() => {
    if (lastJsonMessage === null || !Object.keys(lastJsonMessage).length) return
    console.log("setting game", lastJsonMessage)
    setGame(lastJsonMessage as unknown as Game)
  }, [lastJsonMessage])

  const suggest = (suggested: string[]) => {
    const msg: UserAction = { type: "suggest", suggested: suggested }
    sendJsonMessage(msg as unknown as JsonValue)
  }

  const start = () => {
    const msg: UserAction = { type: "start" }
    sendJsonMessage(msg)
  }

  const vote = (vote: boolean) => {
    const msg: UserAction = { type: "vote", vote }
    sendJsonMessage(msg)
  }

  const act = (action: boolean) => {
    const msg: UserAction = { type: "act", action }
    sendJsonMessage(msg)
  }

  const guess = (guess: string) => {
    const msg: UserAction = { type: "guess", guess }
    sendJsonMessage(msg)
  }

  return { game, sendJsonMessage, suggest, start, vote, act, guess }
}

export default useGame

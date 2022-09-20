import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const errorMessages = {
  suggest: (countOnMission: number) =>
    `Please suggest a mission with ${countOnMission} players on it.`,
  start: (countOfPlayersInLobby: number) => {
    if (countOfPlayersInLobby > 10) return "Max of 10 players in one game."
    return "Need at least 5 players to start the game."
  },
  guess: () => "Select a user to guess",
}

type Warning = { label?: string; handleClose(): void }

function useError(state: null | string) {
  const [error, setError] = useState<null | string>(null)
  const oldState = useRef(state)

  useEffect(() => {
    if (state !== oldState.current) {
      oldState.current = state
      setError(null)
    }
  }, [oldState, state])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const warning: Warning = useMemo(
    () => ({
      label: error ?? undefined,
      handleClose: clearError,
    }),
    [clearError, error]
  )

  return { warning, handleError: setError }
}

export { useError, errorMessages }

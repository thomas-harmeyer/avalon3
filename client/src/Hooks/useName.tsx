import { useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
const useName = () => {
  const navigate = useNavigate()
  const name = useMemo(() => localStorage.getItem("username"), [])
  useEffect(() => {
    if (!name) navigate("/login")
  })
  return name
}

export default useName

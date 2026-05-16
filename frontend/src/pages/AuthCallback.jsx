import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const user = params.get('user')

    if (token && user) {
      login(JSON.parse(decodeURIComponent(user)), token)
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [])

  return <div className="loading">Logging you in...</div>
}

export default AuthCallback
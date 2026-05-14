import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/api/auth/login', { email, password })
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '40px' }}>🚨</span>
        <h2 style={{ marginTop: '12px' }}>Welcome back</h2>
        <p className="auth-subtitle">Log in to your CrashApp account</p>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '8px' }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', color: '#666', fontSize: '14px' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#6c63ff', fontWeight: '700' }}>
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default Login
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, isAuth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🚨 CrashApp
      </Link>

      <div className="navbar-links">
        {isAuth ? (
          <>
            <Link to="/reports/new">
              <button className="btn-primary">+ File Report</button>
            </Link>
            <Link to={`/users/${user.id}`}>
              <button className="btn-outline">{user.name}</button>
            </Link>
            <button className="btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn-outline">Log In</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'

function Navbar() {
  const { user, isAuth, logout } = useAuth()
  const { confirm, toast } = useUI()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarFailed, setAvatarFailed] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    const handleEsc = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const handleLogout = async () => {
    setMenuOpen(false)
    const ok = await confirm({
      title: 'Log out?',
      message: 'You\'ll need to sign back in to file or upvote reports.',
      confirmText: 'Log out',
      tone: 'danger'
    })
    if (!ok) return
    logout()
    toast('Logged out', { tone: 'success' })
    navigate('/')
  }

  const initial = user?.name?.[0]?.toUpperCase() || '?'
  const showAvatar = user?.avatar_url && !avatarFailed

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-mark">⚡</span> CrashApp
      </Link>

      <div className="navbar-links">
        {isAuth ? (
          <>
            <Link to="/reports/new">
              <button className="btn-primary nav-cta">
                <span className="nav-cta-plus">+</span> File Report
              </button>
            </Link>

            <div className="nav-user" ref={menuRef}>
              <button
                className="nav-user-trigger"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                {showAvatar ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="nav-avatar"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <span className="nav-avatar nav-avatar-fallback">{initial}</span>
                )}
                <span className="nav-user-name">{user.name}</span>
                <svg
                  className={`nav-chevron ${menuOpen ? 'nav-chevron-open' : ''}`}
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {menuOpen && (
                <div className="nav-menu" role="menu">
                  <div className="nav-menu-header">
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--soft)', marginTop: 2, wordBreak: 'break-all' }}>
                      {user.email}
                    </div>
                  </div>
                  <Link to={`/users/${user.id}`} onClick={() => setMenuOpen(false)} className="nav-menu-item">
                    <span className="nav-menu-icon">👤</span> Your Profile
                  </Link>
                  <Link to="/reports/new" onClick={() => setMenuOpen(false)} className="nav-menu-item">
                    <span className="nav-menu-icon">📝</span> File a Report
                  </Link>
                  <div className="nav-menu-divider" />
                  <button onClick={handleLogout} className="nav-menu-item nav-menu-danger">
                    <span className="nav-menu-icon">↩</span> Log Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn-ghost">Log In</button>
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

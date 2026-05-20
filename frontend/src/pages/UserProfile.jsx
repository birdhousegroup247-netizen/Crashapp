import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

function UserProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [avatarFailed, setAvatarFailed] = useState(false)
  const { user: currentUser } = useAuth()

  useEffect(() => {
    setAvatarFailed(false)
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/api/users/${id}`)
        setProfile(res.data)
      } catch {
        setError('User not found')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  const severityClass = (severity) => {
    switch (severity) {
      case 'Low': return 'badge badge-low'
      case 'Medium': return 'badge badge-medium'
      case 'High': return 'badge badge-high'
      case 'Critical': return 'badge badge-critical'
      default: return 'badge'
    }
  }

  if (loading) return <div className="loading">Loading profile...</div>
  if (error) return (
    <div className="page-container">
      <p className="error-msg">{error}</p>
      <Link to="/" style={{ color: '#6c63ff', fontWeight: '600' }}>← Back to Feed</Link>
    </div>
  )

  const initial = profile.user.name?.[0]?.toUpperCase() || '?'
  const isOwnProfile = currentUser && currentUser.id === profile.user.id
  const totalUpvotes = profile.reports.reduce(
    (sum, r) => sum + Number(r.upvote_count || 0),
    0
  )
  const ongoingCount = profile.reports.filter((r) => r.status === 'Ongoing').length
  const showAvatar = profile.user.avatar_url && !avatarFailed

  return (
    <div className="page-container">
      <Link to="/" style={{ color: '#6c63ff', fontWeight: '600', fontSize: '14px' }}>
        ← Back to Feed
      </Link>

      <div className="profile-hero">
        <div className="profile-hero-bg" />
        <div className="profile-hero-content">
          {showAvatar ? (
            <img
              src={profile.user.avatar_url}
              alt={profile.user.name}
              className="profile-avatar"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="profile-avatar profile-avatar-fallback">{initial}</div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="profile-name">{profile.user.name}</h2>
            <p className="profile-email">{profile.user.email}</p>
            <p className="profile-joined">
              Joined {new Date(profile.user.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>

          {isOwnProfile && (
            <Link to="/reports/new">
              <button className="btn-primary">+ File Report</button>
            </Link>
          )}
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{profile.reports.length}</div>
          <div className="stat-label">Reports filed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalUpvotes}</div>
          <div className="stat-label">Upvotes earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{ongoingCount}</div>
          <div className="stat-label">Still ongoing</div>
        </div>
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: '8px 0 16px' }}>
        Reports
      </h3>

      {profile.reports.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: 'linear-gradient(135deg, #f8f9ff 0%, #eef0ff 100%)',
          border: '2px dashed #c7c4ff'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
          <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>
            {isOwnProfile ? 'You haven\'t filed any reports yet' : 'No reports yet'}
          </h4>
          <p style={{ color: '#666', marginBottom: isOwnProfile ? '20px' : 0 }}>
            {isOwnProfile
              ? 'Spotted a tool outage or bug? File your first report.'
              : 'This user hasn\'t reported any issues yet.'}
          </p>
          {isOwnProfile && (
            <Link to="/reports/new">
              <button className="btn-primary" style={{ padding: '12px 24px' }}>
                + File Your First Report
              </button>
            </Link>
          )}
        </div>
      ) : (
        profile.reports.map((report) => (
          <div key={report.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/reports/${report.id}`}>
                  <h4 style={{
                    fontSize: '17px',
                    fontWeight: '700',
                    color: '#1a1a2e',
                    marginBottom: '8px'
                  }}>
                    {report.title}
                  </h4>
                </Link>
                <p style={{ color: '#6c63ff', fontWeight: '700', marginBottom: '12px', fontSize: '14px' }}>
                  {report.tool_name}
                </p>
                <div>
                  <span className={severityClass(report.severity)}>{report.severity}</span>
                  <span className={`badge ${report.status === 'Ongoing' ? 'badge-ongoing' : 'badge-resolved'}`}>
                    {report.status}
                  </span>
                </div>
                <p style={{ color: '#999', fontSize: '13px', marginTop: '12px' }}>
                  {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#6c63ff',
                fontWeight: '800'
              }}>
                <span style={{ fontSize: '20px' }}>▲</span>
                <span style={{ fontSize: '18px' }}>{report.upvote_count}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default UserProfile

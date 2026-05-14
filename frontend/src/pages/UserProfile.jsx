import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'

function UserProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/users/${id}`)
        setProfile(res.data)
      } catch (err) {
        setError('User not found')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  if (loading) return <p>Loading profile...</p>
  if (error) return <p>{error}</p>

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <Link to="/">← Back to Feed</Link>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '24px',
        marginTop: '20px',
        marginBottom: '30px'
      }}>
        <h2>{profile.user.name}</h2>
        <p>{profile.user.email}</p>
        <p style={{ color: 'gray', fontSize: '14px' }}>
          Joined {new Date(profile.user.created_at).toLocaleDateString()}
        </p>
      </div>

      <h3>Reports by {profile.user.name}</h3>

      {profile.reports.length === 0 ? (
        <p>No reports yet.</p>
      ) : (
        profile.reports.map((report) => (
          <div key={report.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <h4>
              <Link to={`/reports/${report.id}`}>{report.title}</Link>
            </h4>
            <p><strong>Tool:</strong> {report.tool_name}</p>
            <p>
              <span style={{ marginRight: '8px' }}>{report.severity}</span>
              <span>{report.status}</span>
            </p>
            <p style={{ color: 'gray', fontSize: '14px' }}>
              ▲ {report.upvote_count} upvotes
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default UserProfile
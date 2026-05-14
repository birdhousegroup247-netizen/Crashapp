import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

function SingleReport() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, isAuth } = useAuth()
  const navigate = useNavigate()

  const fetchReport = async () => {
    try {
      const res = await api.get(`/api/reports/${id}`)
      setReport(res.data)
    } catch (err) {
      setError('Report not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [id])

  const handleUpvote = async () => {
    if (!isAuth) return alert('Please login to upvote')
    try {
      if (report.has_upvoted) {
        await api.delete(`/api/reports/${id}/upvote`)
      } else {
        await api.post(`/api/reports/${id}/upvote`)
      }
      fetchReport()
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report?')) return
    try {
      await api.delete(`/api/reports/${id}`)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong')
    }
  }

  const severityClass = (severity) => {
    switch (severity) {
      case 'Low': return 'badge badge-low'
      case 'Medium': return 'badge badge-medium'
      case 'High': return 'badge badge-high'
      case 'Critical': return 'badge badge-critical'
      default: return 'badge'
    }
  }

  if (loading) return <div className="loading">Loading report...</div>
  if (error) return (
    <div className="page-container">
      <p className="error-msg">{error}</p>
      <Link to="/">← Back to Feed</Link>
    </div>
  )

  return (
    <div className="page-container">
      <Link to="/" style={{ color: '#6c63ff', fontWeight: '600', fontSize: '14px' }}>
        ← Back to Feed
      </Link>

      <div className="card" style={{ marginTop: '24px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '12px' }}>
              {report.title}
            </h2>
            <p style={{ color: '#6c63ff', fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>
              {report.tool_name}
            </p>
            <div style={{ marginBottom: '20px' }}>
              <span className={severityClass(report.severity)}>
                {report.severity}
              </span>
              <span className={`badge ${report.status === 'Ongoing' ? 'badge-ongoing' : 'badge-resolved'}`}>
                {report.status}
              </span>
            </div>
          </div>
          <button
            className={`upvote-btn ${report.has_upvoted ? 'upvoted' : ''}`}
            onClick={handleUpvote}
            style={{ marginLeft: '24px' }}
          >
            ▲ {report.upvote_count}
          </button>
        </div>

        <div style={{
          background: '#f8f9ff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          lineHeight: '1.7',
          color: '#444'
        }}>
          {report.description}
        </div>

        {report.screenshot_url && (
          <img
            src={report.screenshot_url}
            alt="Screenshot"
            style={{
              maxWidth: '100%',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #eee'
            }}
          />
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '16px'
        }}>
          <p style={{ color: '#999', fontSize: '13px' }}>
            By <strong style={{ color: '#6c63ff' }}>{report.author_name}</strong> • {new Date(report.created_at).toLocaleDateString()}
          </p>

          {user && user.id === report.user_id && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to={`/reports/${id}/edit`}>
                <button className="btn-outline" style={{ padding: '8px 18px' }}>
                  ✏️ Edit
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="btn-danger"
                style={{ padding: '8px 18px' }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SingleReport
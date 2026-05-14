import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

function Feed() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [tool, setTool] = useState('')
  const [status, setStatus] = useState('')
  const { isAuth } = useAuth()

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/reports', {
        params: { q: search, tool, status }
      })
      setReports(res.data)
    } catch (err) {
      setError('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [search, tool, status])

  const handleUpvote = async (reportId, hasUpvoted) => {
    if (!isAuth) return alert('Please login to upvote')
    try {
      if (hasUpvoted) {
        await api.delete(`/api/reports/${reportId}/upvote`)
      } else {
        await api.post(`/api/reports/${reportId}/upvote`)
      }
      fetchReports()
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

  if (loading) return (
    <div className="page-container">
      <p>Loading reports...</p>
    </div>
  )

  if (error) return (
    <div className="page-container">
      <p className="error-msg">{error}</p>
    </div>
  )

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a2e' }}>
          Latest Outages & Bugs
        </h1>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Track and report issues with your favorite developer tools
        </p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by tool..."
          value={tool}
          onChange={(e) => setTool(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            No reports found. Be the first to report an issue!
          </p>
          {isAuth && (
            <Link to="/reports/new">
              <button className="btn-primary" style={{ marginTop: '16px' }}>
                + File a Report
              </button>
            </Link>
          )}
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Link to={`/reports/${report.id}`}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1a1a2e',
                    marginBottom: '8px'
                  }}>
                    {report.title}
                  </h3>
                </Link>
                <p style={{ color: '#666', marginBottom: '12px', fontSize: '14px' }}>
                  <strong style={{ color: '#6c63ff' }}>{report.tool_name}</strong>
                </p>
                <div>
                  <span className={severityClass(report.severity)}>
                    {report.severity}
                  </span>
                  <span className={`badge ${report.status === 'Ongoing' ? 'badge-ongoing' : 'badge-resolved'}`}>
                    {report.status}
                  </span>
                </div>
                <p style={{ color: '#999', fontSize: '13px', marginTop: '12px' }}>
                  By {report.author_name} • {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                className={`upvote-btn ${report.has_upvoted ? 'upvoted' : ''}`}
                onClick={() => handleUpvote(report.id, report.has_upvoted)}
                style={{ marginLeft: '16px', minWidth: '70px' }}
              >
                ▲ {report.upvote_count}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Feed
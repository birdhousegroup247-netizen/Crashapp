import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        const res = await api.get('/api/reports', { params: { q } })
        setReports(res.data)
      } catch {
        setError('Failed to load search results')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [q])

  const severityClass = (severity) => {
    switch (severity) {
      case 'Low': return 'badge badge-low'
      case 'Medium': return 'badge badge-medium'
      case 'High': return 'badge badge-high'
      case 'Critical': return 'badge badge-critical'
      default: return 'badge'
    }
  }

  if (loading) return <div className="loading">Searching...</div>
  if (error) return (
    <div className="page-container">
      <p className="error-msg">{error}</p>
    </div>
  )

  return (
    <div className="page-container">
      <Link to="/" style={{ color: '#6c63ff', fontWeight: '600', fontSize: '14px' }}>
        ← Back to Feed
      </Link>

      <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '24px 0 8px', color: '#1a1a2e' }}>
        Search results for "{q}"
      </h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        {reports.length} {reports.length === 1 ? 'match' : 'matches'} found
      </p>

      {reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>
            No reports found for "{q}". Try different keywords.
          </p>
        </div>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="card">
            <Link to={`/reports/${report.id}`}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' }}>
                {report.title}
              </h3>
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
              By {report.author_name} • {new Date(report.created_at).toLocaleDateString()} • ▲ {report.upvote_count}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default SearchResults

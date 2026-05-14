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
      } catch (err) {
        setError('Failed to load search results')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [q])

  const severityColor = (severity) => {
    switch (severity) {
      case 'Low': return 'green'
      case 'Medium': return 'orange'
      case 'High': return 'darkorange'
      case 'Critical': return 'red'
      default: return 'gray'
    }
  }

  if (loading) return <p>Searching...</p>
  if (error) return <p>{error}</p>

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <Link to="/">← Back to Feed</Link>

      <h2>Search Results for "{q}"</h2>

      {reports.length === 0 ? (
        <p>No reports found for "{q}". Try different keywords.</p>
      ) : (
        reports.map((report) => (
          <div key={report.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <h3>
              <Link to={`/reports/${report.id}`}>{report.title}</Link>
            </h3>
            <p><strong>Tool:</strong> {report.tool_name}</p>
            <p>
              <span style={{
                background: severityColor(report.severity),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                marginRight: '8px'
              }}>
                {report.severity}
              </span>
              <span style={{
                background: report.status === 'Ongoing' ? 'red' : 'green',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                {report.status}
              </span>
            </p>
            <p style={{ color: 'gray', fontSize: '14px' }}>
              By {report.author_name} • {new Date(report.created_at).toLocaleDateString()} • ▲ {report.upvote_count}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default SearchResults
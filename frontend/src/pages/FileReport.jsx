import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

function FileReport() {
  const [toolName, setToolName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('Low')
  const [status, setStatus] = useState('Ongoing')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.post('/api/reports', {
        tool_name: toolName,
        title,
        description,
        severity,
        status
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <Link to="/" style={{ color: '#6c63ff', fontWeight: '600', fontSize: '14px' }}>
        ← Back to Feed
      </Link>

      <div className="form-container" style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800' }}>🐛 File a Report</h2>
          <p style={{ color: '#888', marginTop: '8px' }}>
            Report a bug or outage with a developer tool
          </p>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tool Name</label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g. Vercel, GitHub, Supabase"
              required
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary of the issue"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              required
              rows={5}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🟠 High</option>
                <option value="Critical">🔴 Critical</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Ongoing">🔴 Ongoing</option>
                <option value="Resolved">🟢 Resolved</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '8px' }}
          >
            {loading ? 'Submitting...' : '🚨 Submit Report'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FileReport
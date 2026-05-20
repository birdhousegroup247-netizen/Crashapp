import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useUI } from '../context/UIContext'

const SEVERITIES = [
  { value: 'Low',      label: 'Low',      dot: '#10b981' },
  { value: 'Medium',   label: 'Medium',   dot: '#f59e0b' },
  { value: 'High',     label: 'High',     dot: '#ef6c00' },
  { value: 'Critical', label: 'Critical', dot: '#ef4444' }
]

const STATUSES = [
  { value: 'Ongoing',  label: 'Ongoing',  dot: '#ef4444' },
  { value: 'Resolved', label: 'Resolved', dot: '#10b981' }
]

const DESC_MAX = 2000

function EditReport() {
  const { id } = useParams()
  const [toolName, setToolName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('Low')
  const [status, setStatus] = useState('Ongoing')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useUI()

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/api/reports/${id}`)
        setToolName(res.data.tool_name)
        setTitle(res.data.title)
        setDescription(res.data.description)
        setSeverity(res.data.severity)
        setStatus(res.data.status)
      } catch {
        setError('Failed to load report')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchReport()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.put(`/api/reports/${id}`, {
        tool_name: toolName.trim(),
        title: title.trim(),
        description: description.trim(),
        severity,
        status
      })
      toast('Report updated', { tone: 'success' })
      navigate(`/reports/${id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update report')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) return <div className="loading">Loading report...</div>

  return (
    <div className="page-container">
      <Link to={`/reports/${id}`} className="back-link">← Back to Report</Link>

      <div className="form-container" style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.4px' }}>
            Edit Report
          </h2>
          <p style={{ color: 'var(--muted)', marginTop: '6px', fontSize: '14px' }}>
            Update the details below.
          </p>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tool name</label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              required
              maxLength={60}
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
            />
            <p className="field-hint">{title.length}/120</p>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={6}
              maxLength={DESC_MAX}
            />
            <p className="field-hint">{description.length}/{DESC_MAX}</p>
          </div>

          <div className="form-group">
            <label>Severity</label>
            <div className="segmented">
              {SEVERITIES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`seg ${severity === s.value ? 'seg-active' : ''}`}
                  onClick={() => setSeverity(s.value)}
                >
                  <span className="seg-dot" style={{ background: s.dot }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <div className="segmented">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`seg ${status === s.value ? 'seg-active' : ''}`}
                  onClick={() => setStatus(s.value)}
                >
                  <span className="seg-dot" style={{ background: s.dot }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '12px' }}
          >
            {loading ? 'Updating...' : 'Update Report'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditReport

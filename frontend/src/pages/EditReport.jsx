import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

function EditReport() {
  const { id } = useParams()
  const [toolName, setToolName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('Low')
  const [status, setStatus] = useState('Ongoing')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/api/reports/${id}`)
        setToolName(res.data.tool_name)
        setTitle(res.data.title)
        setDescription(res.data.description)
        setSeverity(res.data.severity)
        setStatus(res.data.status)
      } catch (err) {
        setError('Failed to load report')
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
        tool_name: toolName,
        title,
        description,
        severity,
        status
      })
      navigate(`/reports/${id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Edit Report</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label>Tool Name</label><br />
          <input
            type="text"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Title</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Description</label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Severity</label><br />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Status</label><br />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px' }}
        >
          {loading ? 'Updating...' : 'Update Report'}
        </button>
      </form>
    </div>
  )
}

export default EditReport
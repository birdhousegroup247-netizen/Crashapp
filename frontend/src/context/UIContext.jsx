import { createContext, useContext, useState, useCallback, useRef } from 'react'

const UIContext = createContext()

export const UIProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState(null)
  const [toasts, setToasts] = useState([])
  const resolverRef = useRef(null)

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setConfirmState({
        title: opts.title || 'Are you sure?',
        message: opts.message || '',
        confirmText: opts.confirmText || 'Confirm',
        cancelText: opts.cancelText || 'Cancel',
        tone: opts.tone || 'primary'
      })
    })
  }, [])

  const handleConfirm = (value) => {
    if (resolverRef.current) {
      resolverRef.current(value)
      resolverRef.current = null
    }
    setConfirmState(null)
  }

  const toast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random()
    const tone = opts.tone || 'info'
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id))
    }, opts.duration || 3500)
  }, [])

  return (
    <UIContext.Provider value={{ confirm, toast }}>
      {children}

      {confirmState && (
        <div className="modal-backdrop" onClick={() => handleConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{confirmState.title}</h3>
            {confirmState.message && (
              <p className="modal-message">{confirmState.message}</p>
            )}
            <div className="modal-actions">
              <button
                className="btn-outline"
                onClick={() => handleConfirm(false)}
              >
                {confirmState.cancelText}
              </button>
              <button
                className={confirmState.tone === 'danger' ? 'btn-danger' : 'btn-primary'}
                onClick={() => handleConfirm(true)}
                autoFocus
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone}`}>
            {t.message}
          </div>
        ))}
      </div>
    </UIContext.Provider>
  )
}

export const useUI = () => useContext(UIContext)

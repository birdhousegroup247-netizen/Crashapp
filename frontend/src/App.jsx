import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'

// Pages
import Feed from './pages/Feed'
import Login from './pages/Login'
import Register from './pages/Register'
import SingleReport from './pages/SingleReport'
import FileReport from './pages/FileReport'
import EditReport from './pages/EditReport'
import UserProfile from './pages/UserProfile'
import SearchResults from './pages/SearchResults'
import AuthCallback from './pages/AuthCallback'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/login" />
}

// Redirect already-authenticated users away from auth pages
const RedirectIfAuth = ({ children }) => {
  const { isAuth } = useAuth()
  return isAuth ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />
        <Route path="/reports/:id" element={<SingleReport />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route
          path="/reports/new"
          element={
            <ProtectedRoute>
              <FileReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:id/edit"
          element={
            <ProtectedRoute>
              <EditReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
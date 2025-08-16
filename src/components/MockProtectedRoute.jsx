import { useAuth } from '../contexts/MockAuthContext'
import MockAuthPage from './auth/MockAuthPage'
import { Loader2 } from 'lucide-react'

const MockProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <MockAuthPage />
  }

  return children
}

export default MockProtectedRoute


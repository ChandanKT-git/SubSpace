import AuthProvider from './contexts/MockAuthContext'
import MockProtectedRoute from './components/MockProtectedRoute'
import MockGraphQLChatInterface from './components/chat/MockGraphQLChatInterface'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <MockProtectedRoute>
        <MockGraphQLChatInterface />
      </MockProtectedRoute>
    </AuthProvider>
  )
}

export default App

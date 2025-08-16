import AuthProvider from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import GraphQLChatInterface from './components/chat/GraphQLChatInterface'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <GraphQLChatInterface />
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App



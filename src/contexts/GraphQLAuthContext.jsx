import { createContext, useContext, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../lib/apollo'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)

  const signIn = async (email, password) => {
    setIsLoading(true)
    // Simulate API call - in real app this would use Nhost
    setTimeout(() => {
      const mockToken = 'mock-jwt-token'
      localStorage.setItem('nhostAccessToken', mockToken)
      setUser({ id: '1', email })
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 1000)
  }

  const signUp = async (email, password) => {
    setIsLoading(true)
    // Simulate API call - in real app this would use Nhost
    setTimeout(() => {
      const mockToken = 'mock-jwt-token'
      localStorage.setItem('nhostAccessToken', mockToken)
      setUser({ id: '1', email })
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 1000)
  }

  const signOut = () => {
    localStorage.removeItem('nhostAccessToken')
    setUser(null)
    setIsAuthenticated(false)
    // Clear Apollo cache
    apolloClient.clearStore()
  }

  const value = {
    isAuthenticated,
    isLoading,
    user,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthProvider = ({ children }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </ApolloProvider>
  )
}

export default AuthProvider


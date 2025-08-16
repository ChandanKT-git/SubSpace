import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)

  const signIn = async (email, password) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUser({ id: '1', email })
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 1000)
  }

  const signUp = async (email, password) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUser({ id: '1', email })
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 1000)
  }

  const signOut = () => {
    setUser(null)
    setIsAuthenticated(false)
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

export default AuthProvider


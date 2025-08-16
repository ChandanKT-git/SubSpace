import { createContext, useContext } from 'react'
import { NhostProvider, useAuthenticationStatus, useUserData } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'
import nhost from '../lib/nhost'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const AuthContextProvider = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const user = useUserData()

  const value = {
    isAuthenticated,
    isLoading,
    user,
    nhost
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthProvider = ({ children }) => {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </NhostApolloProvider>
    </NhostProvider>
  )
}

export default AuthProvider


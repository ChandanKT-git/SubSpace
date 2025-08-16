import { useState } from 'react'
import MockSignIn from './MockSignIn'
import MockSignUp from './MockSignUp'

const MockAuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true)

  const toggleMode = () => {
    setIsSignIn(!isSignIn)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            AI Chatbot
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your secure AI-powered chat companion
          </p>
        </div>
        
        {isSignIn ? (
          <MockSignIn onToggleMode={toggleMode} />
        ) : (
          <MockSignUp onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  )
}

export default MockAuthPage


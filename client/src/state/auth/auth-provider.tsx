import { useState, useCallback } from 'react'
import { AuthContext } from './auth-context'
import type { AuthState } from './auth-types'

/**
 * Top level authentication provider, this will be used to provide the auth state to the entire application.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({})

  const { loading, user } = state

  const handleLogin = useCallback(() => {
    // TODO: implement login logic
  }, [])
  const handleRegister = useCallback(() => {
    // TODO: implement login logic
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // calculated state
        showLogin: !loading && !user,

        // callbacks
        handleLogin,
        handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

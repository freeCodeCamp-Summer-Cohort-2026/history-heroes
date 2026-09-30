import { useState, useCallback } from 'react'
import { AuthContext } from './auth-context'
import type { AuthState } from './auth-types'

/**
 * Top level authentication provider, this will be used to provide the auth state to the entire application.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({})

  const { loading, user } = state

  const handleLogin = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      setState((prev) => ({ ...prev, loading: true }))
      fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Login failed')
          }
          return response.json()
        })
        .then((data) => {
          setState({ user: data.user ?? data, loading: false })
        })
        .catch((error) => {
          // TODO: set an error state
          console.error(error)
          setState({ user: null, loading: false })
        })
    },
    [],
  )
  const handleRegister = useCallback(
    ({
      email,
      password,
      isContentAuthor,
    }: {
      email: string
      password: string
      isContentAuthor: boolean
    }) => {
      setState((prev) => ({ ...prev, loading: true }))
      fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, isContentAuthor }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Registration failed')
          }
          return response.json()
        })
        .then((data) => {
          setState({ user: data.user ?? data, loading: false })
        })
        .catch((error) => {
          // TODO: set an error state
          console.error(error)
          setState({ user: null, loading: false })
        })
    },
    [],
  )

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

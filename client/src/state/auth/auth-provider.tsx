import { useState, useCallback, useEffect } from 'react'
import { AuthContext } from './auth-context'
import type { AuthState, User } from './auth-types'

/**
 * Top level authentication provider, this will be used to provide the auth state to the entire application.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ loading: true })

  const { loading, user } = state

  const getUserSession = useCallback(async (): Promise<User | null> => {
    try {
      const response = await fetch('/api/v1/auth/session')
      if (!response.ok) {
        throw new Error('Failed to load session information')
      }
      const data = await response.json()
      const sessionData = data.session_info ?? data
      const userInfo: User | null =
        sessionData?.userId !== undefined
          ? {
              id: Number(sessionData.userId),
              ...(sessionData.email
                ? { email: String(sessionData.email) }
                : {}),
            }
          : null
      setState((prev) => ({
        ...prev,
        user: prev.user ?? userInfo,
        loading: false,
      }))
      return userInfo
    } catch {
      setState((prev) => ({
        ...prev,
        user: null,
        loading: false,
      }))
      return null
    }
  }, [])

  useEffect(() => {
    fetch('/api/v1/auth/session')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load session information')
        }
        return response.json()
      })
      .then((data) => {
        const sessionData = data.session_info ?? data
        const userInfo: User | null =
          sessionData?.userId !== undefined
            ? {
                id: Number(sessionData.userId),
                ...(sessionData.email
                  ? { email: String(sessionData.email) }
                  : {}),
              }
            : null
        setState((prev) => ({
          ...prev,
          user: prev.user ?? userInfo,
          loading: false,
        }))
      })
      .catch(() => {
        setState((prev) => ({
          ...prev,
          user: null,
          loading: false,
        }))
      })
  }, [])

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
          const userResult: User = data.user ?? data
          setState((prev) => ({
            ...prev,
            user: userResult,
            loading: false,
          }))
        })
        .catch((error) => {
          // TODO: set an error state
          console.error(error)
          setState((prev) => ({ ...prev, user: null, loading: false }))
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
          const userResult: User = data.user ?? data
          setState((prev) => ({
            ...prev,
            user: userResult,
            loading: false,
          }))
        })
        .catch((error) => {
          // TODO: set an error state
          console.error(error)
          setState((prev) => ({ ...prev, user: null, loading: false }))
        })
    },
    [],
  )

  const handleLogout = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }))
    return fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Logout failed')
        }
        return response.json()
      })
      .then(() => {
        setState({ user: null, loading: false })
      })
      .catch((error) => {
        console.error(error)
        setState((prev) => ({ ...prev, loading: false }))
      })
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
        handleLogout,
        getUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

import { useState, useCallback, useEffect } from 'react'
import { AuthContext } from './auth-context'
import type { AuthState, User } from './auth-types'

/**
 * Top level authentication provider, this will be used to provide the auth state to the entire application.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    getUserSessionLoading: true,
  })

  const getUserSession = useCallback(async (): Promise<User | null> => {
    setState((prev) => ({ ...prev, getUserSessionLoading: true }))
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
        getUserSessionLoading: false,
        getUserSessionError: undefined,
      }))
      return userInfo
    } catch (error) {
      setState((prev) => ({
        ...prev,
        user: null,
        getUserSessionLoading: false,
        getUserSessionError: error,
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
          getUserSessionLoading: false,
          getUserSessionError: undefined,
        }))
      })
      .catch((error) => {
        setState((prev) => ({
          ...prev,
          user: null,
          getUserSessionLoading: false,
          getUserSessionError: error,
        }))
      })
  }, [])

  const handleLogin = useCallback(
    ({ email, password }: { email: string; password: string }) => {
      setState((prev) => ({ ...prev, loginLoading: true }))
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
            loginLoading: false,
            loginError: undefined,
          }))
        })
        .catch((error) => {
          console.error(error)
          setState((prev) => ({
            ...prev,
            user: null,
            loginLoading: false,
            loginError: error,
          }))
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
      setState((prev) => ({ ...prev, registerLoading: true }))
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
            registerLoading: false,
            registerError: undefined,
          }))
        })
        .catch((error) => {
          console.error(error)
          setState((prev) => ({
            ...prev,
            user: null,
            registerLoading: false,
            registerError: error,
          }))
        })
    },
    [],
  )

  const handleLogout = useCallback(() => {
    setState((prev) => ({ ...prev, logoutLoading: true }))
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
        setState((prev) => ({
          ...prev,
          user: null,
          logoutLoading: false,
          logoutError: undefined,
        }))
      })
      .catch((error) => {
        console.error(error)
        setState((prev) => ({
          ...prev,
          logoutLoading: false,
          logoutError: error,
        }))
      })
  }, [])

  const loading = Boolean(
    state.loading ||
    state.getUserSessionLoading ||
    state.loginLoading ||
    state.registerLoading ||
    state.logoutLoading,
  )

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // calculated state
        loading,
        showLogin: !loading && !state.user,

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

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
    setState((prev) => ({
      ...prev,
      getUserSessionLoading: true,
      getUserSessionError: undefined,
    }))
    try {
      const response = await fetch('/api/v1/auth/session')
      if (response.status === 401) {
        setState((prev) => ({
          ...prev,
          user: null,
          getUserSessionLoading: false,
          getUserSessionError: undefined,
        }))
        return null
      }
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
        user: userInfo,
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
    void getUserSession()
  }, [getUserSession])

  const handleLogin = useCallback(
    async ({
      email,
      password,
    }: {
      email: string
      password: string
    }): Promise<User> => {
      setState((prev) => ({
        ...prev,
        loginLoading: true,
        loginError: undefined,
      }))
      try {
        const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        if (!response.ok) {
          throw new Error('Login failed')
        }
        const data = await response.json()
        const userResult: User = data.user ?? data
        setState((prev) => ({
          ...prev,
          user: userResult,
          loginLoading: false,
          loginError: undefined,
        }))
        return userResult
      } catch (error) {
        console.error(error)
        setState((prev) => ({
          ...prev,
          loginLoading: false,
          loginError: error,
        }))
        throw error
      }
    },
    [],
  )

  const handleRegister = useCallback(
    async ({
      email,
      password,
      isContentAuthor,
    }: {
      email: string
      password: string
      isContentAuthor: boolean
    }): Promise<User> => {
      setState((prev) => ({
        ...prev,
        registerLoading: true,
        registerError: undefined,
      }))
      try {
        const response = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, isContentAuthor }),
        })
        if (!response.ok) {
          throw new Error('Registration failed')
        }
        const data = await response.json()
        const userResult: User = data.user ?? data
        setState((prev) => ({
          ...prev,
          user: userResult,
          registerLoading: false,
          registerError: undefined,
        }))
        return userResult
      } catch (error) {
        console.error(error)
        setState((prev) => ({
          ...prev,
          registerLoading: false,
          registerError: error,
        }))
        throw error
      }
    },
    [],
  )

  const handleLogout = useCallback(async (): Promise<void> => {
    setState((prev) => ({
      ...prev,
      logoutLoading: true,
      logoutError: undefined,
    }))
    try {
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Logout failed')
      }
      await response.json()
      setState((prev) => ({
        ...prev,
        user: null,
        logoutLoading: false,
        logoutError: undefined,
      }))
    } catch (error) {
      console.error(error)
      setState((prev) => ({
        ...prev,
        logoutLoading: false,
        logoutError: error,
      }))
    }
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
        showLogin: !state.user,

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

import { render, screen, act, waitFor } from '@testing-library/react'
import { AuthProvider } from '../auth-provider'
import { useAuth } from '../use-auth'

function TestConsumer() {
  const {
    user,
    loading,
    getUserSessionLoading,
    loginLoading,
    registerLoading,
    logoutLoading,
    loginError,
    registerError,
    logoutError,
    getUserSessionError,
    handleLogin,
    handleRegister,
    handleLogout,
    getUserSession,
  } = useAuth()

  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="getUserSessionLoading">
        {String(getUserSessionLoading)}
      </div>
      <div data-testid="loginLoading">{String(loginLoading)}</div>
      <div data-testid="registerLoading">{String(registerLoading)}</div>
      <div data-testid="logoutLoading">{String(logoutLoading)}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="getUserSessionError">
        {getUserSessionError instanceof Error
          ? getUserSessionError.message
          : String(getUserSessionError ?? '')}
      </div>
      <div data-testid="loginError">
        {loginError instanceof Error
          ? loginError.message
          : String(loginError ?? '')}
      </div>
      <div data-testid="registerError">
        {registerError instanceof Error
          ? registerError.message
          : String(registerError ?? '')}
      </div>
      <div data-testid="logoutError">
        {logoutError instanceof Error
          ? logoutError.message
          : String(logoutError ?? '')}
      </div>
      <button
        onClick={() => {
          void getUserSession?.()
        }}
        data-testid="btn-getUserSession"
      >
        Get Session
      </button>
      <button
        onClick={() => {
          handleLogin?.({ email: 'test@example.com', password: 'password123' })
        }}
        data-testid="btn-login"
      >
        Login
      </button>
      <button
        onClick={() => {
          handleRegister?.({
            email: 'test@example.com',
            password: 'password123',
            isContentAuthor: false,
          })
        }}
        data-testid="btn-register"
      >
        Register
      </button>
      <button
        onClick={() => {
          void handleLogout?.()
        }}
        data-testid="btn-logout"
      >
        Logout
      </button>
    </div>
  )
}

describe('AuthProvider error and loading handling', () => {
  const originalFetch = globalThis.fetch
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {})

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.clearAllMocks()
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  test('sets getUserSessionError when getUserSession fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
      expect(screen.getByTestId('getUserSessionLoading')).toHaveTextContent(
        'false',
      )
    })

    // Now call getUserSession explicitly
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))

    await act(async () => {
      screen.getByTestId('btn-getUserSession').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('getUserSessionError')).toHaveTextContent(
        'Failed to load session information',
      )
      expect(screen.getByTestId('getUserSessionLoading')).toHaveTextContent(
        'false',
      )
    })
  })

  test('sets loginError and loginLoading when handleLogin fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      }),
    )

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    await act(async () => {
      screen.getByTestId('btn-login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('loginError')).toHaveTextContent('Login failed')
      expect(screen.getByTestId('loginLoading')).toHaveTextContent('false')
    })
  })

  test('sets registerError and registerLoading when handleRegister fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Bad request' }), {
        status: 400,
      }),
    )

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    await act(async () => {
      screen.getByTestId('btn-register').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('registerError')).toHaveTextContent(
        'Registration failed',
      )
      expect(screen.getByTestId('registerLoading')).toHaveTextContent('false')
    })
  })

  test('sets logoutError and logoutLoading when handleLogout fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Server error' }), {
        status: 500,
      }),
    )

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    await act(async () => {
      screen.getByTestId('btn-logout').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('logoutError')).toHaveTextContent(
        'Logout failed',
      )
      expect(screen.getByTestId('logoutLoading')).toHaveTextContent('false')
    })
  })
})

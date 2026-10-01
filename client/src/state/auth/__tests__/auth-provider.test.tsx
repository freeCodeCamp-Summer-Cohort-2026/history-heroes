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
          handleLogin?.({
            email: 'test@example.com',
            password: 'password123',
          }).catch(() => {})
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
          }).catch(() => {})
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

    // Now call getUserSession explicitly with server error
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 500 }))

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

  test('treats 401 response in getUserSession as unauthenticated without error', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 401 }))

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
      expect(screen.getByTestId('getUserSessionError')).toHaveTextContent('')
      expect(screen.getByTestId('user')).toHaveTextContent('null')
    })

    // Now call getUserSession explicitly
    await act(async () => {
      screen.getByTestId('btn-getUserSession').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('getUserSessionError')).toHaveTextContent('')
      expect(screen.getByTestId('getUserSessionLoading')).toHaveTextContent(
        'false',
      )
      expect(screen.getByTestId('user')).toHaveTextContent('null')
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

  test('updates user state on successful handleLogin', async () => {
    const mockUser = { id: 1, email: 'test@example.com' }
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ user: mockUser }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
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
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser),
      )
      expect(screen.getByTestId('loginLoading')).toHaveTextContent('false')
      expect(screen.getByTestId('loginError')).toHaveTextContent('')
    })
  })

  test('updates user state on successful handleRegister', async () => {
    const mockUser = { id: 2, email: 'test@example.com' }
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ user: mockUser }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
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
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser),
      )
      expect(screen.getByTestId('registerLoading')).toHaveTextContent('false')
      expect(screen.getByTestId('registerError')).toHaveTextContent('')
    })
  })

  test('updates user state on successful getUserSession', async () => {
    const sessionResponse = {
      session_info: {
        userId: 10,
        email: 'sessionuser@example.com',
      },
    }
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(sessionResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify({ id: 10, email: 'sessionuser@example.com' }),
      )
    })
  })

  test('clears user state on successful handleLogout', async () => {
    const sessionResponse = {
      session_info: {
        userId: 10,
        email: 'sessionuser@example.com',
      },
    }
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(sessionResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify({ id: 10, email: 'sessionuser@example.com' }),
      )
    })

    await act(async () => {
      screen.getByTestId('btn-logout').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null')
      expect(screen.getByTestId('logoutLoading')).toHaveTextContent('false')
      expect(screen.getByTestId('logoutError')).toHaveTextContent('')
    })
  })

  test('failed handleLogin preserves existing authenticated user', async () => {
    const sessionResponse = {
      session_info: {
        userId: 10,
        email: 'sessionuser@example.com',
      },
    }
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(sessionResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
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
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify({ id: 10, email: 'sessionuser@example.com' }),
      )
    })

    await act(async () => {
      screen.getByTestId('btn-login').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('loginError')).toHaveTextContent('Login failed')
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify({ id: 10, email: 'sessionuser@example.com' }),
      )
    })
  })

  test('handleLogin re-throws error on failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      }),
    )

    let capturedError: unknown
    function ThrowTestConsumer() {
      const { handleLogin } = useAuth()
      return (
        <button
          onClick={async () => {
            try {
              await handleLogin({ email: 'a@b.com', password: 'pwd' })
            } catch (err) {
              capturedError = err
            }
          }}
          data-testid="btn-login-throw"
        >
          Login
        </button>
      )
    }

    render(
      <AuthProvider>
        <ThrowTestConsumer />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByTestId('btn-login-throw').click()
    })

    expect(capturedError).toBeInstanceOf(Error)
    expect((capturedError as Error).message).toBe('Login failed')
  })

  test('handleRegister re-throws error on failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Conflict' }), {
        status: 409,
      }),
    )

    let capturedError: unknown
    function ThrowTestConsumer() {
      const { handleRegister } = useAuth()
      return (
        <button
          onClick={async () => {
            try {
              await handleRegister({
                email: 'a@b.com',
                password: 'pwd',
                isContentAuthor: false,
              })
            } catch (err) {
              capturedError = err
            }
          }}
          data-testid="btn-register-throw"
        >
          Register
        </button>
      )
    }

    render(
      <AuthProvider>
        <ThrowTestConsumer />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByTestId('btn-register-throw').click()
    })

    expect(capturedError).toBeInstanceOf(Error)
    expect((capturedError as Error).message).toBe('Registration failed')
  })

  test('showLogin is true initially and does not flicker during unauthenticated session load', async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 401 }))

    function ShowLoginConsumer() {
      const { showLogin, loading } = useAuth()
      return (
        <div>
          <div data-testid="consumer-showLogin">{String(showLogin)}</div>
          <div data-testid="consumer-loading">{String(loading)}</div>
        </div>
      )
    }

    render(
      <AuthProvider>
        <ShowLoginConsumer />
      </AuthProvider>,
    )

    // Initially showLogin is true because there is no user
    expect(screen.getByTestId('consumer-showLogin')).toHaveTextContent('true')

    await waitFor(() => {
      expect(screen.getByTestId('consumer-loading')).toHaveTextContent('false')
    })

    // After session loads unauthenticated, showLogin remains true
    expect(screen.getByTestId('consumer-showLogin')).toHaveTextContent('true')
  })
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import ProfilePage from '../ProfilePage'
import { AuthContext } from '../../state/auth/auth-context'
import type { AuthState, AuthActions } from '../../state/auth/auth-types'

function renderProfilePage({
  authState = {},
  authActions = {},
  initialEntries = ['/profile'],
}: {
  authState?: AuthState
  authActions?: Partial<AuthActions>
  initialEntries?: string[]
} = {}) {
  const defaultActions: AuthActions = {
    handleLogin: vi.fn(),
    handleRegister: vi.fn(),
    handleLogout: vi.fn(),
    ...authActions,
  }

  const routes = [
    {
      path: '/profile',
      element: (
        <AuthContext.Provider value={{ ...authState, ...defaultActions }}>
          <ProfilePage />
        </AuthContext.Provider>
      ),
    },
    { path: '/login', element: <h1>Login Page</h1> },
    { path: '/register', element: <h1>Register Page</h1> },
    { path: '/', element: <h1>Home Page</h1> },
  ]

  render(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries,
      })}
    />,
  )
}

describe('ProfilePage', () => {
  test('renders message to login or register with redirect links when not authenticated', () => {
    renderProfilePage({
      authState: { user: null },
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText(/failed to load/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/your account and authentication details/i),
    ).not.toBeInTheDocument()
    expect(screen.getByText(/login or register/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^register/i })).toBeInTheDocument()
  })

  test('does not show an error when getUserSession resolves to null', async () => {
    const getUserSession = vi.fn().mockResolvedValue(null)
    renderProfilePage({
      authState: { user: null },
      authActions: { getUserSession },
    })

    await waitFor(() => {
      expect(getUserSession).toHaveBeenCalled()
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText(/failed to load/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/your account and authentication details/i),
    ).not.toBeInTheDocument()
    expect(screen.getByText(/login or register/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^register/i })).toBeInTheDocument()
  })

  test('redirects to /login when Login button link is clicked', async () => {
    renderProfilePage({
      authState: { user: null },
    })

    fireEvent.click(screen.getByRole('link', { name: /^login/i }))

    expect(
      await screen.findByRole('heading', { name: /login page/i }),
    ).toBeInTheDocument()
  })

  test('redirects to /register when Register button link is clicked', async () => {
    renderProfilePage({
      authState: { user: null },
    })

    fireEvent.click(screen.getByRole('link', { name: /^register/i }))

    expect(
      await screen.findByRole('heading', { name: /register page/i }),
    ).toBeInTheDocument()
  })

  test('renders user info and logout button when authenticated', () => {
    const handleLogout = vi.fn()
    renderProfilePage({
      authState: {
        user: { id: 42, email: 'hero@example.com' },
      },
      authActions: {
        handleLogout,
      },
    })

    expect(
      screen.getByText(/your account and authentication details/i),
    ).toBeInTheDocument()
    expect(screen.getByTestId('user-id')).toHaveTextContent('42')
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'hero@example.com',
    )
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))
    expect(handleLogout).toHaveBeenCalled()
  })

  test('shows loading indicator when loading', () => {
    renderProfilePage({
      authState: {
        user: null,
        loading: true,
      },
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('shows error alert when getUserSession rejects', async () => {
    const getUserSession = vi
      .fn()
      .mockRejectedValue(new Error('Network connection failed'))
    renderProfilePage({
      authState: { user: null },
      authActions: { getUserSession },
    })

    await waitFor(() => {
      expect(getUserSession).toHaveBeenCalled()
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Network connection failed',
    )
    expect(screen.queryByText(/login or register/i)).not.toBeInTheDocument()
  })

  test('shows error alert when handleLogout fails', async () => {
    const handleLogout = vi
      .fn()
      .mockRejectedValue(new Error('Logout network error'))
    renderProfilePage({
      authState: {
        user: { id: 42, email: 'hero@example.com' },
      },
      authActions: {
        handleLogout,
      },
    })

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Logout network error',
      )
    })
  })
})

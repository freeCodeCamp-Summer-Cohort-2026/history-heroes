import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import LoginPage from '../LoginPage'
import { AuthContext } from '../../state/auth/auth-context'
import type { AuthState, AuthActions } from '../../state/auth/auth-types'

function renderLoginPage({
  authState = {},
  authActions = {
    handleLogin: vi.fn(),
    handleRegister: vi.fn(),
  },
}: {
  authState?: AuthState
  authActions?: AuthActions
} = {}) {
  const routes = [
    {
      path: '/login',
      element: (
        <AuthContext.Provider value={{ ...authState, ...authActions }}>
          <LoginPage />
        </AuthContext.Provider>
      ),
    },
    { path: '/', element: <h1>Home Page</h1> },
    { path: '/register', element: <h1>Register Page</h1> },
  ]

  render(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/login'],
      })}
    />,
  )
}

describe('LoginPage', () => {
  test('renders login form when not authenticated', () => {
    renderLoginPage()

    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^register/i })).toBeInTheDocument()
  })

  test('redirects to home if already authenticated', () => {
    renderLoginPage({
      authState: { user: { id: '1', email: 'test@example.com' } },
    })

    expect(
      screen.getByRole('heading', { name: /home page/i }),
    ).toBeInTheDocument()
  })

  test('calls handleLogin with form data on valid submit', async () => {
    const handleLogin = vi.fn()
    renderLoginPage({
      authActions: {
        handleLogin,
        handleRegister: vi.fn(),
      },
    })

    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'hero@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /^login/i }))

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith({
        email: 'hero@example.com',
        password: 'password123',
      })
    })
  })
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import RegisterPage from '../RegisterPage'
import { MockAuthProvider } from '../../test/utils'
import type { AuthState, AuthActions } from '../../state/auth/auth-types'

function renderRegisterPage({
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
      path: '/register',
      element: (
        <MockAuthProvider value={{ ...authState, ...authActions }}>
          <RegisterPage />
        </MockAuthProvider>
      ),
    },
    { path: '/', element: <h1>Home Page</h1> },
    { path: '/login', element: <h1>Login Page</h1> },
  ]

  render(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/register'],
      })}
    />,
  )
}

describe('RegisterPage', () => {
  test('renders registration form when not authenticated', () => {
    renderRegisterPage()

    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/content author/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^register/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^login/i })).toBeInTheDocument()
  })

  test('redirects to home if already authenticated', () => {
    renderRegisterPage({
      authState: { user: { id: '1', email: 'test@example.com' } },
    })

    expect(
      screen.getByRole('heading', { name: /home page/i }),
    ).toBeInTheDocument()
  })

  test('calls handleRegister with form data on valid submit', async () => {
    const handleRegister = vi.fn()
    renderRegisterPage({
      authActions: {
        handleLogin: vi.fn(),
        handleRegister,
      },
    })

    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'hero@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByLabelText(/content author/i))

    fireEvent.click(screen.getByRole('button', { name: /^register/i }))

    await waitFor(() => {
      expect(handleRegister).toHaveBeenCalledWith({
        email: 'hero@example.com',
        password: 'password123',
        isContentAuthor: true,
      })
    })
  })
})

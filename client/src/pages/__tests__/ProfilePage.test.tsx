import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import ProfilePage from '../ProfilePage'
import { AuthContext } from '../../state/auth/auth-context'
import type { AuthState, AuthActions } from '../../state/auth/auth-types'
import { resetProgress } from '../../features/progress/model/api'

vi.mock('../../features/progress/model/api', () => ({
  resetProgress: vi.fn().mockResolvedValue({ message: 'Progress reset' }),
}))

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
    updateContentAuthor: vi
      .fn()
      .mockImplementation(async (isAuthor: boolean) => ({
        id: 42,
        email: 'hero@example.com',
        isContentAuthor: isAuthor,
      })),
    changePassword: vi.fn().mockResolvedValue(undefined),
    deleteAccount: vi.fn().mockResolvedValue(undefined),
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
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(resetProgress).mockResolvedValue({ message: 'Progress reset' })
  })

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

  describe('Content Author toggle', () => {
    test('toggles content author status and calls updateContentAuthor', async () => {
      const updateContentAuthor = vi.fn().mockResolvedValue({
        id: 42,
        email: 'hero@example.com',
        isContentAuthor: true,
      })

      renderProfilePage({
        authState: {
          user: { id: 42, email: 'hero@example.com', isContentAuthor: false },
        },
        authActions: {
          updateContentAuthor,
        },
      })

      const checkbox = screen.getByRole('checkbox', {
        name: /enable content author permissions/i,
      })
      expect(checkbox).not.toBeChecked()

      fireEvent.click(checkbox)

      expect(updateContentAuthor).toHaveBeenCalledWith(true)
      await waitFor(() => {
        expect(
          screen.getByText(/content author permissions enabled/i),
        ).toBeInTheDocument()
      })
    })

    test('shows error message when updateContentAuthor fails', async () => {
      const updateContentAuthor = vi
        .fn()
        .mockRejectedValue(new Error('Update failed'))

      renderProfilePage({
        authState: {
          user: { id: 42, email: 'hero@example.com', isContentAuthor: true },
        },
        authActions: {
          updateContentAuthor,
        },
      })

      const checkbox = screen.getByRole('checkbox', {
        name: /enable content author permissions/i,
      })
      expect(checkbox).toBeChecked()

      fireEvent.click(checkbox)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Update failed')
      })
    })
  })

  describe('Change Password form', () => {
    test('validates required fields, password length, and password match', async () => {
      renderProfilePage({
        authState: {
          user: { id: 42, email: 'hero@example.com' },
        },
      })

      const submitButton = screen.getByRole('button', {
        name: /change password/i,
      })

      // Empty submission
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Current password is required'),
        ).toBeInTheDocument()
        expect(screen.getByText('New password is required')).toBeInTheDocument()
        expect(
          screen.getByText('Please confirm your new password'),
        ).toBeInTheDocument()
      })

      // Min length validation (< 8 chars)
      fireEvent.change(screen.getByLabelText(/^current password/i), {
        target: { value: 'currentpass' },
      })
      fireEvent.change(screen.getByLabelText(/^new password/i), {
        target: { value: 'short' },
      })
      fireEvent.change(screen.getByLabelText(/^confirm new password/i), {
        target: { value: 'short' },
      })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters'),
        ).toBeInTheDocument()
      })

      // Passwords do not match validation
      fireEvent.change(screen.getByLabelText(/^new password/i), {
        target: { value: 'validPassword123' },
      })
      fireEvent.change(screen.getByLabelText(/^confirm new password/i), {
        target: { value: 'mismatchPassword456' },
      })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
      })
    })

    test('submits valid password change and shows success alert', async () => {
      const changePassword = vi.fn().mockResolvedValue(undefined)
      renderProfilePage({
        authState: {
          user: { id: 42, email: 'hero@example.com' },
        },
        authActions: {
          changePassword,
        },
      })

      fireEvent.change(screen.getByLabelText(/^current password/i), {
        target: { value: 'oldPassword123' },
      })
      fireEvent.change(screen.getByLabelText(/^new password/i), {
        target: { value: 'newPassword123' },
      })
      fireEvent.change(screen.getByLabelText(/^confirm new password/i), {
        target: { value: 'newPassword123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /change password/i }))

      await waitFor(() => {
        expect(changePassword).toHaveBeenCalledWith({
          currentPassword: 'oldPassword123',
          newPassword: 'newPassword123',
        })
        expect(
          screen.getByText('Password changed successfully'),
        ).toBeInTheDocument()
      })
    })

    test('shows error alert when changePassword fails', async () => {
      const changePassword = vi
        .fn()
        .mockRejectedValue(new Error('Incorrect current password'))
      renderProfilePage({
        authState: {
          user: { id: 42, email: 'hero@example.com' },
        },
        authActions: {
          changePassword,
        },
      })

      fireEvent.change(screen.getByLabelText(/^current password/i), {
        target: { value: 'wrongPassword123' },
      })
      fireEvent.change(screen.getByLabelText(/^new password/i), {
        target: { value: 'newPassword123' },
      })
      fireEvent.change(screen.getByLabelText(/^confirm new password/i), {
        target: { value: 'newPassword123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /change password/i }))

      await waitFor(() => {
        expect(
          screen.getByText('Incorrect current password'),
        ).toBeInTheDocument()
      })
    })
  })

  describe('Reset Progress', () => {
    test('resets progress for authenticated user with confirmation modal', async () => {
      renderProfilePage({
        authState: {
          user: { id: 42, email: 'hero@example.com' },
        },
      })

      // Modal is not visible initially
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      // Click "Reset Progress" trigger
      fireEvent.click(screen.getByRole('button', { name: /^reset progress$/i }))

      // Modal is now open
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/confirm progress reset/i)).toBeInTheDocument()

      // Test cancel dismisses modal without calling api
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(resetProgress).not.toHaveBeenCalled()

      // Open modal again and confirm
      fireEvent.click(screen.getByRole('button', { name: /^reset progress$/i }))
      fireEvent.click(
        screen.getByRole('button', { name: /yes, reset progress/i }),
      )

      await waitFor(() => {
        expect(resetProgress).toHaveBeenCalledTimes(1)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(
          screen.getByText('Progress has been successfully reset.'),
        ).toBeInTheDocument()
      })
    })

    test('resets progress for guest / session user with confirmation modal', async () => {
      renderProfilePage({
        authState: {
          user: null,
        },
      })

      // Click "Reset Session Progress" trigger
      fireEvent.click(
        screen.getByRole('button', { name: /reset session progress/i }),
      )

      // Modal appears
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Confirm reset
      fireEvent.click(
        screen.getByRole('button', { name: /yes, reset progress/i }),
      )

      await waitFor(() => {
        expect(resetProgress).toHaveBeenCalledTimes(1)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(
          screen.getByText('Progress has been successfully reset.'),
        ).toBeInTheDocument()
      })
    })

    test('shows error when resetProgress fails', async () => {
      vi.mocked(resetProgress).mockRejectedValueOnce(
        new Error('Failed to reset progress: 500'),
      )

      renderProfilePage({
        authState: {
          user: { id: 42, email: 'hero@example.com' },
        },
      })

      fireEvent.click(screen.getByRole('button', { name: /^reset progress$/i }))
      fireEvent.click(
        screen.getByRole('button', { name: /yes, reset progress/i }),
      )

      await waitFor(() => {
        expect(
          screen.getByText('Failed to reset progress: 500'),
        ).toBeInTheDocument()
      })
    })
  })

  describe('Delete Account', () => {
    test('confirms and deletes account, redirecting to home', async () => {
      const deleteAccount = vi.fn().mockResolvedValue(undefined)
      renderProfilePage({
        authState: {
          user: { id: 42, email: 'hero@example.com' },
        },
        authActions: {
          deleteAccount,
        },
      })

      // Modal is not visible initially
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

      // Click "Delete Account" trigger in Danger Zone
      fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }))

      // Modal is now open
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /delete account/i }),
      ).toBeInTheDocument()

      // Test cancel dismisses modal without calling deleteAccount
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(deleteAccount).not.toHaveBeenCalled()

      // Open modal again and confirm delete
      fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }))
      fireEvent.click(
        screen.getByRole('button', { name: /yes, delete my account/i }),
      )

      await waitFor(() => {
        expect(deleteAccount).toHaveBeenCalledTimes(1)
        expect(
          screen.getByRole('heading', { name: /home page/i }),
        ).toBeInTheDocument()
      })
    })

    test('shows error when deleteAccount fails', async () => {
      const deleteAccount = vi
        .fn()
        .mockRejectedValue(new Error('Network error deleting account'))
      renderProfilePage({
        authState: {
          user: { id: 42, email: 'hero@example.com' },
        },
        authActions: {
          deleteAccount,
        },
      })

      fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }))
      fireEvent.click(
        screen.getByRole('button', { name: /yes, delete my account/i }),
      )

      await waitFor(() => {
        expect(
          screen.getByText('Network error deleting account'),
        ).toBeInTheDocument()
      })
    })
  })
})

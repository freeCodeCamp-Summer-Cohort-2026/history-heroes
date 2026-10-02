/* eslint-disable react-refresh/only-export-components */
import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { AuthContext, type AuthActions, type AuthState } from '../state/auth'

export const createMockAuthContext = (
  overrides?: Partial<AuthState & AuthActions>,
): AuthState & AuthActions => ({
  loading: false,
  showLogin: true,
  user: null,
  handleLogin: vi
    .fn()
    .mockResolvedValue({ id: 1, email: 'test@historyheroes.org' }),
  handleRegister: vi
    .fn()
    .mockResolvedValue({ id: 1, email: 'test@historyheroes.org' }),
  handleLogout: vi.fn().mockResolvedValue(undefined),
  getUserSession: vi.fn().mockResolvedValue(null),
  updateContentAuthor: vi
    .fn()
    .mockImplementation(async (isContentAuthor: boolean) => ({
      id: 1,
      email: 'test@historyheroes.org',
      isContentAuthor,
    })),
  changePassword: vi.fn().mockResolvedValue(undefined),
  deleteAccount: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

export interface MockAuthProviderProps {
  children: ReactNode
  value?: Partial<AuthState & AuthActions>
}

export function MockAuthProvider({ children, value }: MockAuthProviderProps) {
  const authValue = createMockAuthContext(value)
  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  )
}

export interface RenderWithAuthOptions extends Omit<RenderOptions, 'wrapper'> {
  authValue?: Partial<AuthState & AuthActions>
}

export function renderWithAuth(
  ui: ReactElement,
  options?: RenderWithAuthOptions,
) {
  const { authValue, ...renderOptions } = options ?? {}
  return render(ui, {
    wrapper: ({ children }) => (
      <MockAuthProvider value={authValue}>{children}</MockAuthProvider>
    ),
    ...renderOptions,
  })
}

import { renderHook } from '@testing-library/react'
import { useAuth } from '../use-auth'
import { MockAuthProvider } from '../../../test/utils'

describe('useAuth', () => {
  test('throws an error if used outside an AuthProvider', () => {
    // Suppress console.error from React when error boundary catches thrown error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    )

    consoleErrorSpy.mockRestore()
  })

  test('returns auth context when inside AuthProvider', () => {
    const mockUser = { id: 1, email: 'test@example.com' }
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <MockAuthProvider value={{ user: mockUser, showLogin: false }}>
          {children}
        </MockAuthProvider>
      ),
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.showLogin).toBe(false)
  })
})

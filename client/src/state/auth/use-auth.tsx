import { useContext } from 'react'
import { AuthContext } from './auth-context'
import type { AuthActions, AuthState } from './auth-types'

/**
 * Helper hook that provides access to the Auth state provided from the Auth provider.
 *
 * Use this instead of the direct AuthContext
 */
export function useAuth(): AuthState & AuthActions {
  return useContext(AuthContext)!
}

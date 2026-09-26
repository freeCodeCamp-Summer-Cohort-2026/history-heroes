import { useContext } from 'react'
import { AuthContext } from './auth-context'

/**
 * Helper hook that provides access to the Auth state provided from the Auth provider.
 *
 * Use this instead of the direct AuthContext
 */
export function useAuth() {
  return useContext(AuthContext)
}

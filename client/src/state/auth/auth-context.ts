import { createContext } from 'react'
import type { AuthActions, AuthState } from './auth-types'

export const AuthContext = createContext<(AuthState & AuthActions) | null>(null)

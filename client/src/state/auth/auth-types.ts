export interface AuthState {
  /**
   * If the auth state is being loaded, if so we don't know if the user is already logged in or not.
   */
  loading?: boolean
  /**
   * Calculated from loading + user.
   */
  showLogin?: boolean
  /**
   * The user who is logged in or undefined if the user is not logged in at all.
   */
  user?: Record<string, unknown>
  /**
   * Error data related to logging
   */
  loginError?: Error | unknown
}

export interface AuthActions {
  handleLogin: (params: { email: string; password: string }) => void
  handleRegister: (params: {
    email: string
    password: string
    isContentAuthor: boolean
  }) => void
}

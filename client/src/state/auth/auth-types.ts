export interface User {
  id: number | string
  email?: string
  username?: string
  createdAt?: string | Date
  updatedAt?: string | Date
  isContentAuthor?: boolean
}

export interface AuthState {
  /**
   * If any auth action is currently loading (calculated from individual loading states).
   */
  loading?: boolean
  /**
   * If session retrieval is loading.
   */
  getUserSessionLoading?: boolean
  /**
   * If login is loading.
   */
  loginLoading?: boolean
  /**
   * If registration is loading.
   */
  registerLoading?: boolean
  /**
   * If logout is loading.
   */
  logoutLoading?: boolean
  /**
   * Calculated from user (true when user is not logged in).
   */
  showLogin?: boolean
  /**
   * The user who is logged in or undefined if the user is not logged in at all.
   */
  user?: User | null
  /**
   * Error data related to logging in
   */
  loginError?: Error | unknown
  /**
   * Error data related to user session retrieval
   */
  getUserSessionError?: Error | unknown
  /**
   * Error data related to registration
   */
  registerError?: Error | unknown
  /**
   * Error data related to logging out
   */
  logoutError?: Error | unknown
}

export interface AuthActions {
  handleLogin: (params: { email: string; password: string }) => Promise<User>
  handleRegister: (params: {
    email: string
    password: string
    isContentAuthor: boolean
  }) => Promise<User>
  handleLogout: () => Promise<void>
  getUserSession?: () => Promise<User | null>
  updateContentAuthor?: (isContentAuthor: boolean) => Promise<User>
  changePassword?: (params: {
    currentPassword: string
    newPassword: string
  }) => Promise<void>
  deleteAccount?: () => Promise<void>
}

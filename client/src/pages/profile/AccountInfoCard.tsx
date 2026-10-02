import Card from '../../components/Card'
import type { User } from '../../state/auth/auth-types'

interface AccountInfoCardProps {
  user: User
}

/**
 * AccountInfoCard displays core authentication details for the logged-in user,
 * including their unique user ID and registered email address.
 *
 * How it is used:
 * Rendered within the authenticated section of `ProfilePage`, receiving the active
 * `user` object from the auth state.
 *
 * When it is shown:
 * Displayed only when an authenticated user is logged in (`user !== null`).
 */
export default function AccountInfoCard({ user }: AccountInfoCardProps) {
  return (
    <Card>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Authentication Information</h2>
        <div className="space-y-2 text-body">
          {user.id !== undefined && (
            <div>
              <span className="font-medium">User ID: </span>
              <span data-testid="user-id">{String(user.id)}</span>
            </div>
          )}
          {user.email !== undefined && (
            <div>
              <span className="font-medium">Email: </span>
              <span data-testid="user-email">{String(user.email)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

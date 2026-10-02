import { useState } from 'react'
import Button from '../components/Button'
import ButtonLink from '../components/ButtonLink'
import Card from '../components/Card'
import LoadingIndicator from '../components/LoadingIndicator'
import { useAuth } from '../state/auth/use-auth'

export default function ProfilePage() {
  const { user, handleLogout, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const onLogout = async () => {
    try {
      await handleLogout()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout')
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-heading text-3xl font-bold">Profile Page</h1>
        {user && (
          <p className="text-body text-base-content/70">
            Your account and authentication details.
          </p>
        )}
      </header>

      {(() => {
        if (loading) {
          return <LoadingIndicator />
        }

        if (error) {
          return (
            <div role="alert" className="text-error">
              {error}
            </div>
          )
        }

        if (!user) {
          return (
            <div className="space-y-6 max-w-lg">
              <Card>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Not Logged In</h2>
                  <p className="text-body">
                    Please login or register to view your profile.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <ButtonLink to="/login" variant="primary">
                      Login
                    </ButtonLink>
                    <ButtonLink to="/register" variant="secondary">
                      Register
                    </ButtonLink>
                  </div>
                </div>
              </Card>
            </div>
          )
        }

        return (
          <div className="space-y-6 max-w-lg">
            <Card>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">
                  Authentication Information
                </h2>
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

            <div>
              <Button onClick={onLogout} variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

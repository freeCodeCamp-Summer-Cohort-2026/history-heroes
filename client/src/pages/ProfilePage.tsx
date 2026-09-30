import { useEffect, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import LoadingIndicator from '../components/LoadingIndicator'
import { useAuth } from '../state/auth/use-auth'
import type { User } from '../state/auth/auth-types'

export default function ProfilePage() {
  const { user, getUserSession, handleLogout, loading } = useAuth()
  const [fetchedUser, setFetchedUser] = useState<User | null>(null)
  const [isFetching, setIsFetching] = useState(!user && Boolean(getUserSession))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    if (!user && getUserSession) {
      getUserSession()
        .then((data) => {
          if (!isActive) return
          if (data) {
            setFetchedUser(data)
          } else {
            setError('Failed to load user information')
          }
        })
        .catch((err) => {
          if (!isActive) return
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load user information',
          )
        })
        .finally(() => {
          if (isActive) {
            setIsFetching(false)
          }
        })
    }

    return () => {
      isActive = false
    }
  }, [user, getUserSession])

  const currentUser = user ?? fetchedUser
  const isLoading = (loading && !currentUser) || (isFetching && !currentUser)

  const onLogout = () => {
    if (handleLogout) {
      handleLogout()
    } else {
      fetch('/api/v1/auth/logout', { method: 'POST' }).catch(console.error)
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-heading text-3xl font-bold">Profile Page</h1>
        <p className="text-body text-base-content/70">
          Your account and authentication details.
        </p>
      </header>

      {(() => {
        if (isLoading) {
          return <LoadingIndicator />
        }

        if (error) {
          return (
            <div role="alert" className="text-error">
              {error}
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
                  {currentUser?.id !== undefined && (
                    <div>
                      <span className="font-medium">User ID: </span>
                      <span data-testid="user-id">
                        {String(currentUser.id)}
                      </span>
                    </div>
                  )}
                  {currentUser?.email !== undefined && (
                    <div>
                      <span className="font-medium">Email: </span>
                      <span data-testid="user-email">
                        {String(currentUser.email)}
                      </span>
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

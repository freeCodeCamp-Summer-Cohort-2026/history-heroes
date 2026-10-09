import type { ReactNode } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useAuth } from '../state/auth/use-auth'
import LoadingIndicator from './LoadingIndicator'

interface ContentAuthorGuardProps {
  children?: ReactNode
  fallbackPath?: string
}

/**
 * Route guard component that restricts access to users with content author permissions.
 *
 * If auth status is still loading, renders a LoadingIndicator.
 * If the user is unauthenticated or not a content author, redirects them to
 * the module page (`/modules/:moduleId`), `fallbackPath`, or `/`.
 */
export default function ContentAuthorGuard({
  children,
  fallbackPath,
}: ContentAuthorGuardProps) {
  const { user, loading } = useAuth()
  const { moduleId } = useParams()

  if (loading) {
    return <LoadingIndicator />
  }

  if (!user?.isContentAuthor) {
    const destination =
      fallbackPath ?? (moduleId ? `/modules/${moduleId}` : '/')
    return <Navigate to={destination} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

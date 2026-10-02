import Card from '../../components/Card'

interface ResetProgressCardProps {
  title?: string
  description?: string
  buttonText?: string
  resetSuccess: string | null
  resetError: string | null
  onOpenModal: () => void
}

/**
 * ResetProgressCard displays a section informing the user of progress reset capabilities
 * and provides a trigger button to open the confirmation modal.
 *
 * How it is used:
 * Used in two contexts with customizable copy:
 * 1. For authenticated users on `ProfilePage` to clear all account-linked curriculum progress.
 * 2. For unauthenticated/guest users inside `GuestProfileView` to clear progress saved on their active session.
 *
 * When it is shown:
 * Rendered on `ProfilePage` for both authenticated users and unauthenticated guest learners.
 */
export default function ResetProgressCard({
  title = 'Reset Progress',
  description = 'Resetting your progress will permanently clear all of your completed lessons and lab submissions.',
  buttonText = 'Reset Progress',
  resetSuccess,
  resetError,
  onOpenModal,
}: ResetProgressCardProps) {
  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-body text-sm text-base-content/70">{description}</p>
        {resetSuccess && (
          <div role="alert" className="alert alert-success text-sm">
            <span>{resetSuccess}</span>
          </div>
        )}
        {resetError && (
          <div role="alert" className="alert alert-error text-sm">
            <span>{resetError}</span>
          </div>
        )}
        <div>
          <button
            type="button"
            className="btn btn-warning btn-outline"
            onClick={onOpenModal}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Card>
  )
}

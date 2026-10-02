import ButtonLink from '../../components/ButtonLink'
import Card from '../../components/Card'
import ResetProgressCard from './ResetProgressCard'

interface GuestProfileViewProps {
  resetSuccess: string | null
  resetError: string | null
  onOpenResetModal: () => void
}

/**
 * GuestProfileView renders the profile view for unauthenticated (guest) learners.
 * It provides prompt cards directing the user to Login or Register, along with an
 * option to reset any curriculum progress stored under their temporary browser session.
 *
 * How it is used:
 * Rendered within `ProfilePage` whenever no authenticated user is logged in. It passes
 * reset status messages and the modal trigger handler to a nested `ResetProgressCard`.
 *
 * When it is shown:
 * Displayed exclusively when there is no active logged-in user (`!user` and not loading).
 */
export default function GuestProfileView({
  resetSuccess,
  resetError,
  onOpenResetModal,
}: GuestProfileViewProps) {
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

      <ResetProgressCard
        title="Reset Progress"
        description="Clear all lesson and lab progress saved in your current session."
        buttonText="Reset Session Progress"
        resetSuccess={resetSuccess}
        resetError={resetError}
        onOpenModal={onOpenResetModal}
      />
    </div>
  )
}

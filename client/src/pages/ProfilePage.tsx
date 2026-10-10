import Button from '../components/Button'
import LoadingIndicator from '../components/LoadingIndicator'
import { useProfile } from './useProfile'
import AccountInfoCard from './profile/AccountInfoCard'
import ContentAuthorCard from './profile/ContentAuthorCard'
import ChangePasswordCard from './profile/ChangePasswordCard'
import ResetProgressCard from './profile/ResetProgressCard'
import DeleteAccountCard from './profile/DeleteAccountCard'
import ResetProgressModal from './profile/ResetProgressModal'
import DeleteAccountModal from './profile/DeleteAccountModal'
import GuestProfileView from './profile/GuestProfileView'

/**
 * ProfilePage serves as the central account management and settings view for History Heroes.
 *
 * How it is used:
 * Mounted at `/profile`. Connects to `useProfile` to orchestrate user details, content author role
 * privileges, password changes, progress resets, account deletion, and session sign-outs across
 * dedicated subcomponents.
 *
 * When it is shown:
 * Rendered when a user navigates to the `/profile` route, supporting both authenticated users
 * and unauthenticated/guest sessions.
 */
export default function ProfilePage() {
  const {
    user,
    loading,
    logoutError,
    onLogout,
    // Content Author
    authorLoading,
    authorSuccess,
    authorError,
    onToggleAuthor,
    // Change Password
    passwordSuccess,
    passwordError,
    passwordForm,
    newPasswordValue,
    onChangePassword,
    // Reset Progress
    showResetModal,
    resetLoading,
    resetSuccess,
    resetError,
    openResetModal,
    closeResetModal,
    handleConfirmResetProgress,
    // Delete Account
    showDeleteModal,
    deleteLoading,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDeleteAccount,
  } = useProfile()

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

        if (logoutError) {
          return (
            <div role="alert" className="text-error">
              {logoutError}
            </div>
          )
        }

        if (!user) {
          return (
            <GuestProfileView
              resetSuccess={resetSuccess}
              resetError={resetError}
              onOpenResetModal={openResetModal}
            />
          )
        }

        return (
          <div className="space-y-6 max-w-lg">
            <AccountInfoCard user={user} />

            <ContentAuthorCard
              isContentAuthor={user.isContentAuthor}
              authorLoading={authorLoading}
              authorSuccess={authorSuccess}
              authorError={authorError}
              onToggleAuthor={onToggleAuthor}
            />

            <ChangePasswordCard
              passwordForm={passwordForm}
              passwordSuccess={passwordSuccess}
              passwordError={passwordError}
              newPasswordValue={newPasswordValue}
              onChangePassword={onChangePassword}
            />

            <ResetProgressCard
              resetSuccess={resetSuccess}
              resetError={resetError}
              onOpenModal={openResetModal}
            />

            <DeleteAccountCard
              deleteError={deleteError}
              onOpenModal={openDeleteModal}
            />

            <div>
              <Button onClick={onLogout} variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        )
      })()}

      <ResetProgressModal
        isOpen={showResetModal}
        resetLoading={resetLoading}
        onClose={closeResetModal}
        onConfirm={handleConfirmResetProgress}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        deleteLoading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDeleteAccount}
      />
    </div>
  )
}

import Card from '../../components/Card'

interface DeleteAccountCardProps {
  deleteError: string | null
  onOpenModal: () => void
}

/**
 * DeleteAccountCard displays the "Danger Zone" account deletion interface, warning the user
 * of permanent data loss and providing a button to open the deletion confirmation modal.
 *
 * How it is used:
 * Rendered at the bottom of the authenticated section of `ProfilePage`. When the user clicks
 * "Delete Account", it triggers `onOpenModal` to display the confirmation dialog. Any deletion
 * errors passed via `deleteError` are rendered as error alerts.
 *
 * When it is shown:
 * Displayed exclusively for authenticated users (`user !== null`).
 */
export default function DeleteAccountCard({
  deleteError,
  onOpenModal,
}: DeleteAccountCardProps) {
  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-error">Danger Zone</h2>
        <p className="text-body text-sm text-base-content/70">
          Permanently delete your History Heroes account and all associated
          progress. This action is irreversible.
        </p>
        {deleteError && (
          <div role="alert" className="alert alert-error text-sm">
            <span>{deleteError}</span>
          </div>
        )}
        <div>
          <button
            type="button"
            className="btn btn-error btn-outline"
            onClick={onOpenModal}
          >
            Delete Account
          </button>
        </div>
      </div>
    </Card>
  )
}

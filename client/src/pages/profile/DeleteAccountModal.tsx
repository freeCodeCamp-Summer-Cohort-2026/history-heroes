interface DeleteAccountModalProps {
  isOpen: boolean
  deleteLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

/**
 * DeleteAccountModal is an accessible confirmation modal dialog that intercepts account deletion
 * requests and warns the user of the permanent, irreversible destruction of their account and progress.
 *
 * How it is used:
 * Rendered at the root of `ProfilePage`. It stays mounted conditionally based on `isOpen`.
 * When open, it displays warning text, a "Cancel" button that invokes `onClose`, and a
 * "Yes, Delete My Account" danger button that invokes `onConfirm`. The backdrop also closes
 * the dialog unless deletion is actively executing (`deleteLoading`).
 *
 * When it is shown:
 * Displayed when an authenticated user clicks "Delete Account" in the Danger Zone card (`isOpen === true`).
 */
export default function DeleteAccountModal({
  isOpen,
  deleteLoading,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="modal modal-open"
    >
      <div className="modal-box">
        <h3 id="delete-modal-title" className="font-bold text-lg text-error">
          Delete Account
        </h3>
        <p className="py-4 text-body">
          Are you sure you want to permanently delete your account? All of your
          saved progress, profile information, and account data will be lost
          forever. This action cannot be undone.
        </p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={deleteLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={onConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}>
        <button type="button">close</button>
      </div>
    </div>
  )
}

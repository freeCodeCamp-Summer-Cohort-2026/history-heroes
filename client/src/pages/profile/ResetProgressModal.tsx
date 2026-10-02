interface ResetProgressModalProps {
  isOpen: boolean
  resetLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

/**
 * ResetProgressModal is an accessible confirmation modal dialog that intercepts progress
 * reset requests and prompts the learner to confirm before deleting their completion records.
 *
 * How it is used:
 * Rendered at the root of `ProfilePage`. It stays mounted conditionally based on `isOpen`.
 * When open, it displays warning text, a "Cancel" button that invokes `onClose`, and a
 * "Yes, Reset Progress" action button that invokes `onConfirm`. The backdrop also closes the
 * dialog unless a reset is actively in progress (`resetLoading`).
 *
 * When it is shown:
 * Displayed when the user clicks "Reset Progress" or "Reset Session Progress" on either the
 * authenticated or guest view (`isOpen === true`).
 */
export default function ResetProgressModal({
  isOpen,
  resetLoading,
  onClose,
  onConfirm,
}: ResetProgressModalProps) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      className="modal modal-open"
    >
      <div className="modal-box">
        <h3 id="reset-modal-title" className="font-bold text-lg">
          Confirm Progress Reset
        </h3>
        <p className="py-4 text-body">
          Are you sure you want to reset your progress? This will clear all
          completed lessons and labs. This action cannot be undone.
        </p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={resetLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error"
            onClick={onConfirm}
            disabled={resetLoading}
          >
            {resetLoading ? 'Resetting...' : 'Yes, Reset Progress'}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}>
        <button type="button">close</button>
      </div>
    </div>
  )
}

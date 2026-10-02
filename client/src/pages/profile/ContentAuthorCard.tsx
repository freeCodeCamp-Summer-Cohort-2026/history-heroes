import Card from '../../components/Card'

interface ContentAuthorCardProps {
  isContentAuthor?: boolean
  authorLoading: boolean
  authorSuccess: string | null
  authorError: string | null
  onToggleAuthor: (checked: boolean) => void
}

/**
 * ContentAuthorCard provides a toggle control allowing authenticated users to opt
 * into or out of the Content Author role, granting access to curriculum editing tools.
 *
 * How it is used:
 * Rendered on `ProfilePage` for logged-in users. It reflects the current `isContentAuthor`
 * status, disables input while saving, triggers the `onToggleAuthor` callback on change,
 * and surfaces success/error feedback alerts.
 *
 * When it is shown:
 * Displayed exclusively for authenticated users on the `ProfilePage`.
 */
export default function ContentAuthorCard({
  isContentAuthor,
  authorLoading,
  authorSuccess,
  authorError,
  onToggleAuthor,
}: ContentAuthorCardProps) {
  return (
    <Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Content Author</h2>
        <p className="text-body text-sm text-base-content/70">
          Content authors can create, edit, and publish historical modules,
          lessons, and interactive activities.
        </p>

        {authorSuccess && (
          <div role="alert" className="alert alert-success text-sm">
            <span>{authorSuccess}</span>
          </div>
        )}
        {authorError && (
          <div role="alert" className="alert alert-error text-sm">
            <span>{authorError}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            id="content-author-toggle"
            type="checkbox"
            role="checkbox"
            className="checkbox checkbox-primary"
            checked={Boolean(isContentAuthor)}
            disabled={authorLoading}
            onChange={(e) => onToggleAuthor(e.target.checked)}
          />
          <label
            htmlFor="content-author-toggle"
            className="cursor-pointer font-medium select-none"
          >
            Enable Content Author Permissions
          </label>
          {authorLoading && (
            <span className="text-xs text-base-content/60">Saving...</span>
          )}
        </div>
      </div>
    </Card>
  )
}

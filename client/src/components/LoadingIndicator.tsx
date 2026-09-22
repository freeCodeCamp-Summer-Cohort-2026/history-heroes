/**
 * Standardized loading indicator component that shows both a UI indicator for loading
 * and a message.
 *
 *
 */
export default function LoadingIndicator({
  thing,
}: {
  thing?: 'modules' | 'lessons' | 'activities'
}) {
  const message = thing ? `Loading ${thing}...` : 'Loading...'

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-2"
    >
      <span className="loading loading-spinner loading-md" aria-hidden="true" />
      <div>
        <span className="text-sm sm:text-base text-base-content/70">
          {message}
        </span>
      </div>
    </div>
  )
}

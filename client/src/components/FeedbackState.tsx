type FeedbackStateProps = {
  type: 'correct' | 'not-yet'
  title?: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

export default function FeedbackState({
  type,
  title,
  message,
  actionLabel,
  onAction,
}: FeedbackStateProps) {
  const isCorrect = type === 'correct'

  return (
    <section
      className={`rounded-box border p-6 ${
        isCorrect
          ? 'border-success/30 bg-success/10'
          : 'border-warning/30 bg-warning/10'
      }`}
      aria-live="polite"
    >
      <div className="flex gap-3">
        <span
          className={`text-xl font-bold ${
            isCorrect ? 'text-success' : 'text-warning'
          }`}
          aria-hidden="true"
        >
          {isCorrect ? '✓' : '!'}
        </span>

        <div className="flex-1">
          <h2 className="text-subheading font-semibold">
            {title ?? (isCorrect ? 'Correct' : 'Not yet')}
          </h2>

          <p className="mt-2 text-body">{message}</p>

          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="btn btn-secondary mt-4"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

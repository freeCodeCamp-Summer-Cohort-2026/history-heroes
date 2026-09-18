type FeedbackStateProps =
  | {
      type: 'correct'
      checked: string
      successMessage: string
      actionLabel?: string
      onAction?: () => void
    }
  | {
      type: 'not-yet'
      checked: string
      expected: string
      yours: string
      actionLabel?: string
      onAction?: () => void
    }

export default function FeedbackState(props: FeedbackStateProps) {
  const { type, checked, actionLabel, onAction } = props
  const isCorrect = type === 'correct'

  const panelClasses = isCorrect
    ? 'border-success/30 bg-success/10'
    : 'border-warning/30 bg-warning/10'

  const icon = isCorrect ? '✓' : '!'
  const title = isCorrect ? 'Correct' : 'Not yet'

  return (
    <section
      className={`rounded-box border p-6 ${panelClasses}`}
      aria-live="polite"
    >
      <div className="flex gap-3">
        <span
          className={`text-xl font-bold ${
            isCorrect ? 'text-success' : 'text-warning'
          }`}
          aria-hidden="true"
        >
          {icon}
        </span>

        <div className="flex-1 space-y-4">
          <h2 className="text-subheading font-semibold">{title}</h2>

          {/* What we checked */}
          <div>
            <h3 className="text-small font-semibold opacity-70">
              What we checked
            </h3>
            <p className="text-body mt-1">{checked}</p>
          </div>

          {/* Correct or Not Yet details */}
          {isCorrect ? (
            <p className="text-body mt-2">{props.successMessage}</p>
          ) : (
            <>
              <div>
                <h3 className="text-small font-semibold opacity-70">
                  Expected
                </h3>
                <p className="text-body mt-1">{props.expected}</p>
              </div>
              <div>
                <h3 className="text-small font-semibold opacity-70">
                  Your answer
                </h3>
                <p className="text-body mt-1">{props.yours}</p>
              </div>
            </>
          )}

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

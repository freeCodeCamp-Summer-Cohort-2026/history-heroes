type FeedbackStateProps =
  | {
      type: 'correct'
      checkStatement?: string
      checked?: string
      successMessage: string
      actionLabel?: string
      onAction?: () => void
    }
  | {
      type: 'not-yet'
      checkStatement?: string
      checked?: string
      expected?: string
      yours?: string
      actionLabel?: string
      onAction?: () => void
    }

export default function FeedbackState(props: FeedbackStateProps) {
  const { type, actionLabel, onAction } = props
  const checkStatement = props.checkStatement ?? props.checked ?? ''
  const isCorrect = type === 'correct'

  const panelClasses = isCorrect
    ? 'border-success/30 bg-success/10'
    : 'border-warning/30 bg-warning/10'

  const icon = isCorrect ? '✓' : '!'
  const title = isCorrect ? 'Correct' : 'Not yet'

  return (
    <section
      className={`rounded-box border p-4 sm:p-6 ${panelClasses}`}
      aria-live="polite"
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <span
          className={`text-lg sm:text-xl font-bold ${
            isCorrect ? 'text-success' : 'text-warning'
          }`}
          aria-hidden="true"
        >
          {icon}
        </span>

        <div className="flex-1 space-y-3 sm:space-y-4">
          <h2 className="text-subheading font-semibold">{title}</h2>

          {/* What we checked */}
          {checkStatement && (
            <div>
              <h3 className="text-small font-semibold opacity-70">
                What we checked
              </h3>
              <p className="text-body mt-1">{checkStatement}</p>
            </div>
          )}

          {/* Correct or Not Yet details */}
          {isCorrect ? (
            <p className="text-body mt-2">{props.successMessage}</p>
          ) : (
            <>
              {props.expected && (
                <div>
                  <h3 className="text-small font-semibold opacity-70">
                    Expected
                  </h3>
                  <p className="text-body mt-1">{props.expected}</p>
                </div>
              )}
              {props.yours && (
                <div>
                  <h3 className="text-small font-semibold opacity-70">
                    Your answer
                  </h3>
                  <p className="text-body mt-1">{props.yours}</p>
                </div>
              )}
            </>
          )}

          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="btn btn-secondary w-full sm:w-auto mt-4"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

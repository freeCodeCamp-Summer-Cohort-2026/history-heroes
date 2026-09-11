export type ActivityResult = 'neutral' | 'correct' | 'not-yet'

type ActivityFeedbackProps = {
  result: ActivityResult
}

function ActivityFeedback({ result }: ActivityFeedbackProps) {
  if (result === 'neutral') {
    return null
  }

  const isCorrect = result === 'correct'

  return (
    <div
      role="status"
      className={`Alert ${isCorrect ? 'alert-success' : 'alert-warning'}`}
    >
      <span aria-hidden="true">{isCorrect ? '✓' : '!'}</span>

      <div>
        <h2 className="font-bolt">{isCorrect ? 'correct' : 'Not yet'}</h2>
        <p>
          {isCorrect
            ? 'Nice work. Your answer is correct.'
            : 'Keep trying. Review your work and submit again.'}
        </p>
      </div>
    </div>
  )
}

export default ActivityFeedback

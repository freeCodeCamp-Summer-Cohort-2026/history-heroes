import { useCallback, useState } from 'react'
import type {
  Activity,
  ActivityWorkspaceSubmissionState,
  MatchingAnswer,
  OrderingAnswer,
} from './types'
import Button from '../../components/Button'
import MatchingRenderer from './MatchingRenderer'
import OrderingRenderer from './OrderingRenderer'
import FeedbackState from '../../components/FeedbackState'
import { getDefaultMatchingAnswer } from './get-default-matching-answer'
import { getDefaultOrderingAnswer } from './get-default-ordering-answer'

export type ActivityWorkspaceProps = {
  activities: Activity[]
}

export default function ActivityWorkspace({
  activities,
}: ActivityWorkspaceProps) {
  const [submissionState, setSubmissionState] =
    useState<ActivityWorkspaceSubmissionState>('unsubmitted')

  const [currentIndex, setCurrentIndex] = useState(0)
  const currentActivity = activities[currentIndex] ?? null

  // TODO: add an "working answer state" that represents the current answer for the current activity. This will be updated when the user changes their answer, and will be used to determine if the submission is correct or not. The initialization logic for this is dependant on the current activity type, and needs to be randomized.

  const handleSubmit = useCallback(() => {
    // TODO: setSubmissionState to the result of the current submission against the current activity's success criteria. If they match then update the submission state to "correct", otherwise update it to "not-yet".
    // TODO: setCurrentIndex to the next activity index if correct
  }, [])

  const handleAnswerChanged = useCallback(
    (newAnswer: MatchingAnswer | OrderingAnswer) => {
      // TODO: update the state for the "answer" state for the current activity.
      // TODO: update the submission state to "unsubmitted" when the answer changes, since the user has changed their answer and it needs to be re-submitted.
    },
    [],
  )

  return (
    <section aria-label="Lesson activities" className="space-y-6">
      {currentActivity ? (
        <div className="rounded-box border border-base-300 p-4 sm:p-6">
          <h2 className="text-heading">{currentActivity.title}</h2>
        </div>
      ) : (
        <div className="text-small">No current activity</div>
      )}
      {(() => {
        if (!currentActivity) return null // the above logic will show "no current activity" if this is the case, so we can just return null here

        if (currentActivity.type === 'matching') {
          return (
            <MatchingRenderer
              content={currentActivity.content}
              answer={getDefaultMatchingAnswer(currentActivity)}
              disabled={submissionState === 'correct'}
              onAnswerChange={handleAnswerChanged}
            />
          )
        }
        if (currentActivity.type === 'ordering') {
          return (
            <OrderingRenderer
              content={currentActivity.content}
              answer={getDefaultOrderingAnswer(currentActivity)}
              disabled={submissionState === 'correct'}
              onAnswerChange={handleAnswerChanged}
            />
          )
        }
        // this should be impossible if typescript is followed
        return null
      })()}

      {(() => {
        if (submissionState === 'correct') {
          return (
            <FeedbackState
              type="correct"
              checkStatement={currentActivity.checkStatement}
              successMessage="Well done! You can move on to the next activity."
              onAction={handleSubmit}
            />
          )
        }
        if (submissionState === 'not-yet') {
          return (
            <FeedbackState
              type="not-yet"
              checkStatement={currentActivity.checkStatement}
              expected="The expected answer is not yet met."
              yours="Your answer does not match the expected result."
              actionLabel="Try again"
              onAction={handleSubmit}
            />
          )
        }
        return <Button onClick={handleSubmit}>Submit</Button>
      })()}
    </section>
  )
}

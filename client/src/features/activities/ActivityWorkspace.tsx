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

  const handleSubmit = useCallback(() => {
    // TODO: setSubmissionState to the result of the current submission
    // TODO: setCurrentIndex to the next activity index if correct
  }, [])

  const handleAnswerChanged = useCallback(
    (newAnswer: MatchingAnswer | OrderingAnswer) => {
      // TODO: update the state for the "answer" state for the current activity.
    },
    [],
  )

  return (
    <section aria-label="Lesson activities" className="space-y-6">
      {currentActivity ? (
        <div
          key={currentActivity.id}
          className="rounded-box border border-base-300 p-4 sm:p-6"
        >
          <h2 className="text-heading">{currentActivity.title}</h2>
        </div>
      ) : (
        <div title={JSON.stringify(activities, null, 2)}>
          No current activity
        </div>
      )}
      {(() => {
        if (!currentActivity) return

        if (currentActivity.type === 'matching') {
          return (
            <MatchingRenderer
              content={currentActivity.content}
              answer={{
                // TODO: what is this supposed to come from?
                pairs: [],
              }}
              disabled={submissionState === 'correct'}
              onAnswerChange={handleAnswerChanged}
            />
          )
        }
        if (currentActivity.type === 'ordering') {
          return (
            <OrderingRenderer
              content={currentActivity.content}
              answer={{
                // TODO: what is this supposed to come from?
                itemOrder: [],
              }}
              disabled={submissionState === 'correct'}
              onAnswerChange={handleAnswerChanged}
            />
          )
        }
        return <div> unknown activity type</div>
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

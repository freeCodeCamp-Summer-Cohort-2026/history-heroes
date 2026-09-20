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
import { getDefaultMatchingAnswer } from './get-default-matching-answer'
import { getDefaultOrderingAnswer } from './get-default-ordering-answer'
import { isActivityAnswerCorrect } from './is-activity-answer-correct'

function getDefaultWorkingAnswer(
  activity: Activity | null,
): MatchingAnswer | OrderingAnswer | null {
  if (!activity) return null
  if (activity.type === 'matching') {
    return getDefaultMatchingAnswer(activity)
  }
  if (activity.type === 'ordering') {
    return getDefaultOrderingAnswer(activity)
  }
  return null
}

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

  const [prevActivityId, setPrevActivityId] = useState(currentActivity?.id)
  const [currentWorkingAnswer, setCurrentWorkingAnswer] = useState<
    MatchingAnswer | OrderingAnswer | null
  >(() => getDefaultWorkingAnswer(currentActivity))

  if (currentActivity?.id !== prevActivityId) {
    setPrevActivityId(currentActivity?.id)
    setCurrentWorkingAnswer(getDefaultWorkingAnswer(currentActivity))
  }

  const handleSubmit = useCallback(() => {
    if (!currentActivity) return

    const isCorrect = isActivityAnswerCorrect(
      currentActivity,
      currentWorkingAnswer,
    )
    setSubmissionState(isCorrect ? 'correct' : 'not-yet')

    if (isCorrect && currentIndex < activities.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSubmissionState('unsubmitted')
    }
  }, [activities.length, currentActivity, currentIndex, currentWorkingAnswer])

  const handleAnswerChanged = useCallback(
    (newAnswer: MatchingAnswer | OrderingAnswer) => {
      setCurrentWorkingAnswer(newAnswer)
      setSubmissionState('unsubmitted')
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
          const answer =
            currentWorkingAnswer && 'pairs' in currentWorkingAnswer
              ? currentWorkingAnswer
              : getDefaultMatchingAnswer(currentActivity)
          return (
            <MatchingRenderer
              content={currentActivity.content}
              answer={answer}
              disabled={submissionState === 'correct'}
              onAnswerChange={handleAnswerChanged}
            />
          )
        }
        if (currentActivity.type === 'ordering') {
          const answer =
            currentWorkingAnswer && 'itemOrder' in currentWorkingAnswer
              ? currentWorkingAnswer
              : getDefaultOrderingAnswer(currentActivity)
          return (
            <OrderingRenderer
              content={currentActivity.content}
              answer={answer}
              disabled={submissionState === 'correct'}
              onAnswerChange={handleAnswerChanged}
            />
          )
        }
        // this should be impossible if typescript is followed
        return null
      })()}

      {/* TODO (#66): Activity feedback display will be handled in issue #66 */}
      <Button onClick={handleSubmit}>Submit</Button>
    </section>
  )
}

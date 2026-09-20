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
    if (submissionState === 'correct') {
      if (currentIndex < activities.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setSubmissionState('unsubmitted')
      }
      return
    }

    if (submissionState === 'not-yet') {
      setSubmissionState('unsubmitted')
      return
    }

    if (!currentActivity) return

    const isCorrect = isActivityAnswerCorrect(
      currentActivity,
      currentWorkingAnswer,
    )
    setSubmissionState(isCorrect ? 'correct' : 'not-yet')
  }, [
    activities.length,
    currentActivity,
    currentIndex,
    currentWorkingAnswer,
    submissionState,
  ])

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
        if (!currentActivity) return null

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
        return null
      })()}

      {(() => {
        if (submissionState === 'correct') {
          const hasNextActivity = currentIndex < activities.length - 1
          return (
            <FeedbackState
              type="correct"
              checkStatement={currentActivity.checkStatement}
              successMessage={
                hasNextActivity
                  ? 'Well done! You can move on to the next activity.'
                  : 'Well done! You have completed all activities.'
              }
              actionLabel={hasNextActivity ? 'Next activity' : undefined}
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

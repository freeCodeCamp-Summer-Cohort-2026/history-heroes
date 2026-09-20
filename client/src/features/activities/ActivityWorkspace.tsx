import { useState } from 'react'
import type { Activity, ActivityResult } from './types'
import FeedbackState from '../../components/FeedbackState'

export type ActivityWorkspaceProps = {
  activities: Activity[]
}

type SubmissionState = {
  result: ActivityResult
  checkStatement?: string | null
  expected?: string | null
  yours?: string | null
}

export default function ActivityWorkspace({
  activities,
}: ActivityWorkspaceProps) {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState | null>(null)

  // mock feedback state for now, replaced once #64 lands
  const mockSubmit = () => {
    const next = submissionState?.result === 'not-yet' ? 'correct' : 'not-yet'

    setSubmissionState({
      result: next,
      checkStatement:
        'We checked whether your answer matches the expected order.',
      expected:
        next === 'not-yet' ? 'Events should go from earliest to latest.' : null,
      yours:
        next === 'not-yet' ? 'The first two events are out of order.' : null,
    })
  }

  return (
    <section aria-label="Lesson activities" className="space-y-6">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="rounded-box border border-base-300 p-4 sm:p-6"
        >
          <h2 className="text-heading">{activity.title}</h2>
        </div>
      ))}

      {submissionState && (
        <FeedbackState
          type={submissionState.result === 'correct' ? 'correct' : 'not-yet'}
          checked={submissionState.checkStatement ?? ''}
          successMessage="Your answer matches the expected result."
          expected={submissionState.expected ?? ''}
          yours={submissionState.yours ?? ''}
          actionLabel={
            submissionState.result === 'not-yet' ? 'Try again' : undefined
          }
          onAction={() => setSubmissionState(null)}
        />
      )}

      {import.meta.env.DEV && (
        <button className="btn btn-primary" onClick={mockSubmit}>
          Test submission
        </button>
      )}
    </section>
  )
}

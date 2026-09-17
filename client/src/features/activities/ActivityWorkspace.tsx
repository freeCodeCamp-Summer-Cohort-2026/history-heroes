import { useState } from 'react'
import type { Activity } from './types'
import type { SubmissionState } from './types'

export type ActivityWorkspaceProps = {
  activities: Activity[]
}

export default function ActivityWorkspace({
  activities,
}: ActivityWorkspaceProps) {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState | null>(null)

  return (
    <section aria-label="Lesson activities" className="space-y-6">
      <button
        className="btn btn-primary"
        onClick={() =>
          setSubmissionState({
            result: 'notYet',
            checkStatement:
              'We checked whether your answer matches the expected order.',
          })
        }
      >
        Test submission
      </button>

      {activities.map((activity) => (
        <div key={activity.id}>
          <h2 className="text-xl font-bold">{activity.title}</h2>

          {submissionState?.checkStatement && (
            <p className="mt-3 text-base-content/70">
              {submissionState.checkStatement}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}

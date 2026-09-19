import { useState } from 'react'
import type { Activity, ActivityResult } from './types'

export type ActivityWorkspaceProps = {
  activities: Activity[]
}

type SubmissionState = {
  result: ActivityResult
  checkStatement?: string | null
}

export default function ActivityWorkspace({
  activities,
}: ActivityWorkspaceProps) {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState | null>(null)

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

      {submissionState?.checkStatement && (
        <p className="mt-3 text-base-content/70">
          {submissionState.checkStatement}
        </p>
      )}

      {import.meta.env.DEV && (
        <button
          className="btn btn-primary"
          onClick={() =>
            setSubmissionState({
              result: 'not-yet',
              checkStatement:
                'We checked whether your answer matches the expected order.',
            })
          }
        >
          Test submission
        </button>
      )}
    </section>
  )
}

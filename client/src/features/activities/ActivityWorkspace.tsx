import type { Activity } from './types'

export type ActivityWorkspaceProps = {
  activities: Activity[]
}

export default function ActivityWorkspace({
  activities,
}: ActivityWorkspaceProps) {
  return (
    <section aria-label="Lesson activities">
      {activities.map((activity) => (
        <div key={activity.id}>
          <h2>{activity.title}</h2>
        </div>
      ))}
    </section>
  )
}

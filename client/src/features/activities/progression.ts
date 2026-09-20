import type { Activity, ActivityResult } from './types'
type ActivityResults = Partial<Record<string, ActivityResult>>

export function isLessonComplete(
  activities: Activity[],
  results: ActivityResults,
): boolean {
  if (activities.length === 0) {
    return false
  }
  return activities.every((activity) => results[activity.id] === 'correct')
}
export function isActivityUnlocked(
  activities: Activity[],
  results: ActivityResults,
  activityId: string,
): boolean {
  const activityIndex = activities.findIndex(
    (activity) => activity.id === activityId,
  )
  if (activityIndex === -1) {
    return false
  }
  return activities
    .slice(0, activityIndex)
    .every((activity) => results[activity.id] === 'correct')
}

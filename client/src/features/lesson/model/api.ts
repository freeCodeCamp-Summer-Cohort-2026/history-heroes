import type { Lesson } from './Lesson'
import type { Activity } from '../../activities/types'

export async function fetchLessons(moduleId: string): Promise<Lesson[]> {
  const response = await fetch(`/api/v1/modules/${moduleId}/lessons`)

  if (!response.ok) {
    throw new Error(`Failed to fetch lessons: ${response.status}`)
  }

  return response.json()
}

export async function fetchLessonActivities(
  lessonId: string,
): Promise<Activity[]> {
  const response = await fetch(`/api/v1/lessons/${lessonId}/activities`)

  if (!response.ok) {
    throw new Error(`Failed to fetch activities: ${response.status}`)
  }

  return response.json()
}

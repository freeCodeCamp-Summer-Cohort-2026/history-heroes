export type LessonCompletion = {
  lessonId: string
  completedAt: string
}

export type LabCompletion = {
  labId: string
  completedAt: string
}

export async function fetchLessonCompletions(): Promise<LessonCompletion[]> {
  const response = await fetch('/api/v1/progress')

  if (!response.ok) {
    throw new Error(`Failed to fetch lesson progress: ${response.status}`)
  }

  return response.json()
}

export async function recordLessonCompletion(
  lessonId: string,
): Promise<LessonCompletion> {
  const response = await fetch(`/api/v1/progress/lessons/${lessonId}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`Failed to save lesson completion: ${response.status}`)
  }

  return response.json()
}

export async function recordLabCompletion(
  labId: string,
): Promise<LabCompletion> {
  const response = await fetch(`/api/v1/progress/labs/${labId}`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error(`Failed to save lab completion: ${response.status}`)
  }

  return response.json()
}

export async function getLabCompletion(
  labId: string,
): Promise<LabCompletion | null> {
  const response = await fetch(`/api/v1/progress/labs/${labId}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to get lab completion: ${response.status}`)
  }

  return response.json()
}

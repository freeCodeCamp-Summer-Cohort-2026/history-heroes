export type LessonCompletion = {
  lessonId: string
  completedAt: string
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

import type { Lesson } from './model/Lesson'

export type LessonAvailability = 'locked' | 'unlocked' | 'completed'

export function orderLessons(lessons: readonly Lesson[]): Lesson[] {
  return [...lessons].sort(
    (first, second) => first.orderIndex - second.orderIndex,
  )
}

export function getLessonAvailability(
  lessons: readonly Lesson[],
  completedLessonIds: ReadonlySet<string>,
  lessonId: string,
): LessonAvailability {
  const orderedLessons = orderLessons(lessons)
  const lessonIndex = orderedLessons.findIndex(
    (lesson) => lesson.id === lessonId,
  )

  if (lessonIndex === -1) return 'locked'

  const previousLessonsComplete = orderedLessons
    .slice(0, lessonIndex)
    .every((lesson) => completedLessonIds.has(lesson.id))

  if (!previousLessonsComplete) return 'locked'
  return completedLessonIds.has(lessonId) ? 'completed' : 'unlocked'
}

export function getNextLesson(
  lessons: readonly Lesson[],
  lessonId: string,
): Lesson | null {
  const orderedLessons = orderLessons(lessons)
  const lessonIndex = orderedLessons.findIndex(
    (lesson) => lesson.id === lessonId,
  )

  if (lessonIndex === -1) return null
  return orderedLessons[lessonIndex + 1] ?? null
}

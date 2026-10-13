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

export type NextIncompleteItem =
  | { type: 'lesson'; lessonId: string; title: string; path: string }
  | { type: 'lab'; path: string; title: string }
  | null

export function getNextIncompleteItem(options: {
  moduleId: string
  lessons: readonly Lesson[]
  completedLessonIds: ReadonlySet<string>
  hasLab?: boolean
  isLabCompleted?: boolean
}): NextIncompleteItem {
  const {
    moduleId,
    lessons,
    completedLessonIds,
    hasLab = true,
    isLabCompleted = false,
  } = options
  const orderedLessons = orderLessons(lessons)

  const nextLesson = orderedLessons.find(
    (lesson) => !completedLessonIds.has(lesson.id),
  )

  if (nextLesson) {
    return {
      type: 'lesson',
      lessonId: nextLesson.id,
      title: nextLesson.title,
      path: `/modules/${moduleId}/lessons/${nextLesson.id}`,
    }
  }

  if (hasLab && !isLabCompleted) {
    return {
      type: 'lab',
      title: 'Module lab',
      path: `/modules/${moduleId}/lab`,
    }
  }

  return null
}

export function isModuleFullyCompleted(options: {
  lessons: readonly Lesson[]
  completedLessonIds: ReadonlySet<string>
  hasLab?: boolean
  isLabCompleted?: boolean
}): boolean {
  const {
    lessons,
    completedLessonIds,
    hasLab = true,
    isLabCompleted = false,
  } = options

  if (lessons.length === 0 && !hasLab) return false

  const allLessonsCompleted =
    lessons.length > 0
      ? lessons.every((lesson) => completedLessonIds.has(lesson.id))
      : true

  if (!allLessonsCompleted) return false
  if (hasLab && !isLabCompleted) return false

  return true
}

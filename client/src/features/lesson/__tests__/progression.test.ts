import type { Lesson } from '../model/Lesson'
import {
  getLessonAvailability,
  getNextLesson,
  orderLessons,
} from '../progression'

const lessons: Lesson[] = [
  {
    id: 'third-lesson',
    moduleId: 'test-module',
    title: 'Third lesson',
    description: '',
    orderIndex: 3,
    contents: '',
    activityIds: [],
  },
  {
    id: 'first-lesson',
    moduleId: 'test-module',
    title: 'First lesson',
    description: '',
    orderIndex: 1,
    contents: '',
    activityIds: [],
  },
  {
    id: 'second-lesson',
    moduleId: 'test-module',
    title: 'Second lesson',
    description: '',
    orderIndex: 2,
    contents: '',
    activityIds: [],
  },
]

test('orders lessons by their curriculum index without mutating the input', () => {
  expect(orderLessons(lessons).map((lesson) => lesson.id)).toEqual([
    'first-lesson',
    'second-lesson',
    'third-lesson',
  ])
  expect(lessons.map((lesson) => lesson.id)).toEqual([
    'third-lesson',
    'first-lesson',
    'second-lesson',
  ])
})

test('only makes the first lesson available to a new learner', () => {
  const completedLessonIds = new Set<string>()

  expect(
    getLessonAvailability(lessons, completedLessonIds, 'first-lesson'),
  ).toBe('unlocked')
  expect(
    getLessonAvailability(lessons, completedLessonIds, 'second-lesson'),
  ).toBe('locked')
  expect(
    getLessonAvailability(lessons, completedLessonIds, 'third-lesson'),
  ).toBe('locked')
})

test('only unlocks the next lesson when a lesson is completed', () => {
  const completedLessonIds = new Set(['first-lesson'])

  expect(
    getLessonAvailability(lessons, completedLessonIds, 'first-lesson'),
  ).toBe('completed')
  expect(
    getLessonAvailability(lessons, completedLessonIds, 'second-lesson'),
  ).toBe('unlocked')
  expect(
    getLessonAvailability(lessons, completedLessonIds, 'third-lesson'),
  ).toBe('locked')
})

test('keeps completed lessons available for review', () => {
  const completedLessonIds = new Set(['first-lesson', 'second-lesson'])

  expect(
    getLessonAvailability(lessons, completedLessonIds, 'first-lesson'),
  ).toBe('completed')
  expect(
    getLessonAvailability(lessons, completedLessonIds, 'second-lesson'),
  ).toBe('completed')
})

test('does not unlock lessons beyond a gap in completed lessons', () => {
  const completedLessonIds = new Set(['third-lesson'])

  expect(
    getLessonAvailability(lessons, completedLessonIds, 'first-lesson'),
  ).toBe('unlocked')
  expect(
    getLessonAvailability(lessons, completedLessonIds, 'second-lesson'),
  ).toBe('locked')
  expect(
    getLessonAvailability(lessons, completedLessonIds, 'third-lesson'),
  ).toBe('locked')
})

test('unlocks a later lesson after the full preceding sequence is complete', () => {
  const completedLessonIds = new Set(['first-lesson', 'second-lesson'])

  expect(
    getLessonAvailability(lessons, completedLessonIds, 'third-lesson'),
  ).toBe('unlocked')
})

test('finds only the immediate next lesson', () => {
  expect(getNextLesson(lessons, 'first-lesson')?.id).toBe('second-lesson')
  expect(getNextLesson(lessons, 'second-lesson')?.id).toBe('third-lesson')
})

test('has no next lesson after the final lesson', () => {
  expect(getNextLesson(lessons, 'third-lesson')).toBeNull()
  expect(getNextLesson(lessons, 'missing-lesson')).toBeNull()
})

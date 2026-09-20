import { describe, expect, test } from 'vitest'
import { isActivityUnlocked, isLessonComplete } from '../progression'
import type { Activity } from '../types'

function createActivity(id: string): Activity {
  return {
    id,
    type: 'ordering',
    title: 'Order the events',
    checkStatement: 'Put the events in the correct order.',
    content: {
      items: [
        { id: 'a', label: 'Events A' },
        { id: 'b', label: 'Events B' },
      ],
    },
    successCriteria: {
      correctOrder: ['a', 'b'],
    },
  }
}
const activities = [
  createActivity('activity-1'),
  createActivity('activity-2'),
  createActivity('activity-3'),
]

describe('isLessonComplete', () => {
  test('return false when there are no activities', () => {
    expect(isLessonComplete([], {})).toBe(false)
  })
  test('returns true when all activities are correct', () => {
    const results = {
      'activity-1': 'correct' as const,
      'activity-2': 'correct' as const,
      'activity-3': 'correct' as const,
    }
    expect(isLessonComplete(activities, results)).toBe(true)
  })
  test('returns false when an activity is not-yet', () => {
    const results = {
      'activity-1': 'correct' as const,
      'activity-2': 'not-yet' as const,
      'activity-3': 'correct' as const,
    }
    expect(isLessonComplete(activities, results)).toBe(false)
  })
  test('return false when an activity is unsubmitted', () => {
    const results = {
      'activity-1': 'correct' as const,
      'activity-2': 'unsubmitted' as const,
      'activity-3': 'correct' as const,
    }
    expect(isLessonComplete(activities, results)).toBe(false)
  })
  test('results false when an activity has no result', () => {
    const results = {
      'activity-1': 'correct' as const,
      'activity-2': 'correct' as const,
    }
    expect(isLessonComplete(activities, results)).toBe(false)
  })
})
describe('isActivityUnlocked', () => {
  test('unlocks the first activity initially', () => {
    expect(isActivityUnlocked(activities, {}, 'activity-1')).toBe(true)
  })
  test('keeps the second activity locked before completing the first', () => {
    expect(isActivityUnlocked(activities, {}, 'activity-2')).toBe(false)
  })
  test('unlocks the second activity after completing the first', () => {
    const results = {
      'activity-1': 'correct' as const,
    }
    expect(isActivityUnlocked(activities, results, 'activity-2')).toBe(true)
  })
  test('keeps the thrid activity locked when an earlier activity is not-yet', () => {
    const results = {
      'activity-1': 'correct' as const,
      'activity-2': 'not-yet' as const,
    }
    expect(isActivityUnlocked(activities, results, 'activity-3')).toBe(false)
  })
  test('unlocks the thrid activity when all preceding activities are correct', () => {
    const results = {
      'activity-1': 'correct' as const,
      'activity-2': 'correct' as const,
    }
    expect(isActivityUnlocked(activities, results, 'activity-3')).toBe(true)
  })
  test('does not unlock an unknown activity', () => {
    expect(isActivityUnlocked(activities, {}, 'unknown')).toBe(false)
  })
})

import { describe, expect, test } from 'vitest'
import { isActivityAnswerCorrect } from '../is-activity-answer-correct'
import type { Activity, MatchingAnswer, OrderingAnswer } from '../types'

describe('isActivityAnswerCorrect', () => {
  const orderingActivity: Activity = {
    id: 'ordering-1',
    type: 'ordering',
    title: 'Ordering Activity',
    checkStatement: 'Order events',
    content: {
      items: [
        { id: '1', label: 'First' },
        { id: '2', label: 'Second' },
        { id: '3', label: 'Third' },
      ],
    },
    successCriteria: {
      correctOrder: ['1', '2', '3'],
    },
  }

  const matchingActivity: Activity = {
    id: 'matching-1',
    type: 'matching',
    title: 'Matching Activity',
    checkStatement: 'Match pairs',
    content: {
      left: [
        { id: 'l1', label: 'Left 1' },
        { id: 'l2', label: 'Left 2' },
      ],
      right: [
        { id: 'r1', label: 'Right 1' },
        { id: 'r2', label: 'Right 2' },
      ],
    },
    successCriteria: {
      pairs: [
        { left: 'l1', right: 'r1' },
        { left: 'l2', right: 'r2' },
      ],
    },
  }

  test('returns false when answer is null', () => {
    expect(isActivityAnswerCorrect(orderingActivity, null)).toBe(false)
    expect(isActivityAnswerCorrect(matchingActivity, null)).toBe(false)
  })

  test('returns true for correct ordering answer', () => {
    const answer: OrderingAnswer = { itemOrder: ['1', '2', '3'] }
    expect(isActivityAnswerCorrect(orderingActivity, answer)).toBe(true)
  })

  test('returns false for incorrect ordering answer', () => {
    const answer: OrderingAnswer = { itemOrder: ['2', '1', '3'] }
    expect(isActivityAnswerCorrect(orderingActivity, answer)).toBe(false)
  })

  test('returns false for incomplete ordering answer', () => {
    const answer: OrderingAnswer = { itemOrder: ['1', '2'] }
    expect(isActivityAnswerCorrect(orderingActivity, answer)).toBe(false)
  })

  test('returns true for correct matching answer regardless of pair order', () => {
    const answer: MatchingAnswer = {
      pairs: [
        { left: 'l2', right: 'r2' },
        { left: 'l1', right: 'r1' },
      ],
    }
    expect(isActivityAnswerCorrect(matchingActivity, answer)).toBe(true)
  })

  test('returns false for incorrect matching pairs', () => {
    const answer: MatchingAnswer = {
      pairs: [
        { left: 'l1', right: 'r2' },
        { left: 'l2', right: 'r1' },
      ],
    }
    expect(isActivityAnswerCorrect(matchingActivity, answer)).toBe(false)
  })

  test('returns false for mismatched answer type', () => {
    const matchingAnswer: MatchingAnswer = {
      pairs: [{ left: 'l1', right: 'r1' }],
    }
    expect(isActivityAnswerCorrect(orderingActivity, matchingAnswer)).toBe(
      false,
    )

    const orderingAnswer: OrderingAnswer = {
      itemOrder: ['1', '2'],
    }
    expect(isActivityAnswerCorrect(matchingActivity, orderingAnswer)).toBe(
      false,
    )
  })
})

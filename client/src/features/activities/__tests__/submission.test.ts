import { describe, expect, test } from 'vitest'
import { clearStaleResult, submitActivity } from '../submission'
import type { Activity, MatchingAnswer, OrderingAnswer } from '../types'

describe('clearStaleResult', () => {
  test('returns unsubmitted when the learner edits after a not-yet result', () => {
    expect(clearStaleResult('not-yet')).toBe('unsubmitted')
  })

  test('keeps correct when the activity is already correct', () => {
    expect(clearStaleResult('correct')).toBe('correct')
  })

  test('keeps unsubmitted when the activity has not been submitted', () => {
    expect(clearStaleResult('unsubmitted')).toBe('unsubmitted')
  })
})
describe('submitActivity', () => {
  test('returns correct when a submitted ordering answer is correct', () => {
    const activity: Activity = {
      id: 'ordering-1',
      type: 'ordering',
      title: 'Order the events',
      checkStatement: 'Put the events in the correct order.',
      content: {
        items: [
          { id: 'a', label: 'Events A' },
          { id: 'b', label: 'Events B' },
          { id: 'c', label: 'Events C' },
        ],
      },

      successCriteria: {
        correctOrder: ['a', 'b', 'c'],
      },
    }
    const answer: OrderingAnswer = {
      itemOrder: ['a', 'b', 'c'],
    }
    expect(submitActivity(activity, answer)).toBe('correct')
  })

  test('returns not-yet when a submitted ordering answer is incorrect', () => {
    const activity: Activity = {
      id: 'ordering-1',
      type: 'ordering',
      title: 'Order the events',
      checkStatement: 'Put the events in the correct order.',
      content: {
        items: [
          { id: 'a', label: 'Events A' },
          { id: 'b', label: 'Events B' },
          { id: 'c', label: 'Events C' },
        ],
      },
      successCriteria: {
        correctOrder: ['a', 'b', 'c'],
      },
    }
    const answer: OrderingAnswer = {
      itemOrder: ['b', 'a', 'c'],
    }
    expect(submitActivity(activity, answer)).toBe('not-yet')
  })
  test('returns correct when a submitted matching answer is correct', () => {
    const activity: Activity = {
      id: 'matching-1',
      type: 'matching',
      title: 'Match the items',
      checkStatement: 'Match aech item with its pair.',
      content: {
        left: [
          { id: 'egypt', label: 'Egypt' },
          { id: 'rome', label: 'Rome' },
        ],
        right: [
          { id: 'pyramid', label: 'Pyramid' },
          { id: 'colosseum', label: 'Colosseum' },
        ],
      },
      successCriteria: {
        pairs: [
          { left: 'egypt', right: 'pyramid' },
          { left: 'rome', right: 'colosseum' },
        ],
      },
    }
    const answer: MatchingAnswer = {
      pairs: [
        { left: 'egypt', right: 'pyramid' },
        { left: 'rome', right: 'colosseum' },
      ],
    }
    expect(submitActivity(activity, answer)).toBe('correct')
  })
  test('returns not-yet when a submitted matching answer is incorrect', () => {
    const activity: Activity = {
      id: 'matching-1',
      type: 'matching',
      title: 'Match the items',
      checkStatement: 'Match each item with its pair.',
      content: {
        left: [
          { id: 'egypt', label: 'Egypt' },
          { id: 'rome', label: 'Rome' },
        ],
        right: [
          { id: 'pyramid', label: 'Pyramid' },
          { id: 'colosseum', label: 'Colosseum' },
        ],
      },
      successCriteria: {
        pairs: [
          { left: 'egypt', right: 'pyramid' },
          { left: 'rome', right: 'colosseum' },
        ],
      },
    }
    const answer: MatchingAnswer = {
      pairs: [
        { left: 'egypt', right: 'colosseum' },
        { left: 'rome', right: 'pyramid' },
      ],
    }
    expect(submitActivity(activity, answer)).toBe('not-yet')
  })
})

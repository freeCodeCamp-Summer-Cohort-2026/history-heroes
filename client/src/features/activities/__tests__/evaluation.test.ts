import { describe, expect, test } from 'vitest'
import { evaluateActivity } from '../evaluation'
import type { Activity, MatchingAnswer, OrderingAnswer } from '../types'

describe('evaluateActivity', () => {
  test('returns correct when ordering answer matches the correct order', () => {
    const activity: Activity = {
      id: 'ordering-1',
      type: 'ordering',
      title: 'Order the events',
      checkStatement: 'Put the events in the correct order.',
      content: {
        items: [
          { id: 'a', label: 'Event A' },
          { id: 'b', label: 'Event B' },
          { id: 'c', label: 'Event C' },
        ],
      },
      successCriteria: {
        correctOrder: ['a', 'b', 'c'],
      },
    }

    const answer: OrderingAnswer = {
      itemOrder: ['a', 'b', 'c'],
    }

    expect(evaluateActivity(activity, answer)).toBe('correct')
  })

  test('returns not-yet when ordering answer is in the wrong order', () => {
    const activity: Activity = {
      id: 'ordering-1',
      type: 'ordering',
      title: 'Order the events',
      checkStatement: 'Put the events in the correct order.',
      content: {
        items: [
          { id: 'a', label: 'Event A' },
          { id: 'b', label: 'Event B' },
          { id: 'c', label: 'Event C' },
        ],
      },
      successCriteria: {
        correctOrder: ['a', 'b', 'c'],
      },
    }
    const answer: OrderingAnswer = {
      itemOrder: ['b', 'a', 'c'],
    }

    expect(evaluateActivity(activity, answer)).toBe('not-yet')
  })

  test('returns not-yet when ordering answer is incomplete', () => {
    const activity: Activity = {
      id: 'ordering-1',
      type: 'ordering',
      title: 'Order the events',
      checkStatement: 'Put the events in correct order.',
      content: {
        items: [
          { id: 'a', label: 'Event A' },
          { id: 'b', label: 'Event B' },
          { id: 'c', label: 'Event C' },
        ],
      },
      successCriteria: {
        correctOrder: ['a', 'b', 'c'],
      },
    }

    const answer: OrderingAnswer = {
      itemOrder: ['a', 'b'],
    }

    expect(evaluateActivity(activity, answer)).toBe('not-yet')
  })

  test('returns correct when matching answer satisfies all pairs', () => {
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
        { left: 'egypt', right: 'pyramid' },
        { left: 'rome', right: 'colosseum' },
      ],
    }

    expect(evaluateActivity(activity, answer)).toBe('correct')
  })

  test('returns correct when matching pairs are in a different order', () => {
    const activity: Activity = {
      id: 'matching-1',
      type: 'matching',
      title: 'Match the items',
      checkStatement: 'Match each item with its pair.',
      content: {
        left: [
          { id: 'egypt', label: 'egypt' },
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
        { left: 'rome', right: 'colosseum' },
        { left: 'egypt', right: 'pyramid' },
      ],
    }

    expect(evaluateActivity(activity, answer)).toBe('correct')
  })

  test('returns not-yet when matching answer contains an incorrect pair.', () => {
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
    expect(evaluateActivity(activity, answer)).toBe('not-yet')
  })

  test('returns not-yet when matching answer is incomplete', () => {
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
        {
          left: 'egypt',
          right: 'pyramid',
        },
      ],
    }
    expect(evaluateActivity(activity, answer)).toBe('not-yet')
  })
})

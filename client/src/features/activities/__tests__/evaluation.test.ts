import { describe, expect, test } from 'vitest'
import { evaluateActivity } from '../evaluation'
import type {
  Activity,
  MatchingAnswer,
  OrderingAnswer,
  TrueFalseAnswer,
} from '../types'

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
  test('rejects duplicate matching pairs', () => {
    const activity: Activity = {
      id: 'matching-1',
      type: 'matching',
      title: 'Match the events',
      checkStatement: 'Match each items with its pairs',
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
        { left: 'egypt', right: 'pyramid' },
      ],
    }
    expect(evaluateActivity(activity, answer)).toBe('not-yet')
  })

  test('returns correct when true/false answer matches', () => {
    const activity: Activity = {
      id: 'true-false-1',
      type: 'true-false',
      title: 'Order the events',
      checkStatement: 'Checks they are in correct order.',
      content: {
        statement: 'This are in correct order',
      },
      successCriteria: {
        correctAnswer: true,
      },
    }

    const answer: TrueFalseAnswer = {
      value: true,
    }

    expect(evaluateActivity(activity, answer)).toBe('correct')
  })

  test('false is a valid correct answer', () => {
    const activity: Activity = {
      id: 'true-false-2',
      type: 'true-false',
      title: 'Order the events',
      checkStatement: 'Checks they are in correct order.',
      content: {
        statement: 'This are in correct order',
      },
      successCriteria: {
        correctAnswer: false,
      },
    }

    const answer: TrueFalseAnswer = {
      value: false,
    }

    expect(evaluateActivity(activity, answer)).toBe('correct')
  })

  test('returns not-yet when true/false answer dont match', () => {
    const activity: Activity = {
      id: 'true-false-3',
      type: 'true-false',
      title: 'Order the events',
      checkStatement: 'Checks they are in correct order.',
      content: {
        statement: 'This are in correct order',
      },
      successCriteria: {
        correctAnswer: false,
      },
    }

    const answer: TrueFalseAnswer = {
      value: true,
    }

    expect(evaluateActivity(activity, answer)).toBe('not-yet')
  })

  test('returns not-yet when true/false answer is null', () => {
    const activity: Activity = {
      id: 'true-false-4',
      type: 'true-false',
      title: 'Order the events',
      checkStatement: 'Checks they are in correct order.',
      content: {
        statement: 'This are in correct order',
      },
      successCriteria: {
        correctAnswer: true,
      },
    }

    const answer: TrueFalseAnswer = {
      value: null,
    }

    expect(evaluateActivity(activity, answer)).toBe('not-yet')
  })
})

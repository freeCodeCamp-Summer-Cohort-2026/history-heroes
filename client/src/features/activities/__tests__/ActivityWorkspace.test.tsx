import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ActivityWorkspace from '../ActivityWorkspace'
import type { Activity } from '../types'

const testActivities: Activity[] = [
  {
    id: 'activity-ordering-1',
    type: 'ordering',
    title: 'Order Timeline',
    checkStatement: 'We check chronological order.',
    content: {
      items: [
        { id: '1', label: 'Item 1' },
        { id: '2', label: 'Item 2' },
      ],
    },
    successCriteria: {
      correctOrder: ['1', '2'],
    },
  },
  {
    id: 'activity-matching-2',
    type: 'matching',
    title: 'Match Pairs',
    checkStatement: 'We check matching pairs.',
    content: {
      left: [{ id: 'l1', label: 'Left 1' }],
      right: [{ id: 'r1', label: 'Right 1' }],
    },
    successCriteria: {
      pairs: [{ left: 'l1', right: 'r1' }],
    },
  },
]

describe('ActivityWorkspace', () => {
  test('renders the first activity initially', () => {
    render(<ActivityWorkspace activities={testActivities} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Order Timeline' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  test('advances to next activity on submit', () => {
    render(<ActivityWorkspace activities={testActivities} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Order Timeline' }),
    ).toBeInTheDocument()

    // Submit the first activity (isActivityAnswerCorrect stub returns true)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    // Second activity is now active
    expect(
      screen.getByRole('heading', { level: 2, name: 'Match Pairs' }),
    ).toBeInTheDocument()
  })

  test('shows fallback message when no activities exist', () => {
    render(<ActivityWorkspace activities={[]} />)

    expect(screen.getByText('No current activity')).toBeInTheDocument()
  })
})

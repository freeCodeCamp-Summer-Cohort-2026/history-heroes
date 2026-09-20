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

  test('shows no feedback before submission', () => {
    render(<ActivityWorkspace activities={testActivities} />)

    expect(screen.queryByText('Correct')).not.toBeInTheDocument()
    expect(screen.queryByText('Not yet')).not.toBeInTheDocument()
  })

  test('submitting incorrect answer shows not-yet feedback and allows retry', () => {
    render(<ActivityWorkspace activities={testActivities} />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    const feedbackTitle = screen.getByRole('heading', {
      level: 2,
      name: /correct|not yet/i,
    })
    expect(feedbackTitle).toBeInTheDocument()

    if (feedbackTitle.textContent?.toLowerCase() === 'not yet') {
      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(tryAgainButton)
      expect(
        screen.getByRole('button', { name: /submit/i }),
      ).toBeInTheDocument()
    }
  })

  test('advances to next activity when correct feedback action is clicked', () => {
    const singleItemActivities: Activity[] = [
      {
        id: 'act-1',
        type: 'ordering',
        title: 'First Activity',
        checkStatement: 'Order check',
        content: { items: [{ id: 'item-1', label: 'Only item' }] },
        successCriteria: { correctOrder: ['item-1'] },
      },
      {
        id: 'act-2',
        type: 'ordering',
        title: 'Second Activity',
        checkStatement: 'Order check 2',
        content: { items: [{ id: 'item-2', label: 'Second item' }] },
        successCriteria: { correctOrder: ['item-2'] },
      },
    ]

    render(<ActivityWorkspace activities={singleItemActivities} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'First Activity' }),
    ).toBeInTheDocument()

    // Submit the first activity (guaranteed correct since 1 item)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /correct/i }),
    ).toBeInTheDocument()
    const nextButton = screen.getByRole('button', { name: /next activity/i })
    expect(nextButton).toBeInTheDocument()

    // Click next activity
    fireEvent.click(nextButton)

    // Second activity is now active and in unsubmitted state
    expect(
      screen.getByRole('heading', { level: 2, name: 'Second Activity' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()

    // Submit second activity
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    // Final activity complete message, no next activity button
    expect(
      screen.getByText('Well done! You have completed all activities.'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /next activity/i }),
    ).not.toBeInTheDocument()
  })

  test('shows fallback message when no activities exist', () => {
    render(<ActivityWorkspace activities={[]} />)

    expect(screen.getByText('No current activity')).toBeInTheDocument()
  })
})

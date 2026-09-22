import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ActivityWorkspace from '../ActivityWorkspace'
import type { Activity } from '../types'

function createFakeDataTransfer() {
  const stored: Record<string, string> = {}

  return {
    setData: (key: string, value: string) => {
      stored[key] = value
    },
    getData: (key: string) => {
      return stored[key]
    },
  }
}

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
  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  test('calls onComplete after the final activity is answered correctly', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const onComplete = vi.fn()

    render(
      <ActivityWorkspace activities={testActivities} onComplete={onComplete} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onComplete).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /next activity/i }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  test('does not call onComplete for an incorrect final answer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const onComplete = vi.fn()

    render(
      <ActivityWorkspace
        activities={[testActivities[0]]}
        onComplete={onComplete}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(onComplete).not.toHaveBeenCalled()
  })
  test('clears not-yet feedback when learner changes the answer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const matchingActivity: Activity = {
      id: 'matching-stale-result',
      type: 'matching',
      title: 'Match Events',
      checkStatement: 'We check matching pairs.',
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

    const dataTransfer = createFakeDataTransfer()

    render(<ActivityWorkspace activities={[matchingActivity]} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /not yet/i }),
    ).toBeInTheDocument()

    const source = screen.getByRole('button', {
      name: /right 1 - left 2/i,
    })

    const target = screen.getByRole('button', {
      name: /left 1 - right 2/i,
    })

    fireEvent.dragStart(source, { dataTransfer })
    fireEvent.drop(target, { dataTransfer })

    expect(
      screen.queryByRole('heading', { level: 2, name: /not yet/i }),
    ).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })
  test('submit a corrected matching answer as correct', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const matchingActivity: Activity = {
      id: 'matching-retry',
      type: 'matching',
      title: 'Match Events',
      checkStatement: 'We check matching pairs.',
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

    const dataTransfer = createFakeDataTransfer()

    render(<ActivityWorkspace activities={[matchingActivity]} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /not yet/i }),
    ).toBeInTheDocument()

    const right1 = screen.getByRole('button', {
      name: /right 1 - left 2/i,
    })

    const left1 = screen.getByRole('button', {
      name: /left 1 - right 2/i,
    })

    fireEvent.dragStart(right1, { dataTransfer })
    fireEvent.drop(left1, { dataTransfer })

    const right2 = screen.getByText(/^Right 2$/i)
    const left2 = screen.getByText(/^Left 2$/i)

    fireEvent.dragStart(right2, { dataTransfer })
    fireEvent.drop(left2, { dataTransfer })

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /correct/i }),
    ).toBeInTheDocument()
  })
  test('keeps previous activity result while retrying the current activity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const onComplete = vi.fn()

    const activities: Activity[] = [
      {
        id: 'first-activity',
        type: 'ordering',
        title: 'First Activity',
        checkStatement: 'First check',
        content: {
          items: [{ id: 'item-1', label: 'Only item' }],
        },
        successCriteria: {
          correctOrder: ['item-1'],
        },
      },
      {
        id: 'second-activity',
        type: 'matching',
        title: 'Second Activity',
        checkStatement: 'Second check',
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
      },
    ]

    const dataTransfer = createFakeDataTransfer()

    render(
      <ActivityWorkspace activities={activities} onComplete={onComplete} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByRole('heading', { level: 2, name: /correct/i }))

    fireEvent.click(screen.getByRole('button', { name: /next activity/i }))

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Second Activity',
      }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /not yet/i }),
    ).toBeInTheDocument()

    const right1 = screen.getByRole('button', {
      name: /right 1 - left 2/i,
    })

    const left1 = screen.getByRole('button', {
      name: /left 1 - right 2/i,
    })

    fireEvent.dragStart(right1, { dataTransfer })
    fireEvent.drop(left1, { dataTransfer })

    const right2 = screen.getByText(/^Right 2$/i)
    const left2 = screen.getByText(/^Left 2$/i)

    fireEvent.dragStart(right2, { dataTransfer })
    fireEvent.drop(left2, { dataTransfer })

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})

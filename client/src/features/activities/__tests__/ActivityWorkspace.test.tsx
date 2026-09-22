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
    successCriteria: { correctOrder: ['1', '2'] },
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
    successCriteria: { pairs: [{ left: 'l1', right: 'r1' }] },
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

    expect(screen.queryByText(/correct/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/not yet/i)).not.toBeInTheDocument()
  })

  test('shows not-yet feedback for an incorrect ordering submission', () => {
    render(<ActivityWorkspace activities={testActivities} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /not yet/i }),
    ).toBeInTheDocument()
  })

  test('shows not-yet feedback for incomplete matching submission', () => {
    const incompleteMatching: Activity[] = [
      {
        id: 'match-incomplete',
        type: 'matching',
        title: 'Match Test',
        checkStatement: 'Match check',
        content: {
          left: [{ id: 'l1', label: 'Left 1' }],
          right: [{ id: 'r1', label: 'Right 1' }],
        },
        successCriteria: { pairs: [{ left: 'l1', right: 'r1' }] },
      },
    ]

    render(<ActivityWorkspace activities={incompleteMatching} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /not yet/i }),
    ).toBeInTheDocument()
  })

  test('changing the answer after a not-yet result removes outdated feedback', () => {
    render(<ActivityWorkspace activities={testActivities} />)

    // First submit → not-yet
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(
      screen.getByRole('heading', { level: 2, name: /not yet/i }),
    ).toBeInTheDocument()

    // Change answer → feedback disappears
    fireEvent.change(screen.getByLabelText(/item 1/i), {
      target: { value: '2' },
    })

    expect(
      screen.queryByRole('heading', { level: 2, name: /not yet/i }),
    ).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  test('repeated not-yet submissions stay not-yet', () => {
    render(<ActivityWorkspace activities={testActivities} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(
      screen.getByRole('heading', { level: 2, name: /not yet/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /not yet/i }),
    ).toBeInTheDocument()
  })

  test('repeated correct submissions keep correct feedback', () => {
    const singleItem: Activity[] = [
      {
        id: 'only',
        type: 'ordering',
        title: 'Single',
        checkStatement: 'Check',
        content: { items: [{ id: 'x', label: 'X' }] },
        successCriteria: { correctOrder: ['x'] },
      },
    ]

    render(<ActivityWorkspace activities={singleItem} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(
      screen.getByRole('heading', { level: 2, name: /correct/i }),
    ).toBeInTheDocument()

    // Submit again → still correct
    fireEvent.click(screen.getByRole('button', { name: /next activity/i }))
    expect(
      screen.getByRole('heading', { level: 2, name: /correct/i }),
    ).toBeInTheDocument()
  })

  test('feedback only appears for the submitted activity', () => {
    render(<ActivityWorkspace activities={testActivities} />)

    // Submit first → not-yet
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(
      screen.getByRole('heading', { level: 2, name: /not yet/i }),
    ).toBeInTheDocument()

    // Reset and go to next activity
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    fireEvent.click(screen.getByRole('button', { name: /next activity/i }))

    // Second activity should start neutral
    expect(
      screen.queryByRole('heading', { level: 2, name: /not yet/i }),
    ).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  test('check statement appears with both correct and not-yet results', () => {
    render(<ActivityWorkspace activities={testActivities} />)

    // Incorrect → not-yet
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(
      screen.getByText(/we check chronological order/i),
    ).toBeInTheDocument()

    // Try again → correct (ordering default is correct)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByText(/we check chronological order/i),
    ).toBeInTheDocument()
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

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(
      screen.getByRole('heading', { level: 2, name: /correct/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /next activity/i }))
    expect(
      screen.getByRole('heading', { level: 2, name: 'Second Activity' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(
      screen.getByText('Well done! You have completed all activities.'),
    ).toBeInTheDocument()
  })

  test('shows fallback message when no activities exist', () => {
    render(<ActivityWorkspace activities={[]} />)
    expect(screen.getByText('No current activity')).toBeInTheDocument()
  })

  test('calls onComplete after the final activity is answered correctly', () => {
    const onComplete = vi.fn()

    render(
      <ActivityWorkspace activities={testActivities} onComplete={onComplete} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    fireEvent.click(screen.getByRole('button', { name: /next activity/i }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  test('does not call onComplete for an incorrect final answer', () => {
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
})

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import ActivityWorkspace from '../ActivityWorkspace'
import type { Activity } from '../types'
import { submitActivity } from '../submission'
import { evaluateActivity } from '../evaluation'

vi.mock('../submission', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../submission')>()
  return {
    ...actual,
    submitActivity: vi.fn(actual.submitActivity),
  }
})

const mockSubmitActivity = vi.mocked(submitActivity)
const mockEval = {
  mockReturnValue: (isCorrect: boolean) => {
    mockSubmitActivity.mockReturnValue(isCorrect ? 'correct' : 'not-yet')
  },
}

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
  beforeEach(() => {
    mockSubmitActivity.mockImplementation(evaluateActivity)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial render & neutral state', () => {
    test('renders the first activity initially without feedback or check statement', () => {
      render(<ActivityWorkspace activities={testActivities} />)

      expect(
        screen.getByRole('heading', { level: 2, name: 'Order Timeline' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /submit/i }),
      ).toBeInTheDocument()
      expect(screen.queryByText('Correct')).not.toBeInTheDocument()
      expect(screen.queryByText('Not yet')).not.toBeInTheDocument()
      expect(
        screen.queryByText('We check chronological order.'),
      ).not.toBeInTheDocument()
    })

    test('shows fallback message when no activities exist', () => {
      render(<ActivityWorkspace activities={[]} />)

      expect(screen.getByText('No current activity')).toBeInTheDocument()
    })
  })

  describe('Check statements for correct and not-yet submissions', () => {
    test('displays the authored check statement after a correct submission', () => {
      mockEval.mockReturnValue(true)

      render(<ActivityWorkspace activities={testActivities} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      expect(
        screen.getByRole('heading', { level: 2, name: /correct/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()
    })

    test('displays the authored check statement after a not-yet submission', () => {
      mockEval.mockReturnValue(false)

      render(<ActivityWorkspace activities={testActivities} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      expect(
        screen.getByRole('heading', { level: 2, name: /not yet/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()
    })

    test('displays check statement for incomplete matching submission', () => {
      mockEval.mockReturnValue(false)

      const incompleteMatching: Activity[] = [
        {
          id: 'match-incomplete',
          type: 'matching',
          title: 'Match Test',
          checkStatement: 'Match check statement.',
          content: {
            left: [{ id: 'l1', label: 'Left 1' }],
            right: [{ id: 'r1', label: 'Right 1' }],
          },
          successCriteria: {
            pairs: [{ left: 'l1', right: 'r1' }],
          },
        },
      ]

      render(<ActivityWorkspace activities={incompleteMatching} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      expect(
        screen.getByRole('heading', { level: 2, name: /not yet/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('Match check statement.')).toBeInTheDocument()
    })

    test('check statement appears with both correct and not-yet results on retry', () => {
      render(<ActivityWorkspace activities={testActivities} />)

      // First attempt: not-yet
      mockEval.mockReturnValue(false)
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()

      // Retry: correct
      mockEval.mockReturnValue(true)
      fireEvent.click(screen.getByRole('button', { name: /try again/i }))
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()
    })
  })

  describe('Repeated submissions', () => {
    test('repeated submissions continue to display the applicable check statement', () => {
      mockEval.mockReturnValue(false)

      render(<ActivityWorkspace activities={testActivities} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(
        screen.getByRole('heading', { level: 2, name: /not yet/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /try again/i }))
      expect(
        screen.queryByText('We check chronological order.'),
      ).not.toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(
        screen.getByRole('heading', { level: 2, name: /not yet/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /try again/i }))

      mockEval.mockReturnValue(true)
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(
        screen.getByRole('heading', { level: 2, name: /correct/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()
    })

    test('repeated not-yet submissions stay not-yet and continue displaying the check statement', () => {
      mockEval.mockReturnValue(false)

      render(<ActivityWorkspace activities={testActivities} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(
        screen.getByRole('heading', { level: 2, name: /not yet/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /try again/i }))
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      expect(
        screen.getByRole('heading', { level: 2, name: /not yet/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()
    })

    test('changing the answer after a not-yet result removes outdated feedback (successful retry path)', () => {
      mockEval.mockReturnValue(false)

      render(<ActivityWorkspace activities={testActivities} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(
        screen.getByRole('heading', { level: 2, name: /not yet/i }),
      ).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /try again/i }))
      expect(
        screen.queryByRole('heading', { level: 2, name: /not yet/i }),
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /submit/i }),
      ).toBeInTheDocument()

      mockEval.mockReturnValue(true)
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(
        screen.getByRole('heading', { level: 2, name: /correct/i }),
      ).toBeInTheDocument()
    })
  })

  describe('Activity isolation', () => {
    test('submitting one activity does not display another activity check statement', () => {
      mockEval.mockReturnValue(true)

      render(<ActivityWorkspace activities={testActivities} />)

      expect(
        screen.queryByText('We check chronological order.'),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('We check matching pairs.'),
      ).not.toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      expect(
        screen.getByText('We check chronological order.'),
      ).toBeInTheDocument()
      expect(
        screen.queryByText('We check matching pairs.'),
      ).not.toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /next activity/i }))

      expect(
        screen.getByRole('heading', { level: 2, name: 'Match Pairs' }),
      ).toBeInTheDocument()
      expect(
        screen.queryByText('We check chronological order.'),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByText('We check matching pairs.'),
      ).not.toBeInTheDocument()

      mockEval.mockReturnValue(false)
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      expect(screen.getByText('We check matching pairs.')).toBeInTheDocument()
      expect(
        screen.queryByText('We check chronological order.'),
      ).not.toBeInTheDocument()
    })
  })

  describe('Exact-text display and criteria isolation', () => {
    test('displays exact authored check statement and never raw or serialized success criteria', () => {
      mockEval.mockReturnValue(true)

      const exactStatement = 'Put ancient civilisations in order of appearance.'
      const activityWithCriteria: Activity = {
        id: 'civilisations-order',
        type: 'ordering',
        title: 'Ancient Civilisations',
        checkStatement: exactStatement,
        content: {
          items: [
            { id: 'item-sumer', label: 'Sumer' },
            { id: 'item-rome', label: 'Rome' },
          ],
        },
        successCriteria: {
          correctOrder: ['item-sumer', 'item-rome'],
        },
      }

      render(<ActivityWorkspace activities={[activityWithCriteria]} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      expect(screen.getByText(exactStatement)).toBeInTheDocument()

      expect(
        screen.queryByText(
          JSON.stringify(activityWithCriteria.successCriteria),
        ),
      ).not.toBeInTheDocument()
      expect(screen.queryByText(/correctOrder/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/item-sumer/i)).not.toBeInTheDocument()
    })

    test('gracefully handles missing or empty check statement without crashing', () => {
      mockEval.mockReturnValue(true)

      const activityWithoutStatement: Activity = {
        id: 'no-statement-activity',
        type: 'ordering',
        title: 'No Statement Activity',
        checkStatement: '',
        content: { items: [{ id: '1', label: 'Item 1' }] },
        successCriteria: { correctOrder: ['1'] },
      }

      render(<ActivityWorkspace activities={[activityWithoutStatement]} />)

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))

      expect(
        screen.getByRole('heading', { level: 2, name: /correct/i }),
      ).toBeInTheDocument()
      expect(screen.queryByText('What we checked')).not.toBeInTheDocument()
    })
  })

  describe('Progression and completion', () => {
    test('advances to next activity when correct feedback action is clicked', () => {
      mockEval.mockReturnValue(true)

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
      expect(
        screen.queryByRole('button', { name: /next activity/i }),
      ).not.toBeInTheDocument()
    })

    test('calls onComplete after the final activity is answered correctly', () => {
      mockEval.mockReturnValue(true)

      const onComplete = vi.fn()

      render(
        <ActivityWorkspace
          activities={testActivities}
          onComplete={onComplete}
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      fireEvent.click(screen.getByRole('button', { name: /next activity/i }))

      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    test('does not call onComplete for an incorrect final answer', () => {
      mockEval.mockReturnValue(false)

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
    const onComplete = vi.fn()

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

    render(
      <ActivityWorkspace
        activities={[matchingActivity]}
        onComplete={onComplete}
      />,
    )

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

    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: /correct|not yet/i,
      }),
    ).not.toBeInTheDocument()

    expect(onComplete).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /correct/i }),
    ).toBeInTheDocument()

    expect(onComplete).toHaveBeenCalledTimes(1)
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

    expect(
      screen.getByRole('heading', { level: 2, name: /correct/i }),
    ).toBeInTheDocument()

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

    expect(
      screen.queryByRole('heading', {
        level: 2,
        name: /correct|not yet/i,
      }),
    ).not.toBeInTheDocument()

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(onComplete).toHaveBeenCalledTimes(1)
  })
  test('does not complete a lesson without activities', () => {
    const onComplete = vi.fn()

    render(<ActivityWorkspace activities={[]} onComplete={onComplete} />)

    expect(screen.getByText('No current activity')).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
})

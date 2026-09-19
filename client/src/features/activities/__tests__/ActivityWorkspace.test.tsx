import { render, screen, fireEvent } from '@testing-library/react'
import ActivityWorkspace from '../ActivityWorkspace'
import type { Activity } from '../types'

beforeAll(() => {
  ;(import.meta as unknown as { env: { DEV: boolean } }).env = { DEV: true }
})

const activities: Activity[] = [
  {
    id: 'a1',
    type: 'ordering',
    title: 'Activity One',
    checkStatement:
      'We checked whether your answer matches the expected order.',
    content: {
      items: [
        { id: '1', label: 'Event 1' },
        { id: '2', label: 'Event 2' },
      ],
    },
    successCriteria: {
      correctOrder: ['1', '2'],
    },
  },
  {
    id: 'a2',
    type: 'matching',
    title: 'Activity Two',
    checkStatement:
      'We checked whether your answer matches the expected pairs.',
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
  it('shows no feedback before submission', () => {
    render(<ActivityWorkspace activities={activities} />)

    expect(screen.queryByText('Correct')).not.toBeInTheDocument()
    expect(screen.queryByText('Not yet')).not.toBeInTheDocument()
  })

  it('shows not-yet feedback after mock submission', () => {
    render(<ActivityWorkspace activities={activities} />)

    fireEvent.click(screen.getByText('Test submission'))

    expect(screen.getByText('Not yet')).toBeInTheDocument()
    expect(
      screen.getByText(
        'We checked whether your answer matches the expected order.',
      ),
    ).toBeInTheDocument()
  })

  it('switches to correct on retry', () => {
    render(<ActivityWorkspace activities={activities} />)

    fireEvent.click(screen.getByText('Test submission')) // first → not-yet
    fireEvent.click(screen.getByText('Test submission')) // second → correct

    expect(screen.getByText('Correct')).toBeInTheDocument()
  })

  it('removes feedback when Try again is clicked', () => {
    render(<ActivityWorkspace activities={activities} />)

    fireEvent.click(screen.getByText('Test submission')) // not-yet
    fireEvent.click(screen.getByText('Try again'))

    expect(screen.queryByText('Not yet')).not.toBeInTheDocument()
    expect(screen.queryByText('Correct')).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import ActivityWorkspace from '../ActivityWorkspace'
import type { Activity } from '../types'

test('renders activities in their defined order', () => {
  const activities: Activity[] = [
    {
      id: 'activity-1',
      type: 'ordering',
      title: 'First activity',
      checkStatement: 'Put the items in order.',
      content: {
        items: [
          { id: 'a', label: 'First' },
          { id: 'b', label: 'Second' },
        ],
      },
      successCriteria: {
        correctOrder: ['a', 'b'],
      },
    },
    {
      id: 'activity-2',
      type: 'matching',
      title: 'Second activity',
      checkStatement: 'Match the items.',
      content: {
        left: [{ id: 'left-1', label: 'Egypt' }],
        right: [{ id: 'right-1', label: 'Pyramid' }],
      },
      successCriteria: {
        pairs: [{ left: 'left-1', right: 'right-1' }],
      },
    },
  ]

  render(<ActivityWorkspace activities={activities} />)

  const headings = screen.getAllByRole('heading', { level: 2 })

  expect(headings[0]).toHaveTextContent('First activity')
  expect(headings[1]).toHaveTextContent('Second activity')
})

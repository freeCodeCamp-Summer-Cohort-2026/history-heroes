import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'
import type { Lab } from '../../features/lab/model/Lab'

const testLab: Lab = {
  id: 'first-lab',
  moduleId: 'first-module',
  title: 'Test Module Lab',
  description: 'Use what you learned to complete the challenge.',
  activities: [
    {
      id: 'first-activity',
      type: 'ordering',
      title: 'First Lab Activity',
      checkStatement: 'The first item is in the correct place.',
      content: {
        items: [{ id: 'a', label: 'Item A' }],
      },
      successCriteria: { correctOrder: ['a'] },
    },
    {
      id: 'second-activity',
      type: 'ordering',
      title: 'Second Lab Activity',
      checkStatement: 'The second item is in the correct place.',
      content: {
        items: [{ id: 'b', label: 'Item B' }],
      },
      successCriteria: { correctOrder: ['b'] },
    },
  ],
}

function renderLabPage() {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/modules/first-module/lab'],
      })}
    />,
  )
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => testLab,
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('opens the lab and shows its outcome description', async () => {
  renderLabPage()

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Test Module Lab' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText('Use what you learned to complete the challenge.'),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { level: 2, name: 'First Lab Activity' }),
  ).toBeInTheDocument()
})

test('submitting an activity shows its check statement and result', async () => {
  renderLabPage()

  await screen.findByRole('heading', { level: 1, name: 'Test Module Lab' })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

  expect(
    screen.getByText('The first item is in the correct place.'),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { level: 2, name: 'Correct' }),
  ).toBeInTheDocument()
})

test('does not mark an incomplete lab as complete', async () => {
  renderLabPage()

  await screen.findByRole('heading', { level: 1, name: 'Test Module Lab' })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

  expect(screen.queryByText('Lab complete.')).not.toBeInTheDocument()
})

test('marks the lab complete after every activity is correct', async () => {
  renderLabPage()

  await screen.findByRole('heading', { level: 1, name: 'Test Module Lab' })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  fireEvent.click(screen.getByRole('button', { name: 'Next activity' }))
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

  expect(await screen.findByRole('status')).toHaveTextContent('Lab complete.')
})

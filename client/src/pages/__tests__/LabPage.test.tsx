import { fireEvent, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'
import { renderWithAuth } from '../../test/utils'
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
  renderWithAuth(
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
    vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/progress/labs/')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Not found' }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => testLab,
      })
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

test('marks the lab complete after every activity is correct and records completion', async () => {
  const fetchMock = vi
    .fn()
    .mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes('/api/v1/progress/labs/')) {
        if (options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            status: 201,
            json: async () => ({
              labId: 'first-lab',
              completedAt: '2026-10-01T12:00:00.000Z',
            }),
          })
        }
        return Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Not found' }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => testLab,
      })
    })
  vi.stubGlobal('fetch', fetchMock)

  renderLabPage()

  await screen.findByRole('heading', { level: 1, name: 'Test Module Lab' })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  fireEvent.click(screen.getByRole('button', { name: 'Next activity' }))
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

  expect(await screen.findByRole('status')).toHaveTextContent('Lab complete.')

  const postCall = fetchMock.mock.calls.find(
    (call) =>
      call[0] === '/api/v1/progress/labs/first-lab' &&
      call[1]?.method === 'POST',
  )
  expect(postCall).toBeDefined()
  expect(
    screen.getByRole('link', { name: 'Back to module' }),
  ).toBeInTheDocument()
})

test('recognizes and restores previously completed lab on load/refresh', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      if (url === '/api/v1/progress/labs/first-lab') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            labId: 'first-lab',
            completedAt: '2026-09-30T10:00:00.000Z',
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => testLab,
      })
    }),
  )

  renderLabPage()

  await screen.findByRole('heading', { level: 1, name: 'Test Module Lab' })
  expect(await screen.findByRole('status')).toHaveTextContent('Lab complete.')
  expect(
    screen.getByRole('link', { name: 'Back to module' }),
  ).toBeInTheDocument()
})

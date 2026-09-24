import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'

const testModules = [
  {
    id: 'first-module',
    title: 'Test Module One',
    description: 'A test module.',
    period: 'Ancient World',
    theme: 'Architecture and Engineering',
  },
  {
    id: 'second-module',
    title: 'Test Module Two',
    description: 'A second test module.',
  },
]

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => testModules,
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('displays both modules', async () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  expect(await screen.findByText('Test Module One')).toBeInTheDocument()
  expect(await screen.findByText('Test Module Two')).toBeInTheDocument()
})

test('opens the first module when it is selected', async () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  const startLearningButtons = await screen.findAllByText('Start learning', {
    selector: 'a',
  })
  fireEvent.click(startLearningButtons[0])

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Test Module One' }),
  ).toBeInTheDocument()
})

test('opens the second module when it is selected', async () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  const startLearningButtons = await screen.findAllByText('Start learning', {
    selector: 'a',
  })
  fireEvent.click(startLearningButtons[1])

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Test Module Two' }),
  ).toBeInTheDocument()
})

test('shows each module as a card', async () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  expect(await screen.findAllByRole('article')).toHaveLength(2)
})

test('shows an empty state when there are no modules', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }),
  )
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  expect(
    await screen.findByText(/no modules are available yet/i),
  ).toBeInTheDocument()
})

test('shows the period and theme on a module card', async () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  expect(await screen.findByText('Ancient World')).toBeInTheDocument()
  expect(screen.getByText('Architecture and Engineering')).toBeInTheDocument()
})

test('shows a friendly error message when modules fail to load', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockRejectedValue(
        new Error('Request failed with status 500: database connection failed'),
      ),
  )
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )
  const alert = await screen.findByRole('alert')

  expect(alert).toHaveTextContent("We couldn't load modules right now.")

  expect(
    screen.queryByText(/database connection failed/i),
  ).not.toBeInTheDocument()
  expect(screen.queryByText(/status 500/i)).not.toBeInTheDocument()
})

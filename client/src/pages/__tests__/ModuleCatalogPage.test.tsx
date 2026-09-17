import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'

const testModules = [
  {
    id: 'first-module',
    title: 'Test Module One',
    description: 'A test module.',
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

  const buttons = await screen.findAllByRole('button', {
    name: /start learning/i,
  })
  fireEvent.click(buttons[0])

  expect(
    await screen.findByRole('heading', { name: /module: first-module/i }),
  ).toBeInTheDocument()
})

test('opens the second module when it is selected', async () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  const buttons = await screen.findAllByRole('button', {
    name: /start learning/i,
  })
  fireEvent.click(buttons[1])

  expect(
    await screen.findByRole('heading', { name: /module: second-module/i }),
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

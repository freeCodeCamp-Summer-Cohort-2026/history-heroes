import { fireEvent, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'
import { renderWithAuth } from '../../test/utils'

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
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  expect(await screen.findByText('Test Module One')).toBeInTheDocument()
  expect(await screen.findByText('Test Module Two')).toBeInTheDocument()
})

test('opens the first module when it is selected', async () => {
  renderWithAuth(
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
  renderWithAuth(
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
  renderWithAuth(
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
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  expect(
    await screen.findByText(/no modules are available yet/i),
  ).toBeInTheDocument()
})

test('shows the period and theme on a module card', async () => {
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  const [firstCard] = await screen.findAllByRole('article')

  expect(within(firstCard).getByText('Ancient World')).toBeInTheDocument()

  expect(
    within(firstCard).getByText('Architecture and Engineering'),
  ).toBeInTheDocument()
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

  renderWithAuth(
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

test('shows an edit link for each module when user is a content author', async () => {
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
    {
      authValue: {
        user: {
          id: 1,
          email: 'author@historyheroes.org',
          isContentAuthor: true,
        },
      },
    },
  )

  const cards = await screen.findAllByRole('article')

  expect(within(cards[0]).getByRole('link', { name: /edit/i })).toHaveAttribute(
    'href',
    '/modules/first-module/edit',
  )

  expect(within(cards[1]).getByRole('link', { name: /edit/i })).toHaveAttribute(
    'href',
    '/modules/second-module/edit',
  )
})

test('does not show an edit link when user is not a content author', async () => {
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
    {
      authValue: {
        user: {
          id: 2,
          email: 'learner@historyheroes.org',
          isContentAuthor: false,
        },
      },
    },
  )

  const cards = await screen.findAllByRole('article')

  expect(
    within(cards[0]).queryByRole('link', { name: /edit/i }),
  ).not.toBeInTheDocument()

  expect(
    within(cards[1]).queryByRole('link', { name: /edit/i }),
  ).not.toBeInTheDocument()
})

test('displays the page title with site-name', () => {
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  expect(document.title).toBe('Modules - History Heroes')
})

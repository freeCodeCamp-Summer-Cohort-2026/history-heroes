import { screen, fireEvent, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../App'
import { renderWithAuth } from '../test/utils'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('renders the module catalog', async () => {
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  expect(
    await screen.findByRole('heading', { name: /modules/i }),
  ).toBeInTheDocument()
})

test('shows a message for an unknown module', async () => {
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/modules/seven-wonders'],
      })}
    />,
  )

  expect(
    await screen.findByText('That module could not be found.'),
  ).toBeInTheDocument()
})

test('shows page not found when unknown route is provided', () => {
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/nonsense'] })}
    />,
  )

  expect(
    screen.getByRole('heading', { name: /page not found/i }),
  ).toBeInTheDocument()
})

test('shows the site heading', async () => {
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/modules/seven-wonders/lessons/great-pyramid'],
      })}
    />,
  )

  expect(
    screen.getByRole('link', { name: /history heroes/i }),
  ).toBeInTheDocument()
  expect(
    await screen.findByText('That lesson could not be found.'),
  ).toBeInTheDocument()
})

test('scrolls to the top when the page changes', async () => {
  const scrollSpy = vi.spyOn(window, 'scrollTo')
  const router = createMemoryRouter(routes, {
    initialEntries: ['/modules/seven-wonders'],
  })
  renderWithAuth(<RouterProvider router={router} />)

  await screen.findByText('That module could not be found.')
  scrollSpy.mockClear()
  fireEvent.click(screen.getByRole('link', { name: /history heroes/i }))
  await screen.findByRole('heading', { name: /modules/i })

  expect(scrollSpy).toHaveBeenCalledWith(0, 0)
})

test('renders the module editor route', async () => {
  const module = {
    id: 'seven-wonders',
    title: 'Seven Wonders',
    description: 'Explore the ancient wonders.',
    period: 'Ancient',
    theme: 'Architecture',
  }

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [module],
    }),
  )

  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/modules/seven-wonders/edit'],
      })}
    />,
  )
  expect(
    await screen.findByRole('heading', { name: /edit module/i }),
  ).toBeInTheDocument()

  expect(screen.getByLabelText('Title')).toHaveValue('Seven Wonders')

  expect(screen.getByLabelText('Description')).toHaveValue(
    'Explore the ancient wonders.',
  )

  expect(screen.getByLabelText('Period')).toHaveValue('Ancient')

  expect(screen.getByLabelText('Theme')).toHaveValue('Architecture')

  fireEvent.click(screen.getByRole('button', { name: /preview/i }))

  expect(
    screen.getByRole('heading', { name: 'Seven Wonders' }),
  ).toBeInTheDocument()

  expect(screen.getByText('Explore the ancient wonders.')).toBeInTheDocument()

  expect(screen.getByText('Ancient')).toBeInTheDocument()
  expect(screen.getByText('Architecture')).toBeInTheDocument()

  expect(
    screen.getByRole('link', { name: /back to modules/i }),
  ).toHaveAttribute('href', '/')
})
test('saves module changes', async () => {
  const module = {
    id: 'seven-wonders',
    title: 'Seven Wonders',
    description: 'Explore the ancient wonders.',
    period: 'Ancient',
    theme: 'Architecture',
  }

  const fetchMock = vi.fn().mockImplementation((url, options) => {
    if (url === '/api/v1/modules') {
      return Promise.resolve({
        ok: true,
        json: async () => [module],
      })
    }

    if (
      url === '/api/v1/modules/seven-wonders' &&
      options?.method === 'PATCH'
    ) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          ...module,
          title: 'Seven Wonders Updated',
        }),
      })
    }

    throw new Error(`Unexpected fetch request: ${String(url)}`)
  })

  vi.stubGlobal('fetch', fetchMock)

  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/modules/seven-wonders/edit'],
      })}
    />,
  )

  const titleInput = await screen.findByLabelText('Title')

  fireEvent.change(titleInput, {
    target: { value: 'Seven Wonders Updated' },
  })

  fireEvent.click(screen.getByRole('button', { name: /save/i }))

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/modules/seven-wonders', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Seven Wonders Updated',
        description: 'Explore the ancient wonders.',
        period: 'Ancient',
        theme: 'Architecture',
      }),
    })
  })
})

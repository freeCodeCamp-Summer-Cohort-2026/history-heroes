import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../App'

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
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/'] })}
    />,
  )

  expect(
    await screen.findByRole('heading', { name: /modules/i }),
  ).toBeInTheDocument()
})

test('shows the module id', () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/modules/seven-wonders'],
      })}
    />,
  )

  expect(screen.getByText(/module: seven-wonders/i)).toBeInTheDocument()
})

test('shows page not found when unknown route is provided', () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/nonsense'] })}
    />,
  )

  expect(
    screen.getByRole('heading', { name: /page not found/i }),
  ).toBeInTheDocument()
})

test('shows the site heading', () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/modules/seven-wonders/lessons/great-pyramid'],
      })}
    />,
  )

  expect(
    screen.getByRole('link', { name: /history heroes/i }),
  ).toBeInTheDocument()
})

test('scrolls to the top when the page changes', async () => {
  const scrollSpy = vi.spyOn(window, 'scrollTo')
  const router = createMemoryRouter(routes, {
    initialEntries: ['/modules/seven-wonders'],
  })
  render(<RouterProvider router={router} />)

  scrollSpy.mockClear()
  fireEvent.click(screen.getByRole('link', { name: /history heroes/i }))
  await screen.findByRole('heading', { name: /modules/i })

  expect(scrollSpy).toHaveBeenCalledWith(0, 0)
})

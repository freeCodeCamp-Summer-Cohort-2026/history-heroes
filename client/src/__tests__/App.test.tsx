import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

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
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )

  expect(
    await screen.findByRole('heading', { name: /modules/i }),
  ).toBeInTheDocument()
})

test('shows the module id', () => {
  render(
    <MemoryRouter initialEntries={['/modules/seven-wonders']}>
      <App />
    </MemoryRouter>,
  )

  expect(screen.getByText(/module: seven-wonders/i)).toBeInTheDocument()
})

test('shows both the module id and lesson id', () => {
  render(
    <MemoryRouter
      initialEntries={['/modules/seven-wonders/lessons/great-pyramid']}
    >
      <App />
    </MemoryRouter>,
  )

  expect(screen.getByText(/lesson: great-pyramid/i)).toBeInTheDocument()
  expect(screen.getByText(/from module: seven-wonders/i)).toBeInTheDocument()
})

test('shows page not found when unknown route is provided', () => {
  render(
    <MemoryRouter initialEntries={['/nonsense']}>
      <App />
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('heading', { name: /page not found/i }),
  ).toBeInTheDocument()
})

test('shows the site heading', () => {
  render(
    <MemoryRouter
      initialEntries={['/modules/seven-wonders/lessons/great-pyramid']}
    >
      <App />
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('link', { name: /history heroes/i }),
  ).toBeInTheDocument()
})

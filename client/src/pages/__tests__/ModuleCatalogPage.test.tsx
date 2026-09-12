import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'

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
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )

  expect(await screen.findByText('Test Module One')).toBeInTheDocument()
  expect(await screen.findByText('Test Module Two')).toBeInTheDocument()
})

test('opens the first module when it is selected', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
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
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )

  const buttons = await screen.findAllByRole('button', {
    name: /start learning/i,
  })
  fireEvent.click(buttons[1])

  expect(
    await screen.findByRole('heading', { name: /module: second-module/i }),
  ).toBeInTheDocument()
})

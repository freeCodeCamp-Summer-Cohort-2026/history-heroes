import { render, screen } from '@testing-library/react'
import Example from '../Example'
import '@testing-library/jest-dom'

test('renders example component', () => {
  render(<Example />)
  expect(screen.getByText(/hello world/i)).toBeInTheDocument()
})

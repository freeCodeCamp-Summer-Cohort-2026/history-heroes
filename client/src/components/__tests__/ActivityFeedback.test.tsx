import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ActivityFeedback from '../ActivityFeedback'

test('does not display feedback for a neutral activity', () => {
  render(<ActivityFeedback result="neutral" />)

  expect(screen.queryByText(/correct/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/not yet/i)).not.toBeInTheDocument()
})

test('display correct feedback for a correct activity', () => {
  render(<ActivityFeedback result="correct" />)

  expect(screen.getByRole('heading', { name: /correct/i })).toBeInTheDocument()
  expect(
    screen.getByText(/Nice work. Your answer is correct./i),
  ).toBeInTheDocument()
})

test('displays not-yet feedback for a not-yet activity', () => {
  render(<ActivityFeedback result="not-yet" />)

  expect(screen.getByText(/not yet/i)).toBeInTheDocument()
  expect(
    screen.getByText(/Keep trying. Review your work and submit again./i),
  ).toBeInTheDocument()
})

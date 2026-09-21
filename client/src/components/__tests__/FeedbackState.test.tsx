import { render, screen } from '@testing-library/react'
import FeedbackState from '../../components/FeedbackState'

describe('FeedbackState', () => {
  it('renders correct state', () => {
    render(
      <FeedbackState
        type="correct"
        checked="We checked something."
        successMessage="Your answer matches the expected result."
      />,
    )

    expect(screen.getByText('Correct')).toBeInTheDocument()
    expect(
      screen.getByText('Your answer matches the expected result.'),
    ).toBeInTheDocument()
    expect(screen.getByText('We checked something.')).toBeInTheDocument()
  })

  it('renders not-yet state', () => {
    render(
      <FeedbackState
        type="not-yet"
        checked="We checked something."
        expected="Expected value"
        yours="Your value"
        actionLabel="Try again"
        onAction={() => {}}
      />,
    )

    expect(screen.getByText('Not yet')).toBeInTheDocument()
    expect(screen.getByText('Expected value')).toBeInTheDocument()
    expect(screen.getByText('Your value')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })
})

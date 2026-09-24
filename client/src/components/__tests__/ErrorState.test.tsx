import { render, screen } from '@testing-library/react'
import ErrorState from '../ErrorState'

describe('ErrorState', () => {
  it('renders a plain language error message', () => {
    render(<ErrorState message="We couldn't load this module." />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      "We couldn't load this module.",
    )
  })

  it('uses the shared error alert styling', () => {
    render(<ErrorState message="We couldn't load this lesson." />)

    expect(screen.getByRole('alert')).toHaveClass('alert', 'alert-error')
  })
})

import { render, screen } from '@testing-library/react'
import LoadingIndicator from '../LoadingIndicator'

describe('LoadingIndicator', () => {
  it('renders default loading message when thing is not provided', () => {
    render(<LoadingIndicator />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Loading...')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })

  it('renders loading message for modules', () => {
    render(<LoadingIndicator thing="modules" />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Loading modules...')
  })

  it('renders decorative loading spinner hidden from screen readers', () => {
    const { container } = render(<LoadingIndicator />)

    const spinner = container.querySelector('.loading-spinner')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('loading', 'loading-spinner', 'loading-md')
    expect(spinner).toHaveAttribute('aria-hidden', 'true')
  })
})

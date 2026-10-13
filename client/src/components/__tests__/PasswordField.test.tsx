import { fireEvent, render, screen } from '@testing-library/react'
import PasswordField from '../PasswordField'

describe('PasswordField', () => {
  it('renders a password input by default', () => {
    render(<PasswordField label="Password" />)

    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password',
    )
  })
  it('toggles password visibility', () => {
    render(<PasswordField label="Password" />)

    const input = screen.getByLabelText('Password')

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(input).toHaveAttribute('type', 'text')

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(input).toHaveAttribute('type', 'password')
  })
  it('supports InputField props', () => {
    render(
      <PasswordField
        label="Password"
        value="secret123"
        disabled
        readOnly
        validationError="Password is too weak."
      />,
    )

    const input = screen.getByLabelText('Password')

    expect(input).toHaveValue('secret123')
    expect(input).toBeDisabled()
    expect(screen.getByText('Password is too weak.')).toBeInTheDocument()
  })
})

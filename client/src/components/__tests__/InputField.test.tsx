import { fireEvent, render, screen } from '@testing-library/react'
import InputField from '../InputField'

describe('InputField', () => {
  it('renders the label and input', () => {
    render(<InputField label="Email" />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
  it('supports native input props', () => {
    render(
      <InputField
        label="Email"
        value="eduardo@example.com"
        disabled
        readOnly
      />,
    )
    const input = screen.getByLabelText('Email')
    expect(input).toHaveValue('eduardo@example.com')
    expect(input).toBeDisabled()
  })

  it('calls onChange when the value changes', () => {
    const handleChange = vi.fn()

    render(<InputField label="Name" onChange={handleChange} />)

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Eduardo' },
    })
    expect(handleChange).toHaveBeenCalled()
  })
  it('shows a required error below the input', () => {
    render(
      <InputField label="Email" required requiredError="Email is required." />,
    )
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
  })
  it('shows a validation error below the input', () => {
    render(
      <InputField
        label="Password"
        type="password"
        validationError="Password must contain at least 8 characters."
      />,
    )
    expect(
      screen.getByText('Password must contain at least 8 characters.'),
    ).toBeInTheDocument()
  })
  it('shows only the required error when both errors are provided', () => {
    render(
      <InputField
        label="Email"
        requiredError="Email is required."
        validationError="Email is invalid."
      />,
    )

    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.queryByText('Email is invalid.')).not.toBeInTheDocument()
  })
  it('render an input suffix', () => {
    render(
      <InputField
        label="Search"
        inputSuffix={<button type="button">clear</button>}
      />,
    )
    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument()
  })
})

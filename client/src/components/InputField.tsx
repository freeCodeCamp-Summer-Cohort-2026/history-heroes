import { useId } from 'react'
import type { ComponentProps } from 'react'

type InputFieldProps = ComponentProps<'input'> & {
  label: string
  requiredError?: string
  validationError?: string
}

export default function InputField({
  label,
  id,
  className = '',
  requiredError,
  validationError,
  ...inputProps
}: InputFieldProps) {
  const generateId = useId()
  const inputId = id ?? generateId
  const errorMessage = requiredError ?? validationError

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        <label htmlFor={inputId}>{label}</label>
      </legend>
      <input id={inputId} className={`input ${className}`} {...inputProps} />
      {errorMessage && <p className="text-error text-sm">{errorMessage}</p>}
    </fieldset>
  )
}

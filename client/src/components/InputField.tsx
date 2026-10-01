import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'

type InputFieldProps = ComponentProps<'input'> & {
  label: string
  requiredError?: string
  validationError?: string
  inputSuffix?: ReactNode
}

export default function InputField({
  label,
  id,
  className = '',
  requiredError,
  validationError,
  inputSuffix,
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
      <div className="relative w-fit">
        <input
          id={inputId}
          className={`input ${inputSuffix ? 'pr-10' : ''} ${className}`}
          {...inputProps}
        />

        {inputSuffix && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {inputSuffix}
          </div>
        )}
      </div>
      {errorMessage && <p className="text-error text-sm">{errorMessage}</p>}
    </fieldset>
  )
}

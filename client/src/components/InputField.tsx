import { useId, useState } from 'react'
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
  type,
  ...inputProps
}: InputFieldProps) {
  const generateId = useId()
  const inputId = id ?? generateId
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">
        <label htmlFor={inputId}>{label}</label>
      </legend>
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type={inputType}
          className={`input ${className}`}
          {...inputProps}
        />

        {isPassword && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="size-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3l18 18M10.6 10.6A2 2 0 0013.4 13.4M9.9 4.2A10.9 10.9 0 0112 4c5 0 9 4 10 8a12.5 12.5 0 01-2.1 4.1M6.2 6.2A12.2 12.2 0 002 12c1 4 5 8 10 8a10.7 10.7 0 005.8-1.7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="size-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                />
                <circle cx="12" cy="12" r="3" strokeWidth="2" />
              </svg>
            )}
          </button>
        )}
      </div>
      {requiredError && <p className="text-error text-sm">{requiredError}</p>}
      {validationError && (
        <p className="text-error text-sm">{validationError}</p>
      )}
    </fieldset>
  )
}

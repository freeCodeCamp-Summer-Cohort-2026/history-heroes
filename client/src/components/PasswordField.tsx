import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { ComponentProps } from 'react'
import InputField from './InputField'

type PasswordFieldProps = Omit<ComponentProps<typeof InputField>, 'type'>

export default function PasswordField(props: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <InputField
      {...props}
      type={showPassword ? 'text' : 'password'}
      inputSuffix={
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((current) => !current)}
        >
          {showPassword ? (
            <EyeOff className="size-5" aria-hidden="true" />
          ) : (
            <Eye className="size-5" aria-hidden="true" />
          )}
        </button>
      }
    />
  )
}

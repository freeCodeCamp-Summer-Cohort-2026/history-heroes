import { Navigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import Button from '../components/Button'
import ButtonLink from '../components/ButtonLink'
import Card from '../components/Card'
import InputField from '../components/InputField'
import PasswordField from '../components/PasswordField'
import { useAuth } from '../state/auth/use-auth'
import { EMAIL_REGEX } from '../utils/regex'

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  isContentAuthor: boolean
}

export default function RegisterPage() {
  const { user, handleRegister, registerError, registerLoading } = useAuth()
  const isAuthenticated = Boolean(user)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      isContentAuthor: false,
    },
  })

  const password = useWatch({
    control,
    name: 'password',
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await handleRegister({
        email: data.email,
        password: data.password,
        isContentAuthor: data.isContentAuthor,
      })
    } catch {
      // registerError is handled in auth context state
    }
  }

  if (isAuthenticated) {
    // if the user is already logged in, redirect them to the home page
    return <Navigate to="/" replace />
  }

  const errorMessage =
    registerError instanceof Error
      ? registerError.message
      : typeof registerError === 'string'
        ? registerError
        : registerError
          ? 'Registration failed'
          : null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <Card>
        <form
          className="flex flex-col items-center justify-center gap-4 w-full sm:w-80"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {errorMessage && (
            <div role="alert" className="alert alert-error text-sm w-full">
              <span>{errorMessage}</span>
            </div>
          )}

          <InputField
            id="email"
            label="Email"
            type="email"
            className={errors.email ? 'input-error' : ''}
            requiredError={
              errors.email?.type === 'required'
                ? errors.email.message
                : undefined
            }
            validationError={
              errors.email && errors.email.type !== 'required'
                ? errors.email.message
                : undefined
            }
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Invalid email address',
              },
            })}
          />

          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            className={errors.password ? 'input-error' : ''}
            requiredError={
              errors.password?.type === 'required'
                ? errors.password.message
                : undefined
            }
            validationError={
              errors.password && errors.password.type !== 'required'
                ? errors.password.message
                : undefined
            }
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            autoComplete="new-password"
            className={errors.confirmPassword ? 'input-error' : ''}
            requiredError={
              errors.confirmPassword?.type === 'required'
                ? errors.confirmPassword.message
                : undefined
            }
            validationError={
              errors.confirmPassword &&
              errors.confirmPassword.type !== 'required'
                ? errors.confirmPassword.message
                : undefined
            }
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />

          <div className="flex flex-row items-center gap-2">
            <input
              id="isContentAuthor"
              type="checkbox"
              className="checkbox"
              {...register('isContentAuthor')}
            />
            <label htmlFor="isContentAuthor" className="cursor-pointer">
              Content Author
            </label>
          </div>

          <div className="flex flex-row items-center justify-center gap-4">
            <ButtonLink to="/login" variant="secondary">
              Login
            </ButtonLink>
            <Button type="submit" disabled={isSubmitting || registerLoading}>
              Register
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

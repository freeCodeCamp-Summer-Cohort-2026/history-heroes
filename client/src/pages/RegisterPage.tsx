import { Navigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import Button from '../components/Button'
import ButtonLink from '../components/ButtonLink'
import Card from '../components/Card'
import { useAuth } from '../state/auth/use-auth'
import { EMAIL_REGEX } from '../utils/regex'

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  isContentAuthor: boolean
}

export default function RegisterPage() {
  const { user, handleRegister } = useAuth()
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

  const onSubmit = (data: RegisterFormData) => {
    handleRegister({
      email: data.email,
      password: data.password,
      isContentAuthor: data.isContentAuthor,
    })
  }

  if (isAuthenticated) {
    // if the user is already logged in, redirect them to the home page
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <Card>
        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <span className="text-error text-xs">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            {errors.password && (
              <span className="text-error text-xs">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <span className="text-error text-xs">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

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
            <Button type="submit" disabled={isSubmitting}>
              Register
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

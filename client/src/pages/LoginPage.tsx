import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import ButtonLink from '../components/ButtonLink'
import Card from '../components/Card'
import { useAuth } from '../state/auth/use-auth'
import { EMAIL_REGEX } from '../utils/regex'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const { user, handleLogin } = useAuth()
  const isAuthenticated = Boolean(user)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    handleLogin?.({
      email: data.email,
      password: data.password,
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
              autoComplete="current-password"
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

          <div className="flex flex-row items-center justify-center gap-4">
            <ButtonLink to="/register" variant="secondary">
              Register
            </ButtonLink>
            <Button type="submit" disabled={isSubmitting}>
              Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

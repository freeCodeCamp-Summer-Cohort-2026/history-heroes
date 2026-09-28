import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import ButtonLink from '../components/ButtonLink'
import Card from '../components/Card'
import { EMAIL_REGEX } from '../utils/regex'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const isAuthenticated = false // TODO: replace with hook logic

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
    console.log(data)
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

import { Navigate } from 'react-router-dom'
import Button from '../components/Button'
import ButtonLink from '../components/ButtonLink'
import Card from '../components/Card'

export default function RegisterPage() {
  const isAuthenticated = false // TODO: replace with hook logic

  const handleOnSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')
    const isContentAuthor = formData.get('isContentAuthor') === 'on'
    console.log({ email, password, confirmPassword, isContentAuthor })
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
          onSubmit={handleOnSubmit}
        >
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className="input input-bordered"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            className="input input-bordered"
            required
          />

          <label htmlFor="password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            minLength={8}
            className="input input-bordered"
            required
          />

          <div className="flex flex-row items-center gap-2">
            <input
              id="isContentAuthor"
              type="checkbox"
              name="isContentAuthor"
              className="checkbox"
            />
            <label htmlFor="isContentAuthor" className="cursor-pointer">
              Content Author
            </label>
          </div>

          <div className="flex flex-row items-center justify-center gap-4">
            <ButtonLink to="/login" variant="secondary">
              Login
            </ButtonLink>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

import { Navigate } from 'react-router-dom'
import Button from '../components/Button'
import ButtonLink from '../components/ButtonLink'
import Card from '../components/Card'

export default function LoginPage() {
  const isAuthenticated = false // TODO: replace with hook logic

  const handleOnSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const email = formData.get('email')
    const password = formData.get('password')
    console.log({ email, password })
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
            className="input input-bordered"
            required
          />

          <div className="flex flex-row items-center justify-center gap-4">
            <ButtonLink to="/register" variant="secondary">
              Register
            </ButtonLink>
            <Button type="submit">Login</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

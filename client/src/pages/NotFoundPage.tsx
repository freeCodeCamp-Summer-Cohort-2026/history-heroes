import ButtonLink from '../components/ButtonLink'

export default function NotFoundPage() {
  return (
    <div>
      <h1 className="text-display">404</h1>
      <p className="text-body">This page doesn't exist</p>
      <ButtonLink to={'/'}>Home Page</ButtonLink>
    </div>
  )
}

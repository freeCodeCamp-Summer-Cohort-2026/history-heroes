import ButtonLink from '../components/ButtonLink'

import { useDocumentTitle } from '../utils/useDocumentTitle'

export default function NotFoundPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-display">Page not found</h1>
      <p className="text-body">This page doesn't exist</p>
      <ButtonLink to={'/'}>Home Page</ButtonLink>
    </div>
  )
  useDocumentTitle('Page not found')
  return <h1 className="text-display">Page not found.</h1>
}

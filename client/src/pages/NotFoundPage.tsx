import { useDocumentTitle } from '../utils/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return <h1 className="text-display">Page not found.</h1>
}

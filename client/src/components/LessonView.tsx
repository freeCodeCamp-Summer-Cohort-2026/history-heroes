import { useParams, Link } from 'react-router-dom'
import tutorials from '../data/modules.json'

export default function LessonView() {
  const { id } = useParams()
  const current = tutorials.find((t) => t.id === Number(id))

  // Guard: als current niet bestaat → toon foutmelding
  if (!current) {
    return <p>Tutorial not found.</p>
  }

  const next = tutorials.find((t) => t.order === current.order + 1)
  const prev = tutorials.find((t) => t.order === current.order - 1)

  return (
    <div>
      <h2>{current.title}</h2>

      <p>Lesson content placeholder...</p>

      <div style={{ marginTop: '2rem' }}>
        {prev && <Link to={`/lesson/${prev.id}`}>Previous</Link>}{' '}
        {next && <Link to={`/lesson/${next.id}`}>Next</Link>}
      </div>
    </div>
  )
}

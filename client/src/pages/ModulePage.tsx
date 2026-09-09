import { useParams, Link } from 'react-router-dom'

export default function ModulePage() {
  const { moduleId } = useParams()

  return (
    <div>
      <h1>Module: {moduleId}</h1>
      {/* temporary: replace with the real lesson list once #52 lands */}
      <ul>
        <li>
          <Link
            to={`/modules/${moduleId}/lessons/great-pyramid`}
            className="link link-primary"
          >
            The Great Pyramid of Giza
          </Link>
        </li>
      </ul>
    </div>
  )
}

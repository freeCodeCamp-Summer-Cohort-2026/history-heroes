import { Link } from 'react-router-dom'
import tutorials from '../data/modules.json'

export default function TutorialList() {
  return (
    <div>
      <h1>Tutorials</h1>
      <ul>
        {tutorials.map((t) => (
          <li key={t.id}>
            <Link to={`/lesson/${t.id}`}>{t.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

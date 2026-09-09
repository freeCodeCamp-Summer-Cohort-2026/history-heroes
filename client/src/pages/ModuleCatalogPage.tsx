import { Link } from 'react-router-dom'

export default function ModuleCatalogPage() {
  return (
    <div>
      <h1>Modules</h1>
      {/* temporary: replace with the real module list once #49 lands */}
      <ul>
        <li>
          <Link to="/modules/seven-wonders" className="link link-primary">
            The Seven Wonders of the Ancient World
          </Link>
        </li>
      </ul>
    </div>
  )
}

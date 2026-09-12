import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="page-shell bg-base-100">
      <header className="navbar border-b border-base-300 bg-base-100">
        <div className="flex-1">
          <Link to="/" className="text-heading font-bold">
            History Heroes
          </Link>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Modules</Link>
            </li>
          </ul>
        </div>
      </header>

      <main className="page-content py-6">
        <Outlet />
      </main>
    </div>
  )
}

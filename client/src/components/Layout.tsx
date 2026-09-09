import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-base-100">
      <header className="navbar bg-base-200">
        <div className="flex-1">
          <h1 className="px-4 text-xl font-bold">History Heroes</h1>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Modules</Link>
            </li>
            {/* temporary: remove once #49 provides catalog navigation */}
            <li>
              <Link to="/modules/seven-wonders">
                The Seven Wonders of the Ancient World
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

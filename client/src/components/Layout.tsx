import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-base-100">
      <header className="navbar bg-base-200">
        <div className="flex-1">
          <Link to="/" className="px-4 text-xl font-bold">
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
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

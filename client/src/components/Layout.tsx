import { Outlet, Link, ScrollRestoration } from 'react-router-dom'
import { useAuth } from '../state/auth/use-auth'

export default function Layout() {
  const { showLogin } = useAuth()
  return (
    <div className="page-shell bg-base-100 min-h-screen flex flex-col">
      <ScrollRestoration />
      <header className="navbar border-b border-base-300 bg-base-100 flex-wrap sm:flex-nowrap">
        <div className="flex-1">
          <Link to="/" className="text-heading font-bold">
            History Heroes
          </Link>
        </div>

        <div className="flex-none mt-2 sm:mt-0">
          <ul className="menu menu-horizontal px-1 flex-wrap sm:flex-nowrap gap-2">
            {showLogin ? (
              <li>
                <Link to="/login" className="text-sm sm:text-base">
                  Login
                </Link>
              </li>
            ) : null}

            <li>
              <Link to="/" className="text-sm sm:text-base">
                Modules
              </Link>
            </li>
          </ul>
        </div>
      </header>

      <main className="page-content flex-1 px-4 py-6 sm:px-8 sm:py-10 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}

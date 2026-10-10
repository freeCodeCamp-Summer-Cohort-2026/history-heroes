import { screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { renderWithAuth } from '../../test/utils'
import ContentAuthorGuard from '../ContentAuthorGuard'

describe('ContentAuthorGuard', () => {
  const routes = [
    {
      path: '/modules/:moduleId/edit',
      element: (
        <ContentAuthorGuard>
          <div>Protected Content</div>
        </ContentAuthorGuard>
      ),
    },
    {
      path: '/modules/:moduleId',
      element: <div>Module Page</div>,
    },
    {
      path: '/',
      element: <div>Home Page</div>,
    },
  ]

  it('renders loading indicator when auth is loading', () => {
    renderWithAuth(
      <RouterProvider
        router={createMemoryRouter(routes, {
          initialEntries: ['/modules/seven-wonders/edit'],
        })}
      />,
      {
        authValue: {
          loading: true,
          user: null,
        },
      },
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to the module page when user is not authenticated', async () => {
    renderWithAuth(
      <RouterProvider
        router={createMemoryRouter(routes, {
          initialEntries: ['/modules/seven-wonders/edit'],
        })}
      />,
      {
        authValue: {
          loading: false,
          user: null,
        },
      },
    )

    expect(await screen.findByText('Module Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('redirects to the module page when user is authenticated but not a content author', async () => {
    renderWithAuth(
      <RouterProvider
        router={createMemoryRouter(routes, {
          initialEntries: ['/modules/seven-wonders/edit'],
        })}
      />,
      {
        authValue: {
          loading: false,
          user: {
            id: 2,
            email: 'learner@historyheroes.org',
            isContentAuthor: false,
          },
        },
      },
    )

    expect(await screen.findByText('Module Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('renders protected children when user is a content author', async () => {
    renderWithAuth(
      <RouterProvider
        router={createMemoryRouter(routes, {
          initialEntries: ['/modules/seven-wonders/edit'],
        })}
      />,
      {
        authValue: {
          loading: false,
          user: {
            id: 1,
            email: 'author@historyheroes.org',
            isContentAuthor: true,
          },
        },
      },
    )

    expect(await screen.findByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to root when no moduleId is in params and user is not a content author', async () => {
    const rootRoutes = [
      {
        path: '/editor',
        element: (
          <ContentAuthorGuard>
            <div>General Editor</div>
          </ContentAuthorGuard>
        ),
      },
      {
        path: '/',
        element: <div>Home Page</div>,
      },
    ]

    renderWithAuth(
      <RouterProvider
        router={createMemoryRouter(rootRoutes, {
          initialEntries: ['/editor'],
        })}
      />,
      {
        authValue: {
          loading: false,
          user: null,
        },
      },
    )

    expect(await screen.findByText('Home Page')).toBeInTheDocument()
    expect(screen.queryByText('General Editor')).not.toBeInTheDocument()
  })
})

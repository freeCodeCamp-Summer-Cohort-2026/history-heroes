import { screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'
import { renderWithAuth } from '../../test/utils'

test(`tests uknown route reaching the page`, async () => {
  renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/random'] })}
    />,
  )
  expect(screen.getByRole('link', { name: 'Home Page' })).toBeInTheDocument()
})

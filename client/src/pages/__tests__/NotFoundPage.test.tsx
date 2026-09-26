import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'

test(`tests uknown route reaching the page`, async () => {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: ['/random'] })}
    />,
  )
  expect(screen.getByRole('link', { name: 'Home Page' })).toBeInTheDocument()
})

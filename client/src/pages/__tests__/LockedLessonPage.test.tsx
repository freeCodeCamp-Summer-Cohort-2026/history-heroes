import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import LockedLessonPage from '../LockedLessonPage'

const testRoutes = [
  {
    path: '/modules/:moduleId/lessons/:lessonId',
    element: <LockedLessonPage />,
  },
  { path: '/modules/:moduleId', element: <h1>Module page</h1> },
  { path: '/', element: <h1>Catalog page</h1> },
]

function renderLockedPage() {
  render(
    <RouterProvider
      router={createMemoryRouter(testRoutes, {
        initialEntries: ['/modules/first-module/lessons/second-lesson'],
      })}
    />,
  )
}

test('explains that the lesson is locked', () => {
  renderLockedPage()

  expect(
    screen.getByRole('heading', { level: 1, name: /this lesson is locked/i }),
  ).toBeInTheDocument()
})

test('goes back to the module page', async () => {
  renderLockedPage()

  fireEvent.click(screen.getByText('Back to the module', { selector: 'a' }))

  expect(
    await screen.findByRole('heading', { name: /module page/i }),
  ).toBeInTheDocument()
})

test('goes back to the catalog', async () => {
  renderLockedPage()

  fireEvent.click(screen.getByText('Back to all modules', { selector: 'a' }))

  expect(
    await screen.findByRole('heading', { name: /catalog page/i }),
  ).toBeInTheDocument()
})

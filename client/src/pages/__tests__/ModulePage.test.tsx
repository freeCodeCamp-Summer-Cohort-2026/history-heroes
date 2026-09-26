import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'
import type { ModuleSummary } from '../../features/module/model/ModuleSummary'
import type { Lesson } from '../../features/lesson/model/Lesson'
import type { LessonCompletion } from '../../features/progress/model/api'

const testModules: ModuleSummary[] = [
  {
    id: 'first-module',
    title: 'Test Module One',
    description: 'A test module.',
    period: 'Ancient World',
    theme: 'Architecture and Engineering',
  },
]

const testLessons: Lesson[] = [
  {
    id: 'second-lesson',
    moduleId: 'first-module',
    title: 'Test Lesson Two',
    description: 'The second test lesson.',
    orderIndex: 2,
    contents: 'Second lesson text.',
    activityIds: [],
  },
  {
    id: 'first-lesson',
    moduleId: 'first-module',
    title: 'Test Lesson One',
    description: 'The first test lesson.',
    orderIndex: 1,
    contents: 'First lesson text.',
    activityIds: [],
  },
]

function mockServer(lessons: Lesson[], completions: LessonCompletion[] = []) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) =>
      Promise.resolve({
        ok: true,
        json: async () => {
          if (url === '/api/v1/progress') return completions
          if (url.includes('/lessons')) return lessons
          return testModules
        },
      }),
    ),
  )
}

function renderModulePage() {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/modules/first-module'],
      })}
    />,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

test('shows the module title, description, period and theme', async () => {
  mockServer(testLessons)
  renderModulePage()

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Test Module One' }),
  ).toBeInTheDocument()
  expect(screen.getByText('A test module.')).toBeInTheDocument()
  expect(screen.getByText('Ancient World')).toBeInTheDocument()
  expect(screen.getByText('Architecture and Engineering')).toBeInTheDocument()
})

test('lists the lessons in order', async () => {
  mockServer(testLessons)
  renderModulePage()

  await screen.findByRole('heading', { level: 1, name: 'Test Module One' })
  const lessonTitles = screen.getAllByRole('heading', { level: 3 })

  expect(lessonTitles.map((heading) => heading.textContent)).toEqual([
    'Test Lesson One',
    'Test Lesson Two',
  ])
})

test('only makes the first lesson available to a new learner', async () => {
  mockServer(testLessons)
  renderModulePage()

  expect(
    await screen.findByRole('link', { name: /test lesson one/i }),
  ).toHaveTextContent('Available')
  expect(
    screen.getByRole('button', { name: /test lesson two/i }),
  ).toHaveTextContent('Locked')
})

test('keeps a completed lesson available and unlocks the next lesson', async () => {
  mockServer(testLessons, [
    {
      lessonId: 'first-lesson',
      completedAt: '2026-09-20T12:00:00.000Z',
    },
  ])
  renderModulePage()

  expect(
    await screen.findByRole('link', { name: /test lesson one/i }),
  ).toHaveTextContent('Completed')
  expect(
    screen.getByRole('link', { name: /test lesson two/i }),
  ).toHaveTextContent('Available')
  expect(screen.getByText('Lessons completed 1/2')).toBeInTheDocument()
})

test('shows an empty state when the module has no lessons', async () => {
  mockServer([])
  renderModulePage()

  expect(
    await screen.findByText('This module has no lessons yet.'),
  ).toBeInTheDocument()
})

test('offers the module lab after the lessons', async () => {
  mockServer(testLessons)
  renderModulePage()

  const labLink = await screen.findByRole('link', { name: /module lab/i })
  const lastLesson = screen.getByRole('heading', {
    level: 3,
    name: 'Test Lesson Two',
  })

  expect(labLink).toHaveAttribute('href', '/modules/first-module/lab')
  expect(
    lastLesson.compareDocumentPosition(labLink) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy()
})

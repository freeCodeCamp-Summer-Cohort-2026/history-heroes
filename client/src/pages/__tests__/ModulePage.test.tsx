import { screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'
import { renderWithAuth } from '../../test/utils'
import type { ModuleSummary } from '../../features/module/model/ModuleSummary'
import type { Lesson } from '../../features/lesson/model/Lesson'
import type {
  LabCompletion,
  LessonCompletion,
} from '../../features/progress/model/api'
import type { Lab } from '../../features/lab/model/Lab'

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

const testLab: Lab = {
  id: 'first-lab',
  moduleId: 'first-module',
  title: 'Test Module Lab',
  description: 'Module lab description',
  activities: [],
}

function mockServer(
  lessons: Lesson[],
  completions: LessonCompletion[] = [],
  lab: Lab | null = null,
  labCompletion: LabCompletion | null = null,
) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      if (url === '/api/v1/progress') {
        return Promise.resolve({
          ok: true,
          json: async () => completions,
        })
      }
      if (url.includes('/api/v1/progress/labs/')) {
        if (!labCompletion) {
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ message: 'Not found' }),
          })
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => labCompletion,
        })
      }
      if (url.includes('/api/v1/labs/')) {
        if (!lab) {
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ message: 'Not found' }),
          })
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => lab,
        })
      }
      if (url.includes('/lessons')) {
        return Promise.resolve({
          ok: true,
          json: async () => lessons,
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => testModules,
      })
    }),
  )
}

function renderModulePage() {
  renderWithAuth(
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

test('shows a friendly error message when the module fails to load', async () => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockRejectedValue(
        new Error('Request failed with status 500: database connection failed'),
      ),
  )

  renderModulePage()

  const alert = await screen.findByRole('alert')

  expect(alert).toHaveTextContent("We couldn't load this module right now.")
  expect(alert).not.toHaveTextContent(/status 500/i)
  expect(alert).not.toHaveTextContent(/database connection failed/i)
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

test('allows a learner with no progress to begin with the first applicable item', async () => {
  mockServer(testLessons, [])
  renderModulePage()

  const startLink = await screen.findByRole('link', { name: /start module/i })
  expect(startLink).toHaveAttribute(
    'href',
    '/modules/first-module/lessons/first-lesson',
  )
})

test('allows a learner with partial progress to continue with the next incomplete item', async () => {
  mockServer(testLessons, [
    {
      lessonId: 'first-lesson',
      completedAt: '2026-09-20T12:00:00.000Z',
    },
  ])
  renderModulePage()

  const resumeLink = await screen.findByRole('link', {
    name: /resume module/i,
  })
  expect(resumeLink).toHaveAttribute(
    'href',
    '/modules/first-module/lessons/second-lesson',
  )
})

test('allows a learner who completed all lessons to continue to the module lab', async () => {
  mockServer(
    testLessons,
    [
      {
        lessonId: 'first-lesson',
        completedAt: '2026-09-20T12:00:00.000Z',
      },
      {
        lessonId: 'second-lesson',
        completedAt: '2026-09-21T12:00:00.000Z',
      },
    ],
    testLab,
    null,
  )
  renderModulePage()

  const resumeLink = await screen.findByRole('link', {
    name: /resume module/i,
  })
  expect(resumeLink).toHaveAttribute('href', '/modules/first-module/lab')
})

test('shows completed state and does not incorrectly send learner back to earlier items when all items are complete', async () => {
  mockServer(
    testLessons,
    [
      {
        lessonId: 'first-lesson',
        completedAt: '2026-09-20T12:00:00.000Z',
      },
      {
        lessonId: 'second-lesson',
        completedAt: '2026-09-21T12:00:00.000Z',
      },
    ],
    testLab,
    {
      labId: 'first-lab',
      completedAt: '2026-09-22T12:00:00.000Z',
    },
  )
  renderModulePage()

  expect(
    await screen.findByRole('status', { name: /module completion status/i }),
  ).toHaveTextContent('Module completed!')
  expect(
    screen.getByText(/you have completed all lessons and the lab/i),
  ).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /start module/i })).toBeNull()
  expect(screen.queryByRole('link', { name: /resume module/i })).toBeNull()

  const labLink = screen.getByRole('link', { name: /module lab/i })
  expect(labLink).toHaveTextContent('Completed')
})

test('restores completed lab status upon page load / refresh', async () => {
  mockServer(testLessons, [], testLab, {
    labId: 'first-lab',
    completedAt: '2026-09-22T12:00:00.000Z',
  })
  renderModulePage()

  const labLink = await screen.findByRole('link', { name: /module lab/i })
  expect(labLink).toHaveTextContent('Completed')
})

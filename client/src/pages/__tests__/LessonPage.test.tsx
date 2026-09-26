import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../App'
import type { Activity } from '../../features/activities/types'
import type { Lesson } from '../../features/lesson/model/Lesson'
import type { ModuleSummary } from '../../features/module/model/ModuleSummary'
import type { LessonCompletion } from '../../features/progress/model/api'

const testModules: ModuleSummary[] = [
  {
    id: 'first-module',
    title: 'Test Module One',
    description: 'A test module.',
  },
]

const testLessons: Lesson[] = [
  {
    id: 'first-lesson',
    moduleId: 'first-module',
    title: 'Test Lesson One',
    description: 'A test lesson',
    orderIndex: 1,
    contents: 'The first paragraph.\n\nThe second paragraph.',
    activityIds: ['first-activity', 'second-activity'],
  },
  {
    id: 'second-lesson',
    moduleId: 'first-module',
    title: 'Test Lesson Two',
    description: 'Another test lesson',
    orderIndex: 2,
    contents: 'The last paragraph.',
    activityIds: ['first-activity'],
  },
]

const testActivities: Activity[] = [
  {
    id: 'first-activity',
    type: 'ordering',
    title: 'Test Activity One',
    checkStatement: 'Put these in order.',
    content: {
      items: [
        { id: 'a', label: 'Item A' },
        { id: 'b', label: 'Item B' },
      ],
    },
    successCriteria: { correctOrder: ['a', 'b'] },
  },
  {
    id: 'second-activity',
    type: 'ordering',
    title: 'Test Activity Two',
    checkStatement: 'Put these in order too.',
    content: {
      items: [
        { id: 'c', label: 'Item C' },
        { id: 'd', label: 'Item D' },
      ],
    },
    successCriteria: { correctOrder: ['c', 'd'] },
  },
]

function mockServer(
  activities: Activity[],
  completions: LessonCompletion[] = [],
) {
  const savedCompletions = [...completions]
  const fetchMock = vi.fn().mockImplementation((url: string) =>
    Promise.resolve({
      ok: true,
      json: async () => {
        if (url === '/api/v1/progress') return savedCompletions
        if (url.includes('/progress/lessons/')) {
          const completedLessonId = url.split('/').pop() ?? ''
          const existingCompletion = savedCompletions.find(
            (completion) => completion.lessonId === completedLessonId,
          )
          if (existingCompletion) return existingCompletion

          const completion = {
            lessonId: completedLessonId,
            completedAt: '2026-09-20T12:00:00.000Z',
          }
          savedCompletions.push(completion)
          return completion
        }
        if (url.includes('/activities')) return activities
        if (url.includes('/lessons')) return testLessons
        return testModules
      },
    }),
  )

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function lessonCompletionRequests(
  fetchMock: ReturnType<typeof vi.fn>,
  lessonId = 'first-lesson',
) {
  return fetchMock.mock.calls.filter(
    (call) =>
      call[0] === `/api/v1/progress/lessons/${lessonId}` &&
      (call[1] as RequestInit | undefined)?.method === 'POST',
  )
}

function renderAt(path: string) {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: [path] })}
    />,
  )
}

beforeEach(() => {
  mockServer(testActivities)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test('displays the lesson title and content', async () => {
  renderAt('/modules/first-module/lessons/first-lesson')

  expect(await screen.findByText('Test Lesson One')).toBeInTheDocument()
  expect(screen.getByText('The first paragraph.')).toBeInTheDocument()
  expect(screen.getByText('The second paragraph.')).toBeInTheDocument()
})

test('displays the activities in order', async () => {
  renderAt('/modules/first-module/lessons/first-lesson')

  await screen.findByText('Test Lesson One')
  const activityTitles = screen.getAllByRole('heading', { level: 2 })

  expect(activityTitles.map((heading) => heading.textContent)).toEqual([
    'Test Activity One',
  ])
})

test('displays a message for an unknown lesson', async () => {
  renderAt('/modules/first-module/lessons/missing-lesson')

  expect(
    await screen.findByText('That lesson could not be found.'),
  ).toBeInTheDocument()
})

test('displays a loading message while the lesson loads', () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation(() => new Promise(() => {})),
  )
  renderAt('/modules/first-module/lessons/first-lesson')

  expect(screen.getByText('Loading lesson...')).toBeInTheDocument()
})

test('shows the lesson position in its module', async () => {
  renderAt('/modules/first-module/lessons/first-lesson')

  expect(await screen.findByText('Lesson 1 of 2')).toBeInTheDocument()
})

test('links back to its module', async () => {
  renderAt('/modules/first-module/lessons/first-lesson')

  expect(
    await screen.findByRole('link', { name: 'Back to Test Module One' }),
  ).toHaveAttribute('href', '/modules/first-module')
})

test('still shows the lesson text when the activities fail to load', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) =>
      Promise.resolve({
        ok: !url.includes('/activities'),
        status: 500,
        json: async () => {
          if (url === '/api/v1/progress') return []
          if (url.includes('/lessons')) return testLessons
          return testModules
        },
      }),
    ),
  )
  renderAt('/modules/first-module/lessons/first-lesson')

  expect(await screen.findByText('The first paragraph.')).toBeInTheDocument()
  expect(
    await screen.findByText(
      'The activities for this lesson could not be loaded.',
    ),
  ).toBeInTheDocument()
})

test('does not save completion just for viewing a lesson', async () => {
  const fetchMock = mockServer(testActivities)

  renderAt('/modules/first-module/lessons/first-lesson')

  await screen.findByText('Test Lesson One')
  expect(lessonCompletionRequests(fetchMock)).toHaveLength(0)
})

test('does not save completion when an answer changes without submission', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.99)
  const fetchMock = mockServer(testActivities)

  renderAt('/modules/first-module/lessons/first-lesson')

  const itemA = await screen.findByText('Item A')
  const itemB = screen.getByText('Item B')
  fireEvent.dragStart(itemA, {
    dataTransfer: { setData: vi.fn() },
  })
  fireEvent.drop(itemB, {
    dataTransfer: { getData: () => 'a' },
  })

  expect(lessonCompletionRequests(fetchMock)).toHaveLength(0)
})

test('saves completion and makes the next lesson available without a reload', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.99)
  const fetchMock = mockServer(testActivities)

  renderAt('/modules/first-module/lessons/first-lesson')

  await screen.findByText('Test Lesson One')
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  fireEvent.click(screen.getByRole('button', { name: /next activity/i }))
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(await screen.findByRole('status')).toHaveTextContent(
    'Lesson completion saved.',
  )
  const nextLessonLink = screen.getByRole('link', {
    name: /next lesson: test lesson two/i,
  })
  expect(nextLessonLink).toHaveAttribute(
    'href',
    '/modules/first-module/lessons/second-lesson',
  )
  expect(lessonCompletionRequests(fetchMock)).toHaveLength(1)

  fireEvent.click(nextLessonLink)

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Test Lesson Two' }),
  ).toBeInTheDocument()
})

test('restores progression after leaving and reopening a completed lesson', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.99)
  const fetchMock = mockServer(testActivities)

  renderAt('/modules/first-module/lessons/first-lesson')

  await screen.findByText('Test Lesson One')
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  fireEvent.click(screen.getByRole('button', { name: /next activity/i }))
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  await screen.findByRole('status')

  fireEvent.click(screen.getByRole('link', { name: 'Back to module' }))

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Test Module One' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: /test lesson one/i }),
  ).toHaveTextContent('Completed')
  expect(
    screen.getByRole('link', { name: /test lesson two/i }),
  ).toHaveTextContent('Available')
  expect(screen.getByText('Lessons completed 1/2')).toBeInTheDocument()
  expect(lessonCompletionRequests(fetchMock)).toHaveLength(1)

  fireEvent.click(screen.getByRole('link', { name: /test lesson one/i }))

  expect(await screen.findByRole('status')).toHaveTextContent(
    'Lesson completion saved.',
  )
  expect(
    screen.getByRole('link', { name: /next lesson: test lesson two/i }),
  ).toBeInTheDocument()
  expect(lessonCompletionRequests(fetchMock)).toHaveLength(1)
})

test('restores a completed lesson without changing its saved state', async () => {
  const fetchMock = mockServer(testActivities, [
    {
      lessonId: 'first-lesson',
      completedAt: '2026-09-20T12:00:00.000Z',
    },
  ])

  renderAt('/modules/first-module/lessons/first-lesson')

  expect(await screen.findByRole('status')).toHaveTextContent(
    'Lesson completion saved.',
  )
  expect(
    screen.getByRole('link', { name: /next lesson: test lesson two/i }),
  ).toBeInTheDocument()
  expect(lessonCompletionRequests(fetchMock)).toHaveLength(0)
})

test('redirects direct access to a locked lesson to the locked page', async () => {
  mockServer(testActivities)

  renderAt('/modules/first-module/lessons/second-lesson')

  expect(
    await screen.findByRole('heading', {
      level: 1,
      name: /this lesson is locked/i,
    }),
  ).toBeInTheDocument()
  expect(screen.queryByText('The last paragraph.')).not.toBeInTheDocument()
})

test('allows direct access when the preceding lesson is complete', async () => {
  mockServer(
    [testActivities[0]],
    [
      {
        lessonId: 'first-lesson',
        completedAt: '2026-09-20T12:00:00.000Z',
      },
    ],
  )

  renderAt('/modules/first-module/lessons/second-lesson')

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Test Lesson Two' }),
  ).toBeInTheDocument()
  expect(screen.getByText('The last paragraph.')).toBeInTheDocument()
  expect(
    screen.queryByRole('heading', { name: /this lesson is locked/i }),
  ).toBeNull()
})

test('does not render a next lesson after completing the final lesson', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.99)
  const fetchMock = mockServer(
    [testActivities[0]],
    [
      {
        lessonId: 'first-lesson',
        completedAt: '2026-09-20T12:00:00.000Z',
      },
    ],
  )

  renderAt('/modules/first-module/lessons/second-lesson')

  await screen.findByText('The last paragraph.')
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(await screen.findByRole('status')).toHaveTextContent(
    'Lesson completion saved.',
  )
  expect(lessonCompletionRequests(fetchMock, 'second-lesson')).toHaveLength(1)
  expect(screen.queryByRole('link', { name: /next lesson/i })).toBeNull()
  expect(screen.getByRole('link', { name: 'Back to module' })).toHaveAttribute(
    'href',
    '/modules/first-module',
  )
})

test('does not unlock the next lesson after only part of a lesson is correct', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.99)
  const fetchMock = mockServer(testActivities)

  renderAt('/modules/first-module/lessons/first-lesson')

  await screen.findByText('Test Lesson One')
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(await screen.findByText('Correct')).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /next lesson/i })).toBeNull()
  expect(lessonCompletionRequests(fetchMock)).toHaveLength(0)
})

test('does not save completion for an incorrect answer', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  const fetchMock = mockServer([testActivities[0]])

  renderAt('/modules/first-module/lessons/first-lesson')

  await screen.findByText('Test Lesson One')
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(await screen.findByText('Not yet')).toBeInTheDocument()
  expect(lessonCompletionRequests(fetchMock)).toHaveLength(0)
})

test('displays the page title with site-name', async () => {
  renderAt('/modules/first-module/lessons/first-lesson')

  expect(await screen.findByText('Test Lesson One')).toBeInTheDocument()
  expect(document.title).toBe('Test Lesson One - History Heroes')
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'
import type { Activity } from '../../features/activities/types'
import type { Lesson } from '../../features/lesson/model/Lesson'

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

function mockServer(activities: Activity[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) =>
      Promise.resolve({
        ok: true,
        json: async () =>
          url.includes('/activities') ? activities : testLessons,
      }),
    ),
  )
}

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  mockServer(testActivities)
})

afterEach(() => {
  vi.unstubAllGlobals()
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
    'Test Activity Two',
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

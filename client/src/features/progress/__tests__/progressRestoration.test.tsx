import { screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../../../App'
import { renderWithAuth } from '../../../test/utils'
import type { ModuleSummary } from '../../module/model/ModuleSummary'
import type { Lesson } from '../../lesson/model/Lesson'
import type { Lab } from '../../lab/model/Lab'
import type { LessonCompletion, LabCompletion } from '../model/api'

const testModules: ModuleSummary[] = [
  {
    id: 'module-1',
    title: 'Ancient Egypt',
    description: 'Explore the pyramids and ancient civilization.',
    period: 'Ancient World',
    theme: 'Architecture',
  },
]

const testLessons: Lesson[] = [
  {
    id: 'egypt-lesson-1',
    moduleId: 'module-1',
    title: 'The Great Pyramid',
    description: 'Learn how the pyramid was constructed.',
    orderIndex: 1,
    contents: 'Content for lesson 1.',
    activityIds: [],
  },
  {
    id: 'egypt-lesson-2',
    moduleId: 'module-1',
    title: 'Hieroglyphs',
    description: 'Understand ancient Egyptian writing.',
    orderIndex: 2,
    contents: 'Content for lesson 2.',
    activityIds: [],
  },
]

const testLab: Lab = {
  id: 'egypt-lab',
  moduleId: 'module-1',
  title: 'Pyramid Construction Lab',
  description: 'Assemble the ancient pyramid timeline.',
  activities: [],
}

type UserProgressStore = {
  lessons: LessonCompletion[]
  lab: LabCompletion | null
}

function setupMockServer(activeLearnerStore: () => UserProgressStore) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      const store = activeLearnerStore()

      if (url === '/api/v1/progress') {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => store.lessons,
        })
      }

      if (url.includes('/api/v1/progress/labs/')) {
        if (!store.lab) {
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ message: 'No lab progress' }),
          })
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => store.lab,
        })
      }

      if (url.includes('/api/v1/labs/')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => testLab,
        })
      }

      if (url.includes('/lessons')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => testLessons,
        })
      }

      if (url.includes('/modules')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => testModules,
        })
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({}),
      })
    }),
  )
}

function renderModuleView(userId = 1) {
  return renderWithAuth(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: ['/modules/module-1'],
      })}
    />,
    {
      authValue: {
        user: { id: userId, email: `learner${userId}@historyheroes.org` },
      },
    },
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('saved progress restoration and resume path (Issue #45)', () => {
  test('empty progress: active learner can begin with the first applicable item', async () => {
    setupMockServer(() => ({
      lessons: [],
      lab: null,
    }))

    renderModuleView(1)

    // The first lesson is available and the second is locked
    expect(
      await screen.findByRole('link', { name: /the great pyramid/i }),
    ).toHaveTextContent('Available')
    expect(
      screen.getByRole('button', { name: /hieroglyphs/i }),
    ).toHaveTextContent('Locked')

    // Start module link provides path to the first item
    const startLink = screen.getByRole('link', { name: /start module/i })
    expect(startLink).toHaveAttribute(
      'href',
      '/modules/module-1/lessons/egypt-lesson-1',
    )
  })

  test('partial progress: active learner can continue with the next incomplete item', async () => {
    setupMockServer(() => ({
      lessons: [
        {
          lessonId: 'egypt-lesson-1',
          completedAt: '2026-10-01T10:00:00.000Z',
        },
      ],
      lab: null,
    }))

    renderModuleView(1)

    // First lesson completed, second lesson unlocked and available
    expect(
      await screen.findByRole('link', { name: /the great pyramid/i }),
    ).toHaveTextContent('Completed')
    expect(
      screen.getByRole('link', { name: /hieroglyphs/i }),
    ).toHaveTextContent('Available')

    // Resume module provides path to the next incomplete lesson
    const resumeLink = screen.getByRole('link', { name: /resume module/i })
    expect(resumeLink).toHaveAttribute(
      'href',
      '/modules/module-1/lessons/egypt-lesson-2',
    )
  })

  test('all lessons complete: active learner continues to the module lab', async () => {
    setupMockServer(() => ({
      lessons: [
        {
          lessonId: 'egypt-lesson-1',
          completedAt: '2026-10-01T10:00:00.000Z',
        },
        {
          lessonId: 'egypt-lesson-2',
          completedAt: '2026-10-01T11:00:00.000Z',
        },
      ],
      lab: null,
    }))

    renderModuleView(1)

    // Resume module provides path to the module lab
    const resumeLink = await screen.findByRole('link', {
      name: /resume module/i,
    })
    expect(resumeLink).toHaveAttribute('href', '/modules/module-1/lab')
  })

  test('completed progress: learner receives completed state and is not sent back to earlier item', async () => {
    setupMockServer(() => ({
      lessons: [
        {
          lessonId: 'egypt-lesson-1',
          completedAt: '2026-10-01T10:00:00.000Z',
        },
        {
          lessonId: 'egypt-lesson-2',
          completedAt: '2026-10-01T11:00:00.000Z',
        },
      ],
      lab: {
        labId: 'egypt-lab',
        completedAt: '2026-10-01T12:00:00.000Z',
      },
    }))

    renderModuleView(1)

    expect(
      await screen.findByRole('status', { name: /module completion status/i }),
    ).toHaveTextContent('Module completed!')
    expect(
      screen.getByText(
        /you have completed all lessons and the lab in this module/i,
      ),
    ).toBeInTheDocument()

    // No resume or start link incorrectly directing to earlier content
    expect(screen.queryByRole('link', { name: /start module/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /resume module/i })).toBeNull()

    // Both lessons and lab are marked completed
    expect(
      screen.getByRole('link', { name: /the great pyramid/i }),
    ).toHaveTextContent('Completed')
    expect(
      screen.getByRole('link', { name: /hieroglyphs/i }),
    ).toHaveTextContent('Completed')
    expect(screen.getByRole('link', { name: /module lab/i })).toHaveTextContent(
      'Completed',
    )
  })

  test('refresh restoration: recognized after leaving and reloading', async () => {
    const currentStore: UserProgressStore = {
      lessons: [
        {
          lessonId: 'egypt-lesson-1',
          completedAt: '2026-10-01T10:00:00.000Z',
        },
      ],
      lab: {
        labId: 'egypt-lab',
        completedAt: '2026-10-01T12:00:00.000Z',
      },
    }

    setupMockServer(() => currentStore)

    // Initial render (Session 1)
    const firstRender = renderModuleView(1)
    expect(
      await screen.findByRole('link', { name: /the great pyramid/i }),
    ).toHaveTextContent('Completed')
    expect(screen.getByRole('link', { name: /module lab/i })).toHaveTextContent(
      'Completed',
    )

    firstRender.unmount()

    // Simulate page refresh / new mount in a later session
    renderModuleView(1)

    expect(
      await screen.findByRole('link', { name: /the great pyramid/i }),
    ).toHaveTextContent('Completed')
    expect(screen.getByRole('link', { name: /module lab/i })).toHaveTextContent(
      'Completed',
    )
  })

  test('learner isolation: learner B never sees learner A completion state', async () => {
    const learnerAStore: UserProgressStore = {
      lessons: [
        {
          lessonId: 'egypt-lesson-1',
          completedAt: '2026-10-01T10:00:00.000Z',
        },
        {
          lessonId: 'egypt-lesson-2',
          completedAt: '2026-10-01T11:00:00.000Z',
        },
      ],
      lab: {
        labId: 'egypt-lab',
        completedAt: '2026-10-01T12:00:00.000Z',
      },
    }

    const learnerBStore: UserProgressStore = {
      lessons: [],
      lab: null,
    }

    let activeUserId = 1
    setupMockServer(() => (activeUserId === 1 ? learnerAStore : learnerBStore))

    // Learner A views module
    const renderA = renderModuleView(1)
    expect(
      await screen.findByRole('status', { name: /module completion status/i }),
    ).toHaveTextContent('Module completed!')
    renderA.unmount()

    // Learner B (different session/user) views module
    activeUserId = 2
    const renderB = renderModuleView(2)

    // Learner B sees uncompleted state and can start from beginning
    expect(
      await screen.findByRole('link', { name: /start module/i }),
    ).toHaveAttribute('href', '/modules/module-1/lessons/egypt-lesson-1')
    expect(
      screen.queryByRole('status', { name: /module completion status/i }),
    ).toBeNull()
    expect(
      screen.getByRole('button', { name: /hieroglyphs/i }),
    ).toHaveTextContent('Locked')
    expect(screen.getByRole('link', { name: /module lab/i })).toHaveTextContent(
      'Always open',
    )
    renderB.unmount()

    // When Learner A returns in a new session, Learner A still has their completion
    activeUserId = 1
    renderModuleView(1)
    expect(
      await screen.findByRole('status', { name: /module completion status/i }),
    ).toHaveTextContent('Module completed!')
  })
})

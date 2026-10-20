import { screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LessonListItem from '../LessonListItem'
import { renderWithAuth } from '../../test/utils'
import type { Lesson } from '../../features/lesson/model/Lesson'

const mockLockedLesson: Lesson = {
  id: 'lesson-1',
  moduleId: 'module-1',
  title: 'Locked lesson',
  description: 'A locked lesson description',
  orderIndex: 1,
  contents: '',
  activityIds: [],
}

const mockUnlockedLesson: Lesson = {
  id: 'lesson-2',
  moduleId: 'module-1',
  title: 'Open lesson',
  description: 'An open lesson description',
  orderIndex: 2,
  contents: '',
  activityIds: [],
}

test('shows the locked notice instead of opening a locked lesson', () => {
  renderWithAuth(
    <MemoryRouter>
      <LessonListItem lesson={mockLockedLesson} state="locked" />
    </MemoryRouter>,
  )

  const lessonButton = screen.getByRole('button', { name: /locked lesson/i })
  expect(lessonButton).toHaveAttribute('aria-disabled', 'true')
  expect(
    screen.queryByRole('link', { name: /locked lesson/i }),
  ).not.toBeInTheDocument()

  fireEvent.click(lessonButton)

  expect(screen.getByRole('status')).toHaveTextContent(
    /locked until you finish the lessons before it/i,
  )
})

test('renders a link for an unlocked lesson without a notice', () => {
  renderWithAuth(
    <MemoryRouter>
      <LessonListItem lesson={mockUnlockedLesson} state="unlocked" />
    </MemoryRouter>,
  )

  const link = screen.getByRole('link', { name: /open lesson/i })
  expect(link).toHaveAttribute(
    'href',
    `/modules/${mockUnlockedLesson.moduleId}/lessons/${mockUnlockedLesson.id}`,
  )
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
})

test('shows the edit link for a content author', () => {
  renderWithAuth(
    <MemoryRouter>
      <LessonListItem lesson={mockUnlockedLesson} state="unlocked" />
    </MemoryRouter>,
    {
      authValue: {
        user: {
          id: 1,
          email: 'author@historyheroes.org',
          isContentAuthor: true,
        },
      },
    },
  )
  expect(screen.getByRole('link', { name: /edit lesson/i })).toHaveAttribute(
    'href',
    `/modules/${mockUnlockedLesson.moduleId}/lessons/${mockUnlockedLesson.id}/edit`,
  )
})

test('does not show the edit link for a non-content author', () => {
  renderWithAuth(
    <MemoryRouter>
      <LessonListItem lesson={mockUnlockedLesson} state="unlocked" />
    </MemoryRouter>,
    {
      authValue: {
        user: {
          id: 2,
          email: 'learner@historyheroes.org',
          isContentAuthor: false,
        },
      },
    },
  )

  expect(
    screen.queryByRole('link', { name: /edit lesson/i }),
  ).not.toBeInTheDocument()
})

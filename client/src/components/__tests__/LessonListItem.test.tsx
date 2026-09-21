import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LessonListItem from '../LessonListItem'
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
  render(
    <MemoryRouter>
      <LessonListItem lesson={mockLockedLesson} state="locked" />
    </MemoryRouter>,
  )

  const lessonButton = screen.getByRole('button', { name: /locked lesson/i })
  expect(lessonButton).toHaveAttribute('aria-disabled', 'true')
  expect(screen.queryByRole('link')).not.toBeInTheDocument()

  fireEvent.click(lessonButton)

  expect(screen.getByRole('status')).toHaveTextContent(
    /locked until you finish the lessons before it/i,
  )
})

test('renders a link for an unlocked lesson without a notice', () => {
  render(
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

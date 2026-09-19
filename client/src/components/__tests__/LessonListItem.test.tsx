import { render, screen, fireEvent } from '@testing-library/react'
import LessonListItem from '../LessonListItem'

test('shows the locked notice instead of opening a locked lesson', () => {
  const handleClick = vi.fn()
  render(
    <LessonListItem
      title="Locked lesson"
      state="locked"
      onClick={handleClick}
    />,
  )

  const lessonButton = screen.getByRole('button', { name: /locked lesson/i })
  expect(lessonButton).toHaveAttribute('aria-disabled', 'true')

  fireEvent.click(lessonButton)

  expect(handleClick).not.toHaveBeenCalled()
  expect(screen.getByRole('status')).toHaveTextContent(
    /locked until you finish the lessons before it/i,
  )
})

test('opens an unlocked lesson without a notice', () => {
  const handleClick = vi.fn()
  render(
    <LessonListItem
      title="Open lesson"
      state="unlocked"
      onClick={handleClick}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: /open lesson/i }))

  expect(handleClick).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
})

import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import DraggableCard from '../DraggableCard'

function renderCard(props: Partial<Parameters<typeof DraggableCard>[0]> = {}) {
  return render(
    <ol>
      <DraggableCard {...props}>Card content</DraggableCard>
    </ol>,
  )
}

test('renders its content as a draggable card with a drag handle', () => {
  const { container } = renderCard()

  const card = screen.getByRole('listitem')

  expect(card).toHaveTextContent('Card content')
  expect(card).toHaveAttribute('draggable', 'true')
  expect(card).toHaveClass('rounded-box', 'border', 'cursor-grab')
  expect(container.querySelectorAll('svg')).toHaveLength(1)
})

test('hides the drag handle and drag affordance when disabled', () => {
  const { container } = renderCard({ disabled: true })

  const card = screen.getByRole('listitem')

  expect(card).toHaveAttribute('draggable', 'false')
  expect(card).toHaveClass('bg-base-200')
  expect(card).not.toHaveClass('cursor-grab')
  expect(container.querySelectorAll('svg')).toHaveLength(0)
})

test('shows a dragging appearance', () => {
  renderCard({ isDragging: true })

  expect(screen.getByRole('listitem')).toHaveClass('opacity-50')
})

test('forwards the drag events to the consumer', () => {
  const onDragStart = vi.fn()
  const onDrop = vi.fn()
  const onDragEnd = vi.fn()
  renderCard({ onDragStart, onDrop, onDragEnd })
  const card = screen.getByRole('listitem')
  const dataTransfer = { setData: vi.fn(), getData: vi.fn() }

  fireEvent.dragStart(card, { dataTransfer })
  fireEvent.drop(card, { dataTransfer })
  fireEvent.dragEnd(card, { dataTransfer })

  expect(onDragStart).toHaveBeenCalledTimes(1)
  expect(onDrop).toHaveBeenCalledTimes(1)
  expect(onDragEnd).toHaveBeenCalledTimes(1)
})

test('makes itself a valid drop target while dragging over', () => {
  renderCard()
  const card = screen.getByRole('listitem')

  expect(fireEvent.dragOver(card, { dataTransfer: { setData: vi.fn() } })).toBe(
    false,
  )
})

import type { DragEvent, ReactNode } from 'react'
import { classNames } from '../utils/class-names'

type DraggableCardProps = {
  children: ReactNode
  disabled?: boolean
  isDragging?: boolean
  onDragStart?: (event: DragEvent<HTMLLIElement>) => void
  onDrop?: (event: DragEvent<HTMLLIElement>) => void
  onDragEnd?: (event: DragEvent<HTMLLIElement>) => void
}

export default function DraggableCard({
  children,
  disabled = false,
  isDragging = false,
  onDragStart,
  onDrop,
  onDragEnd,
}: DraggableCardProps) {
  return (
    <li
      className={classNames(
        'flex items-center gap-3 rounded-box border p-3 transition sm:p-4',
        isDragging
          ? 'border-base-content/30 bg-base-100 opacity-50'
          : disabled
            ? 'border-base-300 bg-base-200'
            : 'cursor-grab border-base-300 bg-base-100 hover:border-base-content/30 active:cursor-grabbing',
      )}
      draggable={!disabled}
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {!disabled && <DragHandleIcon />}
      <span className="flex-1 select-none">{children}</span>
    </li>
  )
}

function DragHandleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-5 w-5 shrink-0 text-base-content/40"
    >
      <circle cx="6" cy="4" r="1.25" />
      <circle cx="10" cy="4" r="1.25" />
      <circle cx="6" cy="8" r="1.25" />
      <circle cx="10" cy="8" r="1.25" />
      <circle cx="6" cy="12" r="1.25" />
      <circle cx="10" cy="12" r="1.25" />
    </svg>
  )
}

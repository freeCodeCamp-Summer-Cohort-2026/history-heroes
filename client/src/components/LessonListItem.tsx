import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Lesson } from '../features/lesson/model/Lesson'

type LessonState = 'locked' | 'unlocked' | 'completed'

type LessonListItemProps = {
  lesson: Lesson
  state?: LessonState
}

const stateStyles = {
  locked: {
    container: 'bg-base-200 text-base-content/50',
    icon: (
      <svg viewBox="0 0 100 100" className="h-5 w-5" fill="currentColor">
        <path
          d="M50,10 C34,10 25,21 25,38 L25,41 C15,41 12,47 12,58 L12,74 C12,85 15,90 28,90 L72,90 C85,90 88,85 88,74 L88,58 C88,47 85,41 75,41 L75,38 C75,21 66,10 50,10 Z M50,18 C61,18 67,26 67,38 L67,41 L33,41 L33,38 C33,26 39,18 50,18 Z M28,49 L72,49 C80,49 80,51 80,58 L80,74 C80,81 80,82 72,82 L28,82 C20,82 20,81 20,74 L20,58 C20,51 20,49 28,49 Z"
          fill="currentColor"
        />
      </svg>
    ),
    label: 'Locked',
  },
  unlocked: {
    container: 'bg-base-100',
    icon: '→',
    label: 'Available',
  },
  completed: {
    container: 'bg-success/5 border-success/30',
    icon: '✓',
    label: 'Completed',
  },
}

export default function LessonListItem({
  lesson,
  state = 'unlocked',
}: LessonListItemProps) {
  const { title, description, moduleId, id } = lesson
  const to = `/modules/${moduleId}/lessons/${id}`
  const styles = stateStyles[state]
  const isLocked = state === 'locked'
  const [showLockedNotice, setShowLockedNotice] = useState(false)

  function handleLockedClick() {
    setShowLockedNotice(true)
  }

  const commonClassName = `flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3 sm:gap-4 border border-base-300 p-4 text-left transition ${styles.container} ${
    !isLocked ? 'hover:bg-base-200' : 'cursor-not-allowed'
  }`

  const content = (
    <>
      <div className="flex-1">
        <h3 className="text-subheading font-semibold">{title}</h3>
        {description && (
          <p className="mt-1 text-small opacity-70">{description}</p>
        )}
        <span className="mt-2 block text-caption uppercase tracking-wide">
          {styles.label}
        </span>
      </div>

      <span className="text-lg font-bold sm:ml-4" aria-hidden="true">
        {styles.icon}
      </span>
    </>
  )

  return (
    <div>
      {isLocked ? (
        <button
          type="button"
          aria-disabled="true"
          onClick={handleLockedClick}
          className={commonClassName}
        >
          {content}
        </button>
      ) : (
        <Link to={to} className={commonClassName}>
          {content}
        </Link>
      )}
      <p role="status" className="mt-2 text-small empty:hidden">
        {showLockedNotice &&
          'This lesson is locked until you finish the lessons before it.'}
      </p>
    </div>
  )
}

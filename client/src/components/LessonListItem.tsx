import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import type { Lesson } from '../features/lesson/model/Lesson'

type LessonState = 'locked' | 'unlocked' | 'completed'

type LessonListItemProps = {
  lesson: Lesson
  state?: LessonState
}

const stateStyles = {
  locked: {
    container: 'bg-base-200 text-base-content/50',
    icon: <Lock className="size-5" />,
    label: 'Locked',
  },
  unlocked: {
    container: 'bg-base-100',
    icon: <ArrowRight className="size-5" />,
    label: 'Available',
  },
  completed: {
    container: 'bg-success/5 border-success/30',
    icon: <Check className="size-5" />,
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

      <span aria-hidden="true">{styles.icon}</span>
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

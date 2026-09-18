type LessonState = 'locked' | 'unlocked' | 'completed'

type LessonListItemProps = {
  title: string
  description?: string
  state?: LessonState
  onClick?: () => void
}

const stateStyles = {
  locked: {
    container: 'bg-base-200 text-base-content/50',
    icon: 'Locked',
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
  title,
  description,
  state = 'unlocked',
  onClick,
}: LessonListItemProps) {
  const styles = stateStyles[state]

  const isLocked = state === 'locked'

  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 border border-base-300 p-4 text-left transition ${styles.container} ${
        !isLocked ? 'hover:bg-base-200' : 'cursor-not-allowed'
      }`}
    >
      <div>
        <h3 className="text-subheading font-semibold">{title}</h3>

        {description && (
          <p className="mt-1 text-small opacity-70">{description}</p>
        )}

        <span className="mt-2 block text-caption uppercase tracking-wide">
          {styles.label}
        </span>
      </div>

      <span className="text-lg font-bold" aria-hidden="true">
        {styles.icon}
      </span>
    </button>
  )
}

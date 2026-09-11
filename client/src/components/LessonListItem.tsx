type LessonListItemProps = {
  title: string
  description?: string
  onClick?: () => void
}

export default function LessonListItem({
  title,
  description,
  onClick,
}: LessonListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 border border-base-300 bg-base-100 p-4 text-left transition hover:bg-base-200"
    >
      <div>
        <h3 className="text-subheading font-semibold">{title}</h3>

        {description && (
          <p className="mt-1 text-small text-base-content/70">{description}</p>
        )}
      </div>

      <span aria-hidden="true">→</span>
    </button>
  )
}

import { MatchingChoiceChip } from './MatchingChoiceChip'

interface MatchingChoiceBankProps {
  items: { id: string; label: string }[]
  pairs: { left: string; right: string }[]
  draggedItem: { id: string; side: 'left' | 'right' } | null
  selectedChoiceId: string | null
  disabled?: boolean
  onChoiceClick: (id: string) => void
  onDragStart: (id: string, e: React.DragEvent) => void
  onDragEnd: () => void
  onDrop: (choiceId: string, e: React.DragEvent) => void
}

export function MatchingChoiceBank({
  items,
  pairs,
  draggedItem,
  selectedChoiceId,
  disabled,
  onChoiceClick,
  onDragStart,
  onDragEnd,
  onDrop,
}: MatchingChoiceBankProps) {
  const availableItems = items.filter(
    (item) => !pairs.some((pair) => pair.right === item.id),
  )

  return (
    <section
      aria-labelledby="available-choices-heading"
      className="space-y-3 rounded-box border border-base-200 bg-base-200/50 p-4"
    >
      <div className="flex items-center justify-between">
        <h3
          id="available-choices-heading"
          className="text-small font-semibold uppercase tracking-wider text-base-content/70"
        >
          Available choices
        </h3>
        <span className="text-caption text-base-content/60">
          Drag or click an item to match into an open space above
        </span>
      </div>
      {availableItems.length === 0 ? (
        <p className="text-body text-base-content/60 italic py-2">
          All choices have been matched.
        </p>
      ) : (
        <ul
          aria-label="Available choices to match"
          className="flex flex-wrap gap-3"
        >
          {availableItems.map((item) => {
            const isBeingDragged =
              draggedItem !== null &&
              draggedItem.id === item.id &&
              draggedItem.side === 'right'
            const isSelected = selectedChoiceId === item.id

            return (
              <MatchingChoiceChip
                key={item.id}
                item={item}
                isPaired={false}
                isDragging={isBeingDragged}
                isSelected={isSelected}
                disabled={disabled}
                onClick={() => onChoiceClick(item.id)}
                onDragStart={(e) => onDragStart(item.id, e)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(item.id, e)}
              />
            )
          })}
        </ul>
      )}
    </section>
  )
}

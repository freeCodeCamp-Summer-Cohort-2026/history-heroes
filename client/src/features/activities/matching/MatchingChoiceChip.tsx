import { GripVertical } from 'lucide-react'
import { classNames } from '../../../utils/class-names'
import { ChevronChoiceNotch } from './ChevronPuzzleEdges'

interface MatchingChoiceChipProps {
  item: { id: string; label: string }
  isPaired: boolean
  isDragging: boolean
  isSelected: boolean
  disabled?: boolean
  onClick: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

export function MatchingChoiceChip({
  item,
  isPaired,
  isDragging,
  isSelected,
  disabled,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: MatchingChoiceChipProps) {
  return (
    <li
      className={classNames(
        'flex items-stretch rounded-xl shadow-xs transition select-none',
        isDragging ? 'opacity-50' : '',
        isSelected ? 'ring-2 ring-primary' : '',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-grab active:cursor-grabbing hover:scale-[1.02]',
      )}
      draggable={!disabled}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <ChevronChoiceNotch isPaired={isPaired} />
      <div
        className={classNames(
          'flex items-center gap-2 rounded-r-xl border-t-2 border-b-2 border-r-2 px-3.5 py-2 text-body font-medium transition',
          isPaired
            ? 'border-success/40 bg-success/10 text-success'
            : isSelected
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-base-300 bg-base-100 text-base-content hover:border-base-content/40',
        )}
      >
        {!disabled && (
          <GripVertical
            className="size-4 shrink-0 text-base-content/40"
            aria-hidden="true"
          />
        )}
        <span>{item.label}</span>
        {isPaired && (
          <span className="badge badge-xs badge-success">in use</span>
        )}
      </div>
    </li>
  )
}

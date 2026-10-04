import { GripVertical } from 'lucide-react'
import { classNames } from '../../../utils/class-names'
import { ChevronMaleTab } from './ChevronPuzzleEdges'

interface MatchingPromptPieceProps {
  item: { id: string; label: string }
  pairedLabel?: string
  isPaired: boolean
  isDragOver: boolean
  isDragging: boolean
  disabled?: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onClick: () => void
}

export function MatchingPromptPiece({
  item,
  pairedLabel,
  isPaired,
  isDragOver,
  isDragging,
  disabled,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: MatchingPromptPieceProps) {
  return (
    <div
      className={classNames(
        'flex flex-1 items-stretch transition',
        isDragging ? 'opacity-50' : '',
      )}
      draggable={!disabled}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      <div
        className={classNames(
          'flex flex-1 items-center gap-2 rounded-l-xl border-t-2 border-b-2 border-l-2 p-3 sm:p-4 transition select-none',
          isPaired
            ? 'border-success/40 bg-success/10 text-base-content'
            : 'border-base-300 bg-base-100 text-base-content',
          isDragOver ? 'border-primary bg-primary/10' : '',
          disabled
            ? 'cursor-not-allowed'
            : 'cursor-grab active:cursor-grabbing',
        )}
      >
        {!disabled && (
          <GripVertical
            className="size-4 shrink-0 text-base-content/40"
            aria-hidden="true"
          />
        )}
        <span className="font-semibold text-body">
          {item.label}
          {pairedLabel ? ` - ${pairedLabel}` : ''}
        </span>
      </div>
      <ChevronMaleTab isPaired={isPaired} isDragOver={isDragOver} />
    </div>
  )
}

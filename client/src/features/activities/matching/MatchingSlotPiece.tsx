import { Check, GripVertical, X } from 'lucide-react'
import { classNames } from '../../../utils/class-names'
import { ChevronFemaleNotch } from './ChevronPuzzleEdges'

interface MatchingSlotPieceProps {
  pairedItem?: { id: string; label: string }
  isDragging: boolean
  isDragOver: boolean
  isAwaitingPlacement: boolean
  disabled?: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onSlotClick: () => void
  onUnpair: () => void
}

export function MatchingSlotPiece({
  pairedItem,
  isDragging,
  isDragOver,
  isAwaitingPlacement,
  disabled,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onSlotClick,
  onUnpair,
}: MatchingSlotPieceProps) {
  if (pairedItem) {
    return (
      <div
        className={classNames(
          'flex flex-1 items-stretch transition group',
          isDragging ? 'opacity-50' : '',
        )}
        draggable={!disabled}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <ChevronFemaleNotch isPaired={true} isDragOver={isDragOver} />
        <div
          className={classNames(
            'flex flex-1 items-center justify-between rounded-r-xl border-t-2 border-b-2 border-r-2 border-success/40 bg-success/10 p-3 sm:p-4 transition select-none',
            disabled
              ? 'cursor-not-allowed'
              : 'cursor-grab active:cursor-grabbing',
          )}
        >
          <div className="flex items-center gap-2">
            {!disabled && (
              <GripVertical
                className="size-4 shrink-0 text-base-content/40"
                aria-hidden="true"
              />
            )}
            <span className="font-semibold text-body">{pairedItem.label}</span>
            <div className="flex items-center gap-1 font-medium text-success text-small ml-1">
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Paired</span>
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onUnpair()
              }}
              title="Remove pairing"
              aria-label={`Unpair ${pairedItem.label}`}
              className="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:bg-base-200 hover:text-base-content"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'flex flex-1 items-stretch transition',
        isAwaitingPlacement ? 'cursor-pointer' : '',
      )}
      onClick={onSlotClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <ChevronFemaleNotch
        isPaired={false}
        isDashed={true}
        isDragOver={isDragOver}
      />
      <div
        className={classNames(
          'flex flex-1 items-center justify-center rounded-r-xl border-2 border-dashed border-l-0 p-3 sm:p-4 transition select-none',
          isDragOver
            ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
            : isAwaitingPlacement
              ? 'border-primary/50 bg-primary/5 text-primary animate-pulse'
              : 'border-base-300 bg-base-200/20 text-base-content/50 hover:border-base-content/30 hover:bg-base-200/40',
        )}
      >
        <span className="text-small font-medium tracking-wide">
          Drop match here
        </span>
      </div>
    </div>
  )
}

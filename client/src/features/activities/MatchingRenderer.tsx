import { useState } from 'react'
import type {
  MatchingContent,
  MatchingAnswer,
  ActivityRendererProps,
} from './types'
import { MatchingPromptPiece } from './matching/MatchingPromptPiece'
import { MatchingSlotPiece } from './matching/MatchingSlotPiece'
import { MatchingChoiceBank } from './matching/MatchingChoiceBank'

type DraggedItem = { id: string; side: 'left' | 'right' } | null

export default function MatchingRenderer({
  content,
  answer,
  onAnswerChange,
  disabled,
}: ActivityRendererProps<MatchingContent, MatchingAnswer>) {
  const [draggedItem, setDraggedItem] = useState<DraggedItem>(null)
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)

  function createPair(
    existingPairs: { left: string; right: string }[],
    leftId: string,
    rightId: string,
  ): { left: string; right: string }[] {
    const validFilter = existingPairs.filter(
      (pairs) => pairs.left !== leftId && pairs.right !== rightId,
    )
    const newPair = { left: leftId, right: rightId }

    return [...validFilter, newPair]
  }

  function handleDrop(leftId: string, rightId: string): void {
    if (disabled) return
    const answers = createPair(answer.pairs, leftId, rightId)
    onAnswerChange({ pairs: answers })
    setSelectedChoiceId(null)
    setDraggedItem(null)
    setDragOverTarget(null)
  }

  function handleUnpair(leftId: string): void {
    if (disabled) return
    const answers = answer.pairs.filter((pair) => pair.left !== leftId)
    onAnswerChange({ pairs: answers })
    setDraggedItem(null)
    setDragOverTarget(null)
  }

  function handleSlotClick(leftId: string): void {
    if (disabled || !selectedChoiceId) return
    handleDrop(leftId, selectedChoiceId)
  }

  function handleChoiceClick(rightId: string): void {
    if (disabled) return
    setSelectedChoiceId((current) => (current === rightId ? null : rightId))
  }

  if (content.left.length === 0 || content.right.length === 0) {
    return <p className="text-body text-base-content/70">No items available</p>
  }

  return (
    <div className="space-y-6">
      <section aria-labelledby="target-items-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3
            id="target-items-heading"
            className="text-small font-semibold uppercase tracking-wider text-base-content/70"
          >
            Items to match
          </h3>
        </div>
        <ul aria-label="Target items to match" className="space-y-3">
          {content.left.map((item) => {
            const findPaired = answer.pairs.find(
              (pair) => pair.left === item.id,
            )
            const findOppositeLabel = content.right.find(
              (rightItem) => rightItem.id === findPaired?.right,
            )
            const isLeftBeingDragged =
              draggedItem !== null &&
              draggedItem.id === item.id &&
              draggedItem.side === 'left'
            const isRightBeingDragged =
              findOppositeLabel !== undefined &&
              draggedItem !== null &&
              draggedItem.id === findOppositeLabel.id &&
              draggedItem.side === 'right'
            const isDragOver = dragOverTarget === item.id

            return (
              <li
                key={item.id}
                className="flex w-full items-stretch min-h-[58px]"
              >
                <MatchingPromptPiece
                  item={item}
                  pairedLabel={findOppositeLabel?.label}
                  isPaired={Boolean(findPaired)}
                  isDragOver={isDragOver}
                  isDragging={isLeftBeingDragged}
                  disabled={disabled}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('draggedId', item.id)
                    e.dataTransfer.setData('draggedSide', 'left')
                    setDraggedItem({ id: item.id, side: 'left' })
                  }}
                  onDragEnd={() => {
                    setDraggedItem(null)
                    setDragOverTarget(null)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOverTarget(item.id)
                  }}
                  onDragLeave={() => setDragOverTarget(null)}
                  onDrop={(e) => {
                    setDragOverTarget(null)
                    const draggedId = e.dataTransfer.getData('draggedId')
                    const draggedSide = e.dataTransfer.getData('draggedSide')
                    if (draggedSide === 'right') {
                      handleDrop(item.id, draggedId)
                    }
                  }}
                  onClick={() => handleSlotClick(item.id)}
                />

                <MatchingSlotPiece
                  pairedItem={findOppositeLabel}
                  promptLabel={item.label}
                  isDragging={isRightBeingDragged}
                  isDragOver={isDragOver}
                  isAwaitingPlacement={Boolean(selectedChoiceId)}
                  disabled={disabled}
                  onDragStart={(e) => {
                    if (!findOppositeLabel) return
                    e.dataTransfer.setData('draggedId', findOppositeLabel.id)
                    e.dataTransfer.setData('draggedSide', 'right')
                    setDraggedItem({
                      id: findOppositeLabel.id,
                      side: 'right',
                    })
                  }}
                  onDragEnd={() => {
                    setDraggedItem(null)
                    setDragOverTarget(null)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOverTarget(item.id)
                  }}
                  onDragLeave={() => setDragOverTarget(null)}
                  onDrop={(e) => {
                    setDragOverTarget(null)
                    const draggedId = e.dataTransfer.getData('draggedId')
                    const draggedSide = e.dataTransfer.getData('draggedSide')
                    if (draggedSide === 'right') {
                      handleDrop(item.id, draggedId)
                    }
                  }}
                  onSlotClick={() => handleSlotClick(item.id)}
                  onUnpair={() => handleUnpair(item.id)}
                />
              </li>
            )
          })}
        </ul>
      </section>

      <MatchingChoiceBank
        items={content.right}
        pairs={answer.pairs}
        draggedItem={draggedItem}
        selectedChoiceId={selectedChoiceId}
        disabled={disabled}
        onChoiceClick={handleChoiceClick}
        onDragStart={(id, e) => {
          e.dataTransfer.setData('draggedId', id)
          e.dataTransfer.setData('draggedSide', 'right')
          setDraggedItem({ id, side: 'right' })
        }}
        onDragEnd={() => {
          setDraggedItem(null)
          setDragOverTarget(null)
        }}
        onDrop={(choiceId, e) => {
          const draggedId = e.dataTransfer.getData('draggedId')
          const draggedSide = e.dataTransfer.getData('draggedSide')
          if (draggedSide === 'left') {
            handleDrop(draggedId, choiceId)
          }
        }}
      />
    </div>
  )
}

import { useState } from 'react'
import type {
  MatchingContent,
  MatchingAnswer,
  ActivityRendererProps,
} from '../features/activities/types'

type DraggedItem = { id: string; side: 'left' | 'right' } | null

export default function MatchingRenderer({
  content,
  answer,
  onAnswerChange,
  disabled,
}: ActivityRendererProps<MatchingContent, MatchingAnswer>) {
  const [draggedItem, setDraggedItem] = useState<DraggedItem>(null)

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
  }

  return (
    <>
      <div>
        {content.left.length !== 0 ? (
          content.left.map((item) => {
            const findPaired = answer.pairs.find(
              (pair) => pair.left === item.id,
            )
            const findOppositeLabel = content.right.find(
              (rightItem) => rightItem.id === findPaired?.right,
            )
            const isBeingDragged =
              draggedItem !== null &&
              draggedItem.id === item.id &&
              draggedItem.side === 'left'

            return (
              <button
                className={isBeingDragged ? 'opacity-50' : ''}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e: React.DragEvent) => {
                  const draggedId = e.dataTransfer.getData('draggedId')
                  const draggedSide = e.dataTransfer.getData('draggedSide')
                  if (draggedSide === 'right') {
                    handleDrop(item.id, draggedId)
                  }
                }}
                draggable={!disabled}
                onDragStart={(e: React.DragEvent) => {
                  e.dataTransfer.setData('draggedId', item.id)
                  e.dataTransfer.setData('draggedSide', 'left')
                  setDraggedItem({ id: item.id, side: 'left' })
                }}
                key={item.id}
                onDragEnd={() => setDraggedItem(null)}
              >
                {item.label} - {findOppositeLabel?.label}
              </button>
            )
          })
        ) : (
          <p>No items available</p>
        )}
      </div>
      <div>
        {content.right.length !== 0 ? (
          content.right.map((item) => {
            const pairedEntry = answer.pairs.find(
              (pair) => pair.right === item.id,
            )
            const findOppositeLabel = content.left.find(
              (leftItem) => leftItem.id === pairedEntry?.left,
            )
            const isBeingDragged =
              draggedItem !== null &&
              draggedItem.id === item.id &&
              draggedItem.side === 'right'

            return (
              <button
                className={isBeingDragged ? 'opacity-50' : ''}
                key={item.id}
                draggable={!disabled}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e: React.DragEvent) => {
                  const draggedId = e.dataTransfer.getData('draggedId')
                  const draggedSide = e.dataTransfer.getData('draggedSide')
                  if (draggedSide === 'left') {
                    handleDrop(draggedId, item.id)
                  }
                }}
                onDragStart={(e: React.DragEvent) => {
                  e.dataTransfer.setData('draggedId', item.id)
                  e.dataTransfer.setData('draggedSide', 'right')
                  setDraggedItem({ id: item.id, side: 'right' })
                }}
                onDragEnd={() => setDraggedItem(null)}
              >
                {item.label} - {findOppositeLabel?.label}
              </button>
            )
          })
        ) : (
          <p>No item available</p>
        )}
      </div>
    </>
  )
}

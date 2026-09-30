import { useState } from 'react'
import type {
  OrderingContent,
  OrderingAnswer,
  ActivityRendererProps,
} from './types'
import DraggableCard from '../../components/DraggableCard'

type DraggedItem = { id: string } | null
export default function OrderingRenderer({
  content,
  answer,
  onAnswerChange,
  disabled,
}: ActivityRendererProps<OrderingContent, OrderingAnswer>) {
  const [draggedItem, setDraggedItem] = useState<DraggedItem>(null)

  function reorderItems(
    currentOrder: string[],
    draggedId: string,
    droppedId: string,
  ): string[] {
    const currentOrderCopy = [...currentOrder]
    const dragIndex = currentOrderCopy.findIndex((id) => id === draggedId)
    if (dragIndex === -1) return currentOrder

    const removedItem = currentOrderCopy.splice(dragIndex, 1)
    const dropIndex = currentOrderCopy.findIndex((id) => id === droppedId)
    if (dropIndex === -1) return currentOrder

    currentOrderCopy.splice(dropIndex, 0, removedItem[0])

    return currentOrderCopy
  }

  function handleOrdering(draggedId: string, droppedId: string): void {
    if (disabled) return
    const reorder = reorderItems(answer.itemOrder, draggedId, droppedId)
    onAnswerChange({ itemOrder: reorder })
  }

  return (
    <>
      {content.items.length !== 0 ? (
        <ol aria-label="Items to put in order" className="space-y-2">
          {answer.itemOrder.map((id) => {
            const activityItem = content.items.find((item) => item.id === id)
            const itemIsDefined = activityItem !== undefined
            const isBeingDragged =
              draggedItem !== null && draggedItem.id === activityItem?.id

            return (
              <DraggableCard
                key={id}
                disabled={disabled}
                isDragging={isBeingDragged}
                onDragStart={(event) => {
                  if (itemIsDefined) {
                    event.dataTransfer.setData('draggedId', activityItem.id)
                    setDraggedItem({ id: activityItem.id })
                  }
                }}
                onDrop={(event) => {
                  if (itemIsDefined) {
                    const draggedId = event.dataTransfer.getData('draggedId')
                    handleOrdering(draggedId, activityItem.id)
                  }
                }}
                onDragEnd={() => setDraggedItem(null)}
              >
                {activityItem?.label}
              </DraggableCard>
            )
          })}
        </ol>
      ) : (
        <p className="text-body">No items available</p>
      )}
    </>
  )
}

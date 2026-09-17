import { useState } from 'react'
import type {
  OrderingContent,
  OrderingAnswer,
  ActivityRendererProps,
} from './types'

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

    const removedItem = currentOrderCopy.splice(dragIndex, 1)
    const dropIndex = currentOrderCopy.findIndex((id) => id === droppedId)

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
      <div>
        {content.items.length !== 0 ? (
          answer.itemOrder.map((id) => {
            const activityItem = content.items.find((item) => item.id === id)
            const itemIsDefined = activityItem !== undefined
            const isBeingDragged =
              draggedItem !== null && draggedItem.id === activityItem?.id
            return (
              <div
                key={id}
                className={isBeingDragged ? 'opacity-50' : ''}
                draggable={!disabled}
                onDragOver={(e) => e.preventDefault()}
                onDragStart={(e: React.DragEvent) => {
                  if (itemIsDefined) {
                    e.dataTransfer.setData('draggedId', activityItem?.id)
                    setDraggedItem({ id: activityItem.id })
                  }
                }}
                onDrop={(e: React.DragEvent) => {
                  if (itemIsDefined) {
                    const draggedId = e.dataTransfer.getData('draggedId')
                    handleOrdering(draggedId, activityItem.id)
                  }
                }}
                onDragEnd={() => setDraggedItem(null)}
              >
                {activityItem?.label}
              </div>
            )
          })
        ) : (
          <p>No items available</p>
        )}
      </div>
    </>
  )
}

declare module '@dragdroptouch/drag-drop-touch' {
  export interface DragDropTouchOptions {
    forceListen?: boolean
    pressHoldInterval?: number
    dragThreshold?: number
    contextMenuOnPressHold?: boolean
    [key: string]: unknown
  }

  export function enableDragDropTouch(
    dragRoot?: Node,
    dropRoot?: Node,
    options?: DragDropTouchOptions,
  ): void
}

import { useEffect, useRef } from 'react'

interface UseModalFocusOptions {
  isOpen: boolean
  onClose: () => void
  disabled?: boolean
  initialFocusRef?: React.RefObject<HTMLElement | null>
}

/**
 * useModalFocus is an accessible focus-management hook for modal dialogs.
 *
 * It manages:
 * 1. Setting initial focus to an explicit element or the first focusable element inside the modal.
 * 2. Trapping focus within the modal so keyboard navigation (Tab / Shift+Tab) cannot escape behind the overlay.
 * 3. Handling the Escape key to close the modal (unless disabled/loading).
 * 4. Restoring keyboard focus to the triggering element upon modal dismissal.
 */
export function useModalFocus<T extends HTMLElement = HTMLDialogElement>({
  isOpen,
  onClose,
  disabled = false,
  initialFocusRef,
}: UseModalFocusOptions) {
  const modalRef = useRef<T>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Save the element that triggered the modal to restore focus later
    previousActiveElement.current = document.activeElement as HTMLElement | null

    const modal = modalRef.current
    if (!modal) return

    const focusableSelector =
      'button:not([disabled]):not([tabindex="-1"]), [href]:not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'

    // Focus initial element or first focusable element inside modal
    const focusTimer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      } else {
        const focusableElements =
          modal.querySelectorAll<HTMLElement>(focusableSelector)
        if (focusableElements.length > 0) {
          focusableElements[0].focus()
        } else {
          modal.focus()
        }
      }
    }, 0)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!disabled) {
          event.preventDefault()
          onClose()
        }
        return
      }

      if (event.key === 'Tab') {
        const focusableElements = Array.from(
          modal.querySelectorAll<HTMLElement>(focusableSelector),
        ).filter(
          (el) =>
            el.offsetParent !== null ||
            el === document.activeElement ||
            el.tabIndex >= 0,
        )

        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          if (
            document.activeElement === firstElement ||
            !modal.contains(document.activeElement)
          ) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (
            document.activeElement === lastElement ||
            !modal.contains(document.activeElement)
          ) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      if (
        previousActiveElement.current &&
        typeof previousActiveElement.current.focus === 'function'
      ) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, onClose, disabled, initialFocusRef])

  return modalRef
}

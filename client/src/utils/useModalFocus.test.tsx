import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState, useRef } from 'react'
import { vi } from 'vitest'
import { useModalFocus } from './useModalFocus'

function TestModal({
  isOpen,
  onClose,
  disabled = false,
}: {
  isOpen: boolean
  onClose: () => void
  disabled?: boolean
}) {
  const dialogRef = useModalFocus<HTMLDialogElement>({
    isOpen,
    onClose,
    disabled,
  })

  if (!isOpen) return null

  return (
    <dialog ref={dialogRef} open aria-modal="true">
      <h2>Modal Title</h2>
      <button type="button">Cancel</button>
      <button type="button">Confirm</button>
    </dialog>
  )
}

function TestContainer({ disabled = false }: { disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <button ref={triggerRef} type="button" onClick={() => setIsOpen(true)}>
        Open Modal
      </button>
      <TestModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        disabled={disabled}
      />
    </div>
  )
}

describe('useModalFocus', () => {
  it('moves focus into the first focusable element when opened', async () => {
    vi.useFakeTimers()
    render(<TestContainer />)

    const openButton = screen.getByRole('button', { name: 'Open Modal' })
    openButton.focus()
    expect(document.activeElement).toBe(openButton)

    fireEvent.click(openButton)
    vi.runAllTimers()

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    expect(document.activeElement).toBe(cancelButton)

    vi.useRealTimers()
  })

  it('closes modal on Escape key press and restores focus to trigger', async () => {
    vi.useFakeTimers()
    render(<TestContainer />)

    const openButton = screen.getByRole('button', { name: 'Open Modal' })
    openButton.focus()
    fireEvent.click(openButton)
    vi.runAllTimers()

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Focus restored to trigger
    expect(document.activeElement).toBe(openButton)

    vi.useRealTimers()
  })

  it('does not close modal on Escape when disabled/loading', () => {
    render(<TestContainer disabled={true} />)

    const openButton = screen.getByRole('button', { name: 'Open Modal' })
    fireEvent.click(openButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('traps focus inside the modal on Tab and Shift+Tab', () => {
    render(<TestContainer />)

    const openButton = screen.getByRole('button', { name: 'Open Modal' })
    fireEvent.click(openButton)

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    const confirmButton = screen.getByRole('button', { name: 'Confirm' })

    confirmButton.focus()
    expect(document.activeElement).toBe(confirmButton)

    // Tab from last element wraps to first
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(cancelButton)

    // Shift+Tab from first element wraps to last
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(confirmButton)
  })
})

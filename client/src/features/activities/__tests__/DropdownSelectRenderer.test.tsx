import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import DropdownSelectRenderer from '../DropdownSelectRenderer'

const content = {
  prompt: 'Which wonder is in Egypt?',
  options: [
    { id: 'pyramid', label: 'Great Pyramid' },
    { id: 'colossus', label: 'Colossus of Rhodes' },
  ],
}

test('renders the prompt and dropdown options', () => {
  render(
    <DropdownSelectRenderer
      content={content}
      answer={{ selectedOptionId: null }}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )
})

test('shows the selected option', () => {
  render(
    <DropdownSelectRenderer
      content={content}
      answer={{ selectedOptionId: 'pyramid' }}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )

  expect(screen.getByRole('combobox')).toHaveValue('pyramid')
})

test('updates the answer when an option is selected', () => {
  const mockAnswerChange = vi.fn()

  render(
    <DropdownSelectRenderer
      content={content}
      answer={{ selectedOptionId: null }}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'colossus' },
  })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    selectedOptionId: 'colossus',
  })
})

test('disables the select when disabled is true', () => {
  render(
    <DropdownSelectRenderer
      content={content}
      answer={{ selectedOptionId: null }}
      onAnswerChange={() => {}}
      disabled={true}
    />,
  )

  expect(screen.getByRole('combobox')).toBeDisabled()
})

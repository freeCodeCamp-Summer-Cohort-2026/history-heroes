import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TrueFalseRenderer from '../TrueFalseRenderer'
import { vi } from 'vitest'

const content = { statement: 'The Great Pyramid was built by paid workers.' }

test('renders the statement and both options', () => {
  render(
    <TrueFalseRenderer
      content={content}
      answer={{ value: null }}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )

  expect(screen.getByText(content.statement)).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: 'True' })).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: 'False' })).toBeInTheDocument()
})

test('nothing is selected when theres no answer yet', () => {
  render(
    <TrueFalseRenderer
      content={content}
      answer={{ value: null }}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )

  expect(screen.getByRole('radio', { name: 'True' })).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: 'False' })).toBeInTheDocument()
})

test('selects True when answer is true', () => {
  render(
    <TrueFalseRenderer
      content={content}
      answer={{ value: true }}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )

  expect(screen.getByRole('radio', { name: 'True' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'False' })).not.toBeChecked()
})

test('selects false when answer is false', () => {
  render(
    <TrueFalseRenderer
      content={content}
      answer={{ value: false }}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )

  expect(screen.getByRole('radio', { name: 'True' })).not.toBeChecked()
  expect(screen.getByRole('radio', { name: 'False' })).toBeChecked()
})

test('replaces the answer when the other option is clicked', () => {
  const mockAnswerChange = vi.fn()

  render(
    <TrueFalseRenderer
      content={content}
      answer={{ value: true }}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  fireEvent.click(screen.getByRole('radio', { name: 'False' }))
  expect(mockAnswerChange).toHaveBeenCalledWith({ value: false })
})

test('renders the statement and both options', () => {
  render(
    <TrueFalseRenderer
      content={content}
      answer={{ value: null }}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )

  expect(screen.getByText(content.statement)).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: 'True' })).toBeInTheDocument()
  expect(screen.getByRole('radio', { name: 'False' })).toBeInTheDocument()
})

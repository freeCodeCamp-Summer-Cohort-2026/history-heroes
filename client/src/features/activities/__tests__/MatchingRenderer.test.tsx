import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MatchingRenderer from '../MatchingRenderer'
import { vi } from 'vitest'

test('renders items to match', () => {
  const content = {
    left: [{ id: 'yr-2019', label: '2019' }],
    right: [{ id: 'ev-covid', label: 'COVID outbreak' }],
  }
  const answer = { pairs: [] }

  render(
    <MatchingRenderer
      content={content}
      answer={answer}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )

  expect(screen.getByText(/2019/i)).toBeInTheDocument()
  expect(screen.getByText(/COVID outbreak/i)).toBeInTheDocument()
})

test('creates a pairing when an item is dragged onto and allowed target', () => {
  const mockAnswerChange = vi.fn()
  const stored: Record<string, string> = {}
  const fakeDataTransfer = {
    setData: (key: string, value: string) => {
      stored[key] = value
    },
    getData: (key: string) => {
      return stored[key]
    },
  }

  const content = {
    left: [{ id: 'yr-2019', label: '2019' }],
    right: [{ id: 'ev-covid', label: 'COVID outbreak' }],
  }
  const answer = { pairs: [] }

  render(
    <MatchingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const sourceElement = screen.getByText(/2019/i)
  const droppedOn = screen.getByText(/COVID outbreak/i)

  fireEvent.dragStart(sourceElement, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(droppedOn, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    pairs: [{ left: 'yr-2019', right: 'ev-covid' }],
  })
})

test('replaces an item in a pair', () => {
  const mockAnswerChange = vi.fn()
  const stored: Record<string, string> = {}
  const fakeDataTransfer = {
    setData: (key: string, value: string) => {
      stored[key] = value
    },
    getData: (key: string) => {
      return stored[key]
    },
  }

  const content = {
    left: [{ id: 'yr-2019', label: '2019' }],
    right: [
      { id: 'ev-covid', label: 'COVID outbreak' },
      { id: 'ev-lockdown', label: 'Global lockdowns' },
    ],
  }
  const answer = { pairs: [{ left: 'yr-2019', right: 'ev-covid' }] }

  render(
    <MatchingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const sourceElement = screen.getByText(/Global lockdowns/i)
  const droppedOn = screen.getByText(/^2019/i)

  fireEvent.dragStart(sourceElement, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(droppedOn, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    pairs: [{ left: 'yr-2019', right: 'ev-lockdown' }],
  })
})

test('no correctness feedback output', () => {
  const mockAnswerChange = vi.fn()
  const stored: Record<string, string> = {}
  const fakeDataTransfer = {
    setData: (key: string, value: string) => {
      stored[key] = value
    },
    getData: (key: string) => {
      return stored[key]
    },
  }

  const content = {
    left: [{ id: 'yr-2019', label: '2019' }],
    right: [{ id: 'ev-covid', label: 'COVID outbreak' }],
  }
  const answer = { pairs: [] }

  render(
    <MatchingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const sourceElement = screen.getByText(/2019/i)
  const droppedOn = screen.getByText(/COVID outbreak/i)

  fireEvent.dragStart(sourceElement, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(droppedOn, { dataTransfer: fakeDataTransfer })

  expect(screen.queryByText(/correct/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/not.?yet/i)).not.toBeInTheDocument()
})

test('creates a pair without touching other pairs', () => {
  const mockAnswerChange = vi.fn()
  const stored: Record<string, string> = {}
  const fakeDataTransfer = {
    setData: (key: string, value: string) => {
      stored[key] = value
    },
    getData: (key: string) => {
      return stored[key]
    },
  }

  const content = {
    left: [
      { id: 'yr-2019', label: '2019' },
      { id: 'yr-2020', label: '2020' },
    ],
    right: [
      { id: 'ev-covid', label: 'COVID outbreak' },
      { id: 'ev-lockdown', label: 'Global lockdowns' },
    ],
  }
  const answer = { pairs: [{ left: 'yr-2019', right: 'ev-covid' }] }

  render(
    <MatchingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const sourceElement = screen.getByText(/2020/i)
  const droppedOn = screen.getByText(/Global lockdowns/i)

  fireEvent.dragStart(sourceElement, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(droppedOn, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    pairs: [
      { left: 'yr-2019', right: 'ev-covid' },
      { left: 'yr-2020', right: 'ev-lockdown' },
    ],
  })
})

test('a replaced item is still draggable', () => {
  const mockAnswerChange = vi.fn()
  const stored: Record<string, string> = {}
  const fakeDataTransfer = {
    setData: (key: string, value: string) => {
      stored[key] = value
    },
    getData: (key: string) => {
      return stored[key]
    },
  }

  const content = {
    left: [
      { id: 'yr-2019', label: '2019' },
      { id: 'yr-2020', label: '2020' },
      { id: 'yr-2022', label: '2022' },
    ],
    right: [
      { id: 'ev-covid', label: 'COVID outbreak' },
      { id: 'ev-lockdown', label: 'Global lockdowns' },
      { id: 'ev-world-cup', label: 'World Cup 2022' },
    ],
  }
  const answer = { pairs: [{ left: 'yr-2019', right: 'ev-covid' }] }

  const { rerender } = render(
    <MatchingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const sourceElement = screen.getByText(/Global lockdowns/i)
  const droppedOn = screen.getByText(/^2019/i)

  fireEvent.dragStart(sourceElement, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(droppedOn, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    pairs: [{ left: 'yr-2019', right: 'ev-lockdown' }],
  })

  rerender(
    <MatchingRenderer
      content={content}
      answer={{ pairs: [{ left: 'yr-2019', right: 'ev-lockdown' }] }}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const replacedElement = screen.getByText(/COVID outbreak/i)
  const newDrop = screen.getByText(/^2022/i)

  fireEvent.dragStart(replacedElement, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(newDrop, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    pairs: [
      { left: 'yr-2019', right: 'ev-lockdown' },
      { left: 'yr-2022', right: 'ev-covid' },
    ],
  })
})

test('dragged item returns to its post if dropped on invalid element', () => {
  const mockAnswerChange = vi.fn()
  const stored: Record<string, string> = {}
  const fakeDataTransfer = {
    setData: (key: string, value: string) => {
      stored[key] = value
    },
    getData: (key: string) => {
      return stored[key]
    },
  }

  const content = {
    left: [{ id: 'yr-2019', label: '2019' }],
    right: [{ id: 'ev-covid', label: 'COVID outbreak' }],
  }
  const answer = { pairs: [] }

  const { container } = render(
    <MatchingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const sourceElement = screen.getByText(/COVID outbreak/i)
  const invalidElement = container

  fireEvent.dragStart(sourceElement, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(invalidElement, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).not.toHaveBeenCalled()
})

test('incomplete pairings remain valid activity state', () => {
  const content = {
    left: [
      { id: 'yr-2019', label: '2019' },
      { id: 'yr-2020', label: '2020' },
      { id: 'yr-2022', label: '2022' },
    ],
    right: [
      { id: 'ev-covid', label: 'COVID outbreak' },
      { id: 'ev-lockdown', label: 'Global lockdowns' },
      { id: 'ev-world-cup', label: 'World Cup 2022' },
    ],
  }

  const answer = { pairs: [{ left: 'yr-2019', right: 'ev-covid' }] }

  render(
    <MatchingRenderer
      content={content}
      answer={answer}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )

  expect(screen.getByText(/2019 - COVID outbreak/i)).toBeInTheDocument()
  expect(screen.getByText(/^2020$/i)).toBeInTheDocument()
})

test('missing or empty group output', () => {
  const content = {
    left: [],
    right: [
      { id: 'ev-covid', label: 'COVID outbreak' },
      { id: 'ev-lockdown', label: 'Global lockdowns' },
      { id: 'ev-world-cup', label: 'World Cup 2022' },
    ],
  }

  const answer = { pairs: [] }

  render(
    <MatchingRenderer
      content={content}
      answer={answer}
      onAnswerChange={() => {}}
      disabled={false}
    />,
  )

  expect(screen.getByText(/No items available/i)).toBeInTheDocument()
})

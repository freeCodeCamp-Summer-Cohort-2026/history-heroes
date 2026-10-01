import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import OrderingRenderer from '../OrderingRenderer'
import { vi } from 'vitest'

test('renders a card for every item in the current order', () => {
  render(
    <OrderingRenderer
      content={{
        items: [
          { id: 'ev-wright', label: 'Wright brothers first flight' },
          { id: 'ev-moon', label: 'Moon landing' },
          { id: 'ev-www', label: 'World Wide Web invented' },
        ],
      }}
      answer={{ itemOrder: ['ev-moon', 'ev-wright', 'ev-www'] }}
      onAnswerChange={vi.fn()}
      disabled={false}
    />,
  )

  const items = screen.getAllByRole('listitem')

  expect(items).toHaveLength(3)
  expect(items.map((item) => item.textContent)).toEqual([
    'Moon landing',
    'Wright brothers first flight',
    'World Wide Web invented',
  ])
})

test('accepts drop from one position to the other', () => {
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
    items: [
      { id: 'ev-wright', label: 'Wright brothers first flight' },
      { id: 'ev-moon', label: 'Moon landing' },
      { id: 'ev-www', label: 'World Wide Web invented' },
    ],
  }
  const answer = { itemOrder: ['ev-moon', 'ev-wright', 'ev-www'] }

  render(
    <OrderingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const dragged = screen.getByText(/World Wide Web invented/i)
  const dropped = screen.getByText(/Wright brothers first flight/i)

  fireEvent.dragStart(dragged, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(dropped, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    itemOrder: ['ev-moon', 'ev-www', 'ev-wright'],
  })
})

test('item returns to its postion when dropped on invalid element', () => {
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
    items: [
      { id: 'ev-wright', label: 'Wright brothers first flight' },
      { id: 'ev-moon', label: 'Moon landing' },
      { id: 'ev-www', label: 'World Wide Web invented' },
    ],
  }
  const answer = { itemOrder: ['ev-moon', 'ev-wright', 'ev-www'] }

  const { container } = render(
    <OrderingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const dragged = screen.getByText(/World Wide Web invented/i)
  const invalidElement = container

  fireEvent.dragStart(dragged, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(invalidElement, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).not.toHaveBeenCalled()
})

test('replaced item is still draggable', () => {
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
    items: [
      { id: 'ev-wright', label: 'Wright brothers first flight' },
      { id: 'ev-moon', label: 'Moon landing' },
      { id: 'ev-www', label: 'World Wide Web invented' },
    ],
  }
  const answer = { itemOrder: ['ev-moon', 'ev-wright', 'ev-www'] }

  const { rerender } = render(
    <OrderingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const dragged = screen.getByText(/World Wide Web invented/i)
  const dropped = screen.getByText(/Wright brothers first flight/i)

  fireEvent.dragStart(dragged, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(dropped, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    itemOrder: ['ev-moon', 'ev-www', 'ev-wright'],
  })

  rerender(
    <OrderingRenderer
      content={content}
      answer={{ itemOrder: ['ev-moon', 'ev-www', 'ev-wright'] }}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const replacedItem = screen.getByText(/Wright brothers first flight/i)
  const newDropped = screen.getByText(/Moon landing/i)

  fireEvent.dragStart(replacedItem, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(newDropped, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    itemOrder: ['ev-wright', 'ev-moon', 'ev-www'],
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
    items: [
      { id: 'ev-wright', label: 'Wright brothers first flight' },
      { id: 'ev-moon', label: 'Moon landing' },
      { id: 'ev-www', label: 'World Wide Web invented' },
    ],
  }
  const answer = { itemOrder: ['ev-moon', 'ev-wright', 'ev-www'] }

  render(
    <OrderingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const dragged = screen.getByText(/World Wide Web invented/i)
  const dropped = screen.getByText(/Wright brothers first flight/i)

  fireEvent.dragStart(dragged, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(dropped, { dataTransfer: fakeDataTransfer })

  expect(screen.queryByText(/correct/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/not.?yet/i)).not.toBeInTheDocument()
})

test('no duplicate id after reorder', () => {
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
    items: [
      { id: 'ev-wright', label: 'Wright brothers first flight' },
      { id: 'ev-moon', label: 'Moon landing' },
      { id: 'ev-www', label: 'World Wide Web invented' },
    ],
  }
  const answer = { itemOrder: ['ev-moon', 'ev-wright', 'ev-www'] }

  render(
    <OrderingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const dragged = screen.getByText(/World Wide Web invented/i)
  const dropped = screen.getByText(/Wright brothers first flight/i)

  fireEvent.dragStart(dragged, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(dropped, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    itemOrder: ['ev-moon', 'ev-www', 'ev-wright'],
  })

  const itemsCaptured = mockAnswerChange.mock.calls[0][0]

  const noDuplicate =
    new Set(itemsCaptured.itemOrder).size === itemsCaptured.itemOrder.length
  const sameIds = answer.itemOrder.every((val) =>
    itemsCaptured.itemOrder.includes(val),
  )

  expect(noDuplicate).toBe(true)
  expect(sameIds).toBe(true)
})

test('unrelated items default relative order stays thesame', () => {
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
    items: [
      { id: 'ev-wright', label: 'Wright brothers first flight' },
      { id: 'ev-moon', label: 'Moon landing' },
      { id: 'ev-www', label: 'World Wide Web invented' },
      { id: 'ev-print', label: 'Printing press invented' },
    ],
  }
  const answer = { itemOrder: ['ev-moon', 'ev-wright', 'ev-www', 'ev-print'] }

  render(
    <OrderingRenderer
      content={content}
      answer={answer}
      onAnswerChange={mockAnswerChange}
      disabled={false}
    />,
  )

  const dragged = screen.getByText(/Printing press invented/i)
  const dropped = screen.getByText(/World Wide Web invented/i)

  fireEvent.dragStart(dragged, { dataTransfer: fakeDataTransfer })
  fireEvent.drop(dropped, { dataTransfer: fakeDataTransfer })

  expect(mockAnswerChange).toHaveBeenCalledWith({
    itemOrder: ['ev-moon', 'ev-wright', 'ev-print', 'ev-www'],
  })

  const itemsCaptured = mockAnswerChange.mock.calls[0][0]

  const startIndex0 = answer.itemOrder.indexOf('ev-moon')
  const startIndex1 = answer.itemOrder.indexOf('ev-wright')
  const finalIndex0 = itemsCaptured.itemOrder.indexOf('ev-moon')
  const finalIndex1 = itemsCaptured.itemOrder.indexOf('ev-wright')
  const isInRelativeOrder =
    startIndex0 < startIndex1 && finalIndex0 < finalIndex1

  expect(isInRelativeOrder).toBe(true)
})

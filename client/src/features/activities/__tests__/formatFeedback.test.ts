import {
  formatOrderingFeedback,
  formatMatchingFeedback,
} from '../formatFeedback'

test('returns a string of expected order vs submitted', () => {
  const required = { correctOrder: ['ev-wright', 'ev-moon', 'ev-www'] }
  const content = {
    items: [
      { id: 'ev-moon', label: 'Moon landing' },
      { id: 'ev-wright', label: 'Wright brothers first flight' },
      { id: 'ev-www', label: 'World Wide Web invented' },
    ],
  }
  const submitted = { itemOrder: ['ev-moon', 'ev-wright', 'ev-www'] }

  const result = formatOrderingFeedback(required, submitted, content)

  expect(result.expected).toBe(
    'Wright brothers first flight, Moon landing, World Wide Web invented',
  )
  expect(result.yours).toBe(
    'Moon landing, Wright brothers first flight, World Wide Web invented',
  )
})

test('returns a string of expected, submitted and unattempted match', () => {
  const content = {
    left: [
      { id: 'ev-covid', label: 'COVID outbreak' },
      { id: 'ev-moon', label: 'Moon landing' },
    ],
    right: [
      { id: 'yr-2020', label: '2020' },
      { id: 'yr-1969', label: '1969' },
    ],
  }

  const required = {
    pairs: [
      { left: 'ev-covid', right: 'yr-2020' },
      { left: 'ev-moon', right: 'yr-1969' },
    ],
  }

  const submitted = {
    pairs: [{ left: 'ev-covid', right: 'yr-1969' }],
  }

  const result = formatMatchingFeedback(required, submitted, content)

  expect(result.expected).toBe(
    'COVID outbreak \u2194 2020, Moon landing \u2194 1969',
  )
  expect(result.yours).toBe('COVID outbreak \u2194 1969')
  expect(result.unattempted).toBe('Moon landing, 2020')
})

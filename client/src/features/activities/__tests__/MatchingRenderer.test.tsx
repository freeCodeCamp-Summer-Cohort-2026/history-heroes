import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MatchingRenderer from '../MatchingRenderer'

test('renders items to match', () => {
  const content = {
    left: [{ id: 'yr-2019', label: '2019' }],
    right: [{ id: 'ev-covid', label: 'COVID outbreak' }],
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

  expect(screen.getByText(/2019/i)).toBeInTheDocument()
  expect(screen.getByText(/COVID outbreak/i)).toBeInTheDocument()
})

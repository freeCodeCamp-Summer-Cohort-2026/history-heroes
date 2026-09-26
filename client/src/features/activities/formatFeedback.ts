import type {
  MatchingAnswer,
  MatchingContent,
  OrderingAnswer,
  OrderingContent,
} from './types'

export function formatOrderingFeedback(
  required: { correctOrder: string[] },
  submitted: OrderingAnswer,
  content: OrderingContent,
): { expected: string; yours: string } {
  const expectedLabels = required.correctOrder.map((id) => {
    const findId = content.items.find((item) => item.id === id)
    return findId?.label
  })

  const expected = expectedLabels.join(', ')

  const yourLabels = submitted.itemOrder.map((id) => {
    const findId = content.items.find((item) => item.id === id)
    return findId?.label
  })

  const yours = yourLabels.join(', ')
  return { expected, yours }
}

export function formatMatchingFeedback(
  required: { pairs: { left: string; right: string }[] },
  submitted: MatchingAnswer,
  content: MatchingContent,
): { expected: string; yours: string; unattempted: string } {
  const findExpectedLabels = required.pairs.map((id) => {
    const findLeftId = content.left.find((item) => item.id === id.left)
    const findRightId = content.right.find((item) => item.id === id.right)
    return `${findLeftId?.label} \u2194 ${findRightId?.label}`
  })

  const expected = findExpectedLabels

  const findSubmittedLabels = submitted.pairs.map((pair) => {
    const findLeftId = content.left.find((item) => item.id === pair.left)
    const findRightId = content.right.find((item) => item.id === pair.right)
    return `${findLeftId?.label} \u2194 ${findRightId?.label}`
  })
  const yours = findSubmittedLabels

  const findLeftUnattempted = content.left
    .filter(
      (item) => !submitted.pairs.some((subPair) => subPair.left === item.id),
    )
    .map((item) => {
      return item.label
    })

  const findRightUnattempted = content.right
    .filter(
      (item) => !submitted.pairs.some((subPair) => subPair.right === item.id),
    )
    .map((item) => {
      return item.label
    })

  const findUnattempted = [...findLeftUnattempted, ...findRightUnattempted]

  const notDone = findUnattempted
  const expectedStrings = expected.join(', ')
  const yourStrings = yours.join(', ')
  const unattemptedStrings = notDone.join(', ')

  return {
    expected: expectedStrings,
    yours: yourStrings,
    unattempted: unattemptedStrings,
  }
}

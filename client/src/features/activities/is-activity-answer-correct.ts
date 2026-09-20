import type { Activity, MatchingAnswer, OrderingAnswer } from './types'

export function isActivityAnswerCorrect(
  activity: Activity,
  answer: MatchingAnswer | OrderingAnswer | null,
): boolean {
  if (!answer) return false

  if (activity.type === 'ordering') {
    if (!('itemOrder' in answer)) return false
    const { correctOrder } = activity.successCriteria
    return (
      answer.itemOrder.length === correctOrder.length &&
      answer.itemOrder.every((id, index) => id === correctOrder[index])
    )
  }

  if (activity.type === 'matching') {
    if (!('pairs' in answer)) return false
    const { pairs } = activity.successCriteria
    return (
      answer.pairs.length === pairs.length &&
      answer.pairs.every((pair) =>
        pairs.some(
          (correctPair) =>
            correctPair.left === pair.left && correctPair.right === pair.right,
        ),
      )
    )
  }

  return false
}

export default isActivityAnswerCorrect

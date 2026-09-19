import type { Activity, ActivityAnswer, ActivityResult } from './types'

export function evaluateActivity(
  activity: Activity,
  answer: ActivityAnswer,
): ActivityResult {
  if (activity.type === 'ordering') {
    if (!('itemOrder' in answer)) {
      return 'not-yet'
    }

    const correctOrder = activity.successCriteria.correctOrder

    const isCorrect =
      answer.itemOrder.length === correctOrder.length &&
      answer.itemOrder.every((itemId, index) => itemId === correctOrder[index])
    return isCorrect ? 'correct' : 'not-yet'
  }

  if (!('pairs' in answer)) {
    return 'not-yet'
  }

  const correctPairs = activity.successCriteria.pairs

  const isCorrect =
    answer.pairs.length === correctPairs.length &&
    answer.pairs.every((pair) =>
      correctPairs.some(
        (correctPair) =>
          correctPair.left === pair.left && correctPair.right === pair.right,
      ),
    )
  return isCorrect ? 'correct' : 'not-yet'
}

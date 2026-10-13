import type {
  Activity,
  ActivityAnswer,
  ActivityWorkspaceSubmissionState,
} from './types'

export function evaluateActivity(
  activity: Activity,
  answer: ActivityAnswer,
): ActivityWorkspaceSubmissionState {
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

  if (activity.type === 'matching') {
    if (!('pairs' in answer)) {
      return 'not-yet'
    }

    const correctPairs = activity.successCriteria.pairs

    const isCorrect =
      answer.pairs.length === correctPairs.length &&
      correctPairs.every((correctPair) =>
        answer.pairs.some(
          (pair) =>
            pair.left === correctPair.left && pair.right === correctPair.right,
        ),
      )
    return isCorrect ? 'correct' : 'not-yet'
  }

  if (activity.type === 'true-false') {
    if (!('value' in answer)) {
      return 'not-yet'
    }
    return answer.value === activity.successCriteria.correctAnswer
      ? 'correct'
      : 'not-yet'
  }
  return 'not-yet'
}

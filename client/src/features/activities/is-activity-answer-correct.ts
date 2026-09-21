import { evaluateActivity } from './evaluation'
import type { Activity, MatchingAnswer, OrderingAnswer } from './types'

export function isActivityAnswerCorrect(
  activity: Activity,
  answer: MatchingAnswer | OrderingAnswer | null,
): boolean {
  if (!answer) return false
  return evaluateActivity(activity, answer) === 'correct'
}

export default isActivityAnswerCorrect

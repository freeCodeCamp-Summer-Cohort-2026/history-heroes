import { evaluateActivity } from './evaluation'
import type { Activity, ActivityAnswer, ActivityResult } from './types'

export function clearStaleResult(result: ActivityResult): ActivityResult {
  return result === 'not-yet' ? 'unsubmitted' : result
}

export function submitActivity(
  activity: Activity,
  answer: ActivityAnswer,
): ActivityResult {
  return evaluateActivity(activity, answer)
}

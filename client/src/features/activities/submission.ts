import { evaluateActivity } from './evaluation'
import type {
  Activity,
  ActivityAnswer,
  ActivityWorkspaceSubmissionState,
} from './types'

export function clearStaleResult(
  result: ActivityWorkspaceSubmissionState,
): ActivityWorkspaceSubmissionState {
  return result === 'not-yet' ? 'unsubmitted' : result
}

export function submitActivity(
  activity: Activity,
  answer: ActivityAnswer,
): ActivityWorkspaceSubmissionState {
  return evaluateActivity(activity, answer)
}

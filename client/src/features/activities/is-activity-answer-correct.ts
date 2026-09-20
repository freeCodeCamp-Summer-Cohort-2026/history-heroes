import type { Activity, MatchingAnswer, OrderingAnswer } from './types'

// TODO (#64): Answer evaluation logic is handled in issue #64.
// For now, this is a stub that returns true.
export function isActivityAnswerCorrect(
  _activity: Activity,
  _answer: MatchingAnswer | OrderingAnswer | null,
): boolean {
  return true
}

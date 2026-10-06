import type { MatchingActivity, MatchingAnswer } from './types'

/**
 * Returns the default matching answer with no initial pairs selected.
 */
export function getDefaultMatchingAnswer(
  _activity?: Pick<MatchingActivity, 'successCriteria'>,
): MatchingAnswer {
  return { pairs: [] }
}

export default getDefaultMatchingAnswer

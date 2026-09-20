import type { MatchingActivity, MatchingAnswer } from './types'

/**
 * Returns the default matching answer by shuffling the right-side values of the success criteria pairs.
 */
export function getDefaultMatchingAnswer(
  activity: Pick<MatchingActivity, 'successCriteria'>,
): MatchingAnswer {
  const pairs = activity.successCriteria.pairs
  const defaultPairs = pairs.map((pair) => ({
    left: pair.left,
    right: pair.right,
  }))

  for (let i = defaultPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[defaultPairs[i].right, defaultPairs[j].right] = [
      defaultPairs[j].right,
      defaultPairs[i].right,
    ]
  }
  return { pairs: defaultPairs }
}

export default getDefaultMatchingAnswer

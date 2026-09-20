import type { OrderingActivity, OrderingAnswer } from './types'

/**
 * Returns the default ordering answer by shuffling the correct order from success criteria.
 */
export function getDefaultOrderingAnswer(
  activity: Pick<OrderingActivity, 'successCriteria'>,
): OrderingAnswer {
  const correctOrder = activity.successCriteria.correctOrder
  const defaultOrder = [...correctOrder]

  for (let i = defaultOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[defaultOrder[i], defaultOrder[j]] = [defaultOrder[j], defaultOrder[i]]
  }
  return { itemOrder: defaultOrder }
}

export default getDefaultOrderingAnswer

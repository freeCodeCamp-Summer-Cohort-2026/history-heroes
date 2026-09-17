import type { ActivityResult } from './types'

export function clearStaleResult(result: ActivityResult): ActivityResult {
  return result === 'not-yet' ? 'unsubmitted' : result
}

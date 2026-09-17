import { describe, expect, test } from 'vitest'
import { clearStaleResult } from '../submission'

describe('clearStaleResult', () => {
  test('returns unsubmitted when the learner edits after a not-yet result', () => {
    expect(clearStaleResult('not-yet')).toBe('unsubmitted')
  })

  test('keeps correct when the activity is already correct', () => {
    expect(clearStaleResult('correct')).toBe('correct')
  })

  test('keeps unsubmitted when the activity has not been submitted', () => {
    expect(clearStaleResult('unsubmitted')).toBe('unsubmitted')
  })
})

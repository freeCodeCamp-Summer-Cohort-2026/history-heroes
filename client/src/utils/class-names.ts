/**
 * Tiny helper function useful for conditionally combining multiple classes into a single string.
 *
 * Partially replicates the `classnames` library
 */
export function classNames(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(' ')
}

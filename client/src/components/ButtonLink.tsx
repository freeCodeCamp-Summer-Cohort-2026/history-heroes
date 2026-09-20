import { Link } from 'react-router-dom'
import { classNames } from '../utils/class-names'

/**
 * Button that redirects using react-router-dom, for internal application navigation.
 *
 * For native anchor tag usage, use "native" true, this should only be used to route to another page entirely
 */
export default function ButtonLink(
  params:
    | {
        children: React.ReactNode
        variant?: 'primary' | 'secondary'
        className?: string
        native: true
        href: string
      }
    | {
        children: React.ReactNode
        variant?: 'primary' | 'secondary'
        className?: string
        native?: false
        to: string
      },
) {
  const { variant, native, children, className } = params
  const variantClass =
    variant === 'primary' || !variant
      ? 'btn-primary hover:bg-[var(--color-primary-focus)]'
      : 'btn-outline btn-secondary'

  if (native) {
    const { href } = params
    return (
      <a href={href} className={classNames('btn', variantClass, className)}>
        {children}
      </a>
    )
  }

  const { to } = params as {
    to: string
    children: React.ReactNode
    variant?: 'primary' | 'secondary'
    className?: string
  }

  return (
    <Link to={to} className={classNames('btn', variantClass, className)}>
      {children}
    </Link>
  )
}

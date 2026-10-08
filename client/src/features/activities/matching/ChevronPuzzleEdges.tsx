interface ChevronEdgeProps {
  isPaired: boolean
  isDragOver?: boolean
}

interface ChevronFemaleNotchProps extends ChevronEdgeProps {
  isDashed?: boolean
}

export function ChevronMaleTab({
  isPaired,
  isDragOver = false,
}: ChevronEdgeProps) {
  return (
    <div className="relative w-5 shrink-0 z-10">
      <svg
        viewBox="0 0 20 60"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M 0 0 L 20 30 L 0 60 Z"
          className={
            isDragOver
              ? 'fill-primary/10'
              : isPaired
                ? 'fill-success/10'
                : 'fill-base-100'
          }
        />
        <path
          d="M 0 0 L 20 30 L 0 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={
            isDragOver
              ? 'text-primary'
              : isPaired
                ? 'text-success/40'
                : 'text-base-300'
          }
        />
        <line
          x1="0"
          y1="1"
          x2="1"
          y2="1"
          stroke="currentColor"
          strokeWidth="2"
          className={
            isDragOver
              ? 'text-primary'
              : isPaired
                ? 'text-success/40'
                : 'text-base-300'
          }
        />
        <line
          x1="0"
          y1="59"
          x2="1"
          y2="59"
          stroke="currentColor"
          strokeWidth="2"
          className={
            isDragOver
              ? 'text-primary'
              : isPaired
                ? 'text-success/40'
                : 'text-base-300'
          }
        />
      </svg>
    </div>
  )
}

export function ChevronFemaleNotch({
  isPaired,
  isDashed = false,
  isDragOver = false,
}: ChevronFemaleNotchProps) {
  return (
    <div className="relative w-5 shrink-0 -ml-5 z-20 pointer-events-none">
      <svg
        viewBox="0 0 20 60"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        {!isDashed && (
          <path
            d="M 0 0 L 20 0 L 20 60 L 0 60 L 20 30 Z"
            className={
              isDragOver
                ? 'fill-primary/10'
                : isPaired
                  ? 'fill-success/10'
                  : 'fill-base-100'
            }
          />
        )}
        <path
          d="M 0 0 L 20 30 L 0 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={isDashed ? '4 4' : undefined}
          className={
            isDragOver
              ? 'text-primary'
              : isPaired
                ? 'text-success/40'
                : 'text-base-300'
          }
        />
        {!isDashed && (
          <>
            <line
              x1="0"
              y1="1"
              x2="20"
              y2="1"
              stroke="currentColor"
              strokeWidth="2"
              className={
                isDragOver
                  ? 'text-primary'
                  : isPaired
                    ? 'text-success/40'
                    : 'text-base-300'
              }
            />
            <line
              x1="0"
              y1="59"
              x2="20"
              y2="59"
              stroke="currentColor"
              strokeWidth="2"
              className={
                isDragOver
                  ? 'text-primary'
                  : isPaired
                    ? 'text-success/40'
                    : 'text-base-300'
              }
            />
          </>
        )}
      </svg>
    </div>
  )
}

export function ChevronChoiceNotch({ isPaired }: { isPaired: boolean }) {
  return (
    <div className="relative w-3.5 shrink-0">
      <svg
        viewBox="0 0 14 44"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M 0 0 L 14 0 L 14 44 L 0 44 L 14 22 Z"
          className={isPaired ? 'fill-success/10' : 'fill-base-100'}
        />
        <path
          d="M 0 0 L 14 22 L 0 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={isPaired ? 'text-success/40' : 'text-base-300'}
        />
      </svg>
    </div>
  )
}

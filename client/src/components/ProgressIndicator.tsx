type ProgressIndicatorProps = {
  current: number
  total: number
  label?: string
}

export default function ProgressIndicator({
  current,
  total,
  label = 'Lesson',
}: ProgressIndicatorProps) {
  return (
    <div className="text-sm text-base-content/70">
      {label} {current}/{total}
    </div>
  )
}

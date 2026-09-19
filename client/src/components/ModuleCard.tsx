import Button from './Button'

type ModuleCardProps = {
  title: string
  description: string
  period?: string
  theme?: string
  image?: string
  onStart?: () => void
}

function safeImage(url?: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('/')) return url
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return undefined
    return parsed.href
  } catch {
    return undefined
  }
}

export default function ModuleCard({
  title,
  description,
  period,
  theme,
  image,
  onStart,
}: ModuleCardProps) {
  const safeSrc = safeImage(image)

  return (
    <article className="card border border-base-300 bg-base-100 w-full sm:w-auto">
      {safeSrc && (
        <figure className="aspect-video bg-base-200">
          <img src={safeSrc} alt="" className="h-auto w-full object-cover" />
        </figure>
      )}

      <div className="card-body gap-3 sm:gap-4 p-4 sm:p-6">
        <div>
          <h2 className="text-subheading font-semibold">{title}</h2>
          <p className="mt-2 text-body text-base-content/70">{description}</p>
          {(period || theme) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {period && <span className="badge badge-outline">{period}</span>}
              {theme && <span className="badge badge-outline">{theme}</span>}
            </div>
          )}
        </div>

        <div className="card-actions justify-end">
          <Button onClick={onStart} className="w-full sm:w-auto">
            Start learning
          </Button>
        </div>
      </div>
    </article>
  )
}

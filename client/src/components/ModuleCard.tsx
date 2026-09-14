import Button from './Button'

type ModuleCardProps = {
  title: string
  description: string
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
  image,
  onStart,
}: ModuleCardProps) {
  const safeSrc = safeImage(image)

  return (
    <article className="card border border-base-300 bg-base-100">
      {safeSrc && (
        <figure className="aspect-video bg-base-200">
          <img src={safeSrc} alt="" className="h-full w-full object-cover" />
        </figure>
      )}

      <div className="card-body gap-4">
        <div>
          <h2 className="text-subheading font-semibold">{title}</h2>
          <p className="mt-2 text-body text-base-content/70">{description}</p>
        </div>

        <div className="card-actions justify-end">
          <Button onClick={onStart}>Start learning</Button>
        </div>
      </div>
    </article>
  )
}

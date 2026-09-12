import Button from './Button'

type ModuleCardProps = {
  title: string
  description: string
  image?: string
  onStart?: () => void
}

export default function ModuleCard({
  title,
  description,
  image,
  onStart,
}: ModuleCardProps) {
  return (
    <article className="card border border-base-300 bg-base-100">
      {image && (
        <figure className="aspect-video bg-base-200">
          <img src={image} alt="" className="h-full w-full object-cover" />
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

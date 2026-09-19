import type { ModuleSummary } from '../features/module/model/ModuleSummary'
import Button from './Button'
import ButtonLink from './ButtonLink'

export default function ModuleCard({ module }: { module: ModuleSummary }) {
  const { title, description, period, theme } = module

  return (
    <article className="card border border-base-300 bg-base-100 w-full sm:w-auto">
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
          <ButtonLink to={`/modules/${module.id}`} className="w-full sm:w-auto">
            Start learning
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}

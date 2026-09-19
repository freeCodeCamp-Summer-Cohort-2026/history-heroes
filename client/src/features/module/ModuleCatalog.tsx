import ModuleCard from '../../components/ModuleCard'
import type { ModuleSummary } from './model/ModuleSummary'

type ModuleCatalogProps = {
  modules: ModuleSummary[]
}

export default function ModuleCatalog({ modules }: ModuleCatalogProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <li key={module.id}>
          <ModuleCard module={module} />
        </li>
      ))}
    </ul>
  )
}

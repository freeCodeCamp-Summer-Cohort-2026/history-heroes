import ModuleCard from '../../components/ModuleCard'
import type { ModuleSummary } from './model/ModuleSummary'

type ModuleCatalogProps = {
  modules: ModuleSummary[]
  onModuleSelect: (id: string) => void
}

export default function ModuleCatalog({
  modules,
  onModuleSelect,
}: ModuleCatalogProps) {
  if (modules.length === 0) {
    return (
      <p className="text-body">
        No modules are available yet. Check back soon!
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((oneModule) => (
        <li key={oneModule.id}>
          <ModuleCard
            title={oneModule.title}
            description={oneModule.description}
            onStart={() => onModuleSelect(oneModule.id)}
          />
        </li>
      ))}
    </ul>
  )
}

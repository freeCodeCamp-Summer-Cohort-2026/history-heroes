import type { ModuleSummary } from './model/ModuleSummary'

type ModuleCatalogProps = {
  modules: ModuleSummary[]
  onModuleSelect: (id: string) => void
}

export default function ModuleCatalog({
  modules,
  onModuleSelect,
}: ModuleCatalogProps) {
  return (
    <ul>
      {modules.map((oneModule) => (
        <li key={oneModule.id}>
          <h2 className="text-subheading">{oneModule.title}</h2>
          <p className="text-body">{oneModule.description}</p>
          {oneModule.period && <p className="text-small">{oneModule.period}</p>}
          {oneModule.theme && <p className="text-small">{oneModule.theme}</p>}
          <button type="button" onClick={() => onModuleSelect(oneModule.id)}>
            Start Learning!
          </button>
        </li>
      ))}
    </ul>
  )
}

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
          <h2>{oneModule.title}</h2>
          <p>{oneModule.description}</p>
          {oneModule.period && <p>{oneModule.period}</p>}
          {oneModule.theme && <p>{oneModule.theme}</p>}
          <button type="button" onClick={() => onModuleSelect(oneModule.id)}>
            Start Learning!
          </button>
        </li>
      ))}
    </ul>
  )
}

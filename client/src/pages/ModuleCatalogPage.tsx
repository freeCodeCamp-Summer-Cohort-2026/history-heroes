import { useEffect, useState } from 'react'
import ModuleCatalog from '../features/module/ModuleCatalog'
import { fetchModules } from '../features/module/model/api'
import type { ModuleSummary } from '../features/module/model/ModuleSummary'
import FilterChips from '../components/FilterChips'
import useModuleFilters from '../features/module/useModuleFilters'

export default function ModuleCatalogPage() {
  const [modules, setModules] = useState<ModuleSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {
    periodsList,
    themesList,
    selectedPeriod,
    setSelectedPeriod,
    selectedTheme,
    setSelectedTheme,
    filteredModules,
  } = useModuleFilters(modules)

  useEffect(() => {
    fetchModules()
      .then((data) => setModules(data))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : 'Unable to load modules.',
        ),
      )
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <div>
          <p>Filter by periods</p>
          <FilterChips
            options={periodsList}
            selected={selectedPeriod}
            onSelect={setSelectedPeriod}
          />
          <p>Filter by themes</p>
          <FilterChips
            options={themesList}
            selected={selectedTheme}
            onSelect={setSelectedTheme}
          />
        </div>
        <h1 className="text-display">Modules</h1>
        <p className="mt-2 text-body text-base-content/70">
          Pick a module to start exploring history.
        </p>
      </div>
      {(() => {
        if (isLoading) return <p className="text-body">Loading modules...</p>
        if (error) return <p className="text-body">{error}</p>
        if (modules.length === 0)
          return (
            <p className="text-body">
              No modules are available yet. Check back soon!
            </p>
          )
        if (filteredModules.length === 0)
          return <p className="text-body">No modules match this filter</p>
        return <ModuleCatalog modules={filteredModules} />
      })()}
    </div>
  )
}

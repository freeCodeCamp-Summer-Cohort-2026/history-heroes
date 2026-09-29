import { useEffect, useState } from 'react'
import ModuleCatalog from '../features/module/ModuleCatalog'
import { fetchModules } from '../features/module/model/api'
import type { ModuleSummary } from '../features/module/model/ModuleSummary'
import FilterChips from '../components/FilterChips'
import { useDocumentTitle } from '../utils/useDocumentTitle'

export default function ModuleCatalogPage() {
  const [modules, setModules] = useState<ModuleSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredValue, setFilteredValue] = useState<string>('All')

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

  function getUniqueValues(
    modules: ModuleSummary[],
    field: 'period' | 'theme',
  ): string[] {
    const filtered =
      field === 'period'
        ? modules.map((mod) => mod.period).filter((p) => p !== undefined)
        : modules.map((mod) => mod.theme).filter((t) => t !== undefined)

    const unique = new Set(filtered)
    const valid = [...unique]
    return valid
  }

  const periods = getUniqueValues(modules, 'period')
  const themes = getUniqueValues(modules, 'theme')

  const filteredModules =
    filteredValue === 'All'
      ? modules
      : modules.filter(
          (module) =>
            module.period === filteredValue || module.theme === filteredValue,
        )

  const allFilterOptions = ['All', ...periods, ...themes]
  const uniqueFilterOptions = new Set(allFilterOptions)
  const filterOptions = [...uniqueFilterOptions]
  useDocumentTitle('Modules')

  return (
    <div className="space-y-6">
      <div>
        <FilterChips
          options={filterOptions}
          selected={filteredValue}
          onSelect={setFilteredValue}
        />
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

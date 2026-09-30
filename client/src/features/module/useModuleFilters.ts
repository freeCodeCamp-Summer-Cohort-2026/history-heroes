import { useState } from 'react'
import type { ModuleSummary } from './model/ModuleSummary'

export default function useModuleFilters(modules: ModuleSummary[]) {
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
  const periodsList = ['All', ...periods]
  const themes = getUniqueValues(modules, 'theme')
  const themesList = ['All', ...themes]
  const [selectedPeriod, setSelectedPeriod] = useState<string>('All')
  const [selectedTheme, setSelectedTheme] = useState<string>('All')

  const filteredModules = modules.filter((module) => {
    const periodMatches =
      selectedPeriod === 'All' || module.period === selectedPeriod
    const themeMatches =
      selectedTheme === 'All' || module.theme === selectedTheme
    return periodMatches && themeMatches
  })

  return {
    periodsList,
    themesList,
    selectedPeriod,
    setSelectedPeriod,
    selectedTheme,
    setSelectedTheme,
    filteredModules,
  }
}

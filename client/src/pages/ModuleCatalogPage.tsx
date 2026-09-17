import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModuleCatalog from '../features/module/ModuleCatalog'
import { fetchModules } from '../features/module/model/api'
import type { ModuleSummary } from '../features/module/model/ModuleSummary'

export default function ModuleCatalogPage() {
  const [modules, setModules] = useState<ModuleSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  function handleModuleSelect(id: string) {
    navigate(`/modules/${id}`)
  }

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
    <div>
      <h1 className="text-display">Modules</h1>
      {isLoading && <p className="text-body">Loading modules...</p>}
      {error && <p className="text-body">{error}</p>}
      {!isLoading && !error && (
        <ModuleCatalog modules={modules} onModuleSelect={handleModuleSelect} />
      )}
    </div>
  )
}

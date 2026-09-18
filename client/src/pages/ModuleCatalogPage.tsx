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

  if (isLoading) return <p>Loading modules...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Modules</h1>
      <ModuleCatalog modules={modules} onModuleSelect={handleModuleSelect} />
    </div>
  )
}

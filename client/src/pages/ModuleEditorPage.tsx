import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InputField from '../components/InputField'
import { fetchModules } from '../features/module/model/api'
import type { ModuleSummary } from '../features/module/model/ModuleSummary'
import ErrorState from '../components/ErrorState'

export default function ModuleEditorPage() {
  const { moduleId } = useParams()
  const [currentModule, setCurrentModule] = useState<ModuleSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!moduleId) return

    fetchModules()
      .then((modules) => {
        setCurrentModule(
          modules.find((module) => module.id === moduleId) ?? null,
        )
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }, [moduleId])

  if (isLoading) return <p className="text-body">Loading module...</p>

  if (hasError) {
    return <ErrorState message="We couldn't load this module right now." />
  }

  if (!currentModule) {
    return <p className="text-body">That module could not be found.</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-display">Edit module</h1>

      <InputField id="title" label="Title" defaultValue={currentModule.title} />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InputField from '../components/InputField'
import { fetchModules } from '../features/module/model/api'
import type { ModuleSummary } from '../features/module/model/ModuleSummary'
import ErrorState from '../components/ErrorState'
import { useForm } from 'react-hook-form'

type ModuleEditorFormData = {
  title: string
  description: string
  period: string
  theme: string
}

export default function ModuleEditorPage() {
  const { moduleId } = useParams()
  const [currentModule, setCurrentModule] = useState<ModuleSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [view, setView] = useState<'edit' | 'preview'>('edit')
  const { register, reset, watch } = useForm<ModuleEditorFormData>({
    defaultValues: {
      title: '',
      description: '',
      period: '',
      theme: '',
    },
  })
  const formValues = watch()
  useEffect(() => {
    if (!moduleId) return

    fetchModules()
      .then((modules) => {
        const module =
          modules.find((oneModule) => oneModule.id === moduleId) ?? null

        setCurrentModule(module)

        if (module) {
          reset({
            title: module.title,
            description: module.description,
            period: module.period ?? '',
            theme: module.theme ?? '',
          })
        }
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }, [moduleId, reset])

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

      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setView('edit')}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setView('preview')}
        >
          Preview
        </button>
      </div>

      {view === 'edit' && (
        <form className="space-y-4">
          <InputField id="title" label="Title" {...register('title')} />

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">
              <label htmlFor="description">Description</label>
            </legend>

            <textarea
              id="description"
              className="textarea w-full"
              {...register('description')}
            />
          </fieldset>

          <InputField id="period" label="Period" {...register('period')} />

          <InputField id="theme" label="Theme" {...register('theme')} />
        </form>
      )}
      {view === 'preview' && (
        <section className="space-y-4">
          <h2 className="text-heading">{formValues.title}</h2>

          <p className="text-body text-base-content/70">
            {formValues.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {formValues.period && (
              <span className="badge badge-outline">{formValues.period}</span>
            )}

            {formValues.theme && (
              <span className="badge badge-outline">{formValues.theme}</span>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

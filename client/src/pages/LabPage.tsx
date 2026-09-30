import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ActivityWorkspace from '../features/activities/ActivityWorkspace'
import { fetchLab } from '../features/lab/model/api'
import type { Lab } from '../features/lab/model/Lab'

export default function LabPage() {
  const { moduleId } = useParams()
  const [lab, setLab] = useState<Lab | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLabComplete, setIsLabComplete] = useState(false)

  useEffect(() => {
    if (!moduleId) return

    fetchLab(moduleId)
      .then((labData) => setLab(labData))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Unable to load lab.'),
      )
      .finally(() => setIsLoading(false))
  }, [moduleId])

  function handleLabComplete() {
    setIsLabComplete(true)
  }

  if (isLoading) return <p className="text-body">Loading lab...</p>
  if (error) return <p className="text-body">{error}</p>
  if (!lab) return <p className="text-body">That lab could not be found.</p>

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Link to={`/modules/${moduleId}`} className="link link-primary">
          Back to the module
        </Link>
        <p className="text-small uppercase tracking-wide text-base-content/70">
          Module lab
        </p>
        <h1 className="text-display">{lab.title}</h1>
        <p className="max-w-prose text-body leading-relaxed">
          {lab.description}
        </p>
      </header>

      <div className="border-t border-base-300 pt-8">
        <ActivityWorkspace
          activities={lab.activities}
          onComplete={handleLabComplete}
        />
      </div>

      {isLabComplete && (
        <p role="status" className="text-success">
          Lab complete.
        </p>
      )}
    </div>
  )
}

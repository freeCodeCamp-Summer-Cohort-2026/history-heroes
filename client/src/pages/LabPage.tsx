import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ActivityWorkspace from '../features/activities/ActivityWorkspace'
import ButtonLink from '../components/ButtonLink'
import { fetchLab } from '../features/lab/model/api'
import type { Lab } from '../features/lab/model/Lab'
import {
  getLabCompletion,
  recordLabCompletion,
} from '../features/progress/model/api'

export default function LabPage() {
  const { moduleId } = useParams()
  const [lab, setLab] = useState<Lab | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLabComplete, setIsLabComplete] = useState(false)
  const completionRequestStarted = useRef(false)

  useEffect(() => {
    if (!moduleId) return
    let isActive = true

    fetchLab(moduleId)
      .then(async (labData) => {
        if (!isActive) return
        setLab(labData)

        try {
          const completion = await getLabCompletion(labData.id)
          if (!isActive) return
          if (completion && typeof completion.completedAt === 'string') {
            setIsLabComplete(true)
            completionRequestStarted.current = true
          }
        } catch {
          // If lab completion cannot be fetched, continue with uncompleted state
        }
      })
      .catch((err) => {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Unable to load lab.')
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [moduleId])

  async function handleLabComplete() {
    setIsLabComplete(true)
    if (completionRequestStarted.current || !lab) {
      return
    }

    completionRequestStarted.current = true

    try {
      await recordLabCompletion(lab.id)
    } catch {
      completionRequestStarted.current = false
    }
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
        <section
          aria-label="Lab completion"
          className="space-y-4 border-t border-base-300 pt-8"
        >
          <p role="status" className="text-success font-medium">
            Lab complete.
          </p>
          <div>
            <ButtonLink to={`/modules/${moduleId}`}>Back to module</ButtonLink>
          </div>
        </section>
      )}
    </div>
  )
}

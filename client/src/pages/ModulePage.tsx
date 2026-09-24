import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LessonListItem from '../components/LessonListItem'
import ProgressIndicator from '../components/ProgressIndicator'
import { fetchModules } from '../features/module/model/api'
import type { ModuleSummary } from '../features/module/model/ModuleSummary'
import { fetchLessons } from '../features/lesson/model/api'
import type { Lesson } from '../features/lesson/model/Lesson'
import {
  getLessonAvailability,
  orderLessons,
} from '../features/lesson/progression'
import { fetchLessonCompletions } from '../features/progress/model/api'

export default function ModulePage() {
  const { moduleId } = useParams()

  const [currentModule, setCurrentModule] = useState<ModuleSummary | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!moduleId) return

    Promise.all([
      fetchModules(),
      fetchLessons(moduleId),
      fetchLessonCompletions(),
    ])
      .then(([moduleData, lessonData, completionData]) => {
        setCurrentModule(
          moduleData.find((oneModule) => oneModule.id === moduleId) ?? null,
        )
        setLessons(lessonData)
        setCompletedLessonIds(
          new Set(completionData.map((completion) => completion.lessonId)),
        )
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Unable to load module.'),
      )
      .finally(() => setIsLoading(false))
  }, [moduleId])

  if (isLoading) return <p className="text-body">Loading module...</p>
  if (error) return <p className="text-body">{error}</p>
  if (!currentModule) {
    return <p className="text-body">That module could not be found.</p>
  }

  const orderedLessons = orderLessons(lessons)
  const completedLessonCount = orderedLessons.filter(
    (lesson) =>
      getLessonAvailability(orderedLessons, completedLessonIds, lesson.id) ===
      'completed',
  ).length

  return (
    <div className="space-y-8">
      <header className="spacec-y-3">
        <h1 className="text-display">{currentModule.title}</h1>
        <p className="text-body text-base-content/70">
          {currentModule.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {currentModule.period && (
            <span className="badge badge-outline">{currentModule.period}</span>
          )}
          {currentModule.theme && (
            <span className="badge badge-outline">{currentModule.theme}</span>
          )}
        </div>
      </header>
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-heading">Lessons</h2>
          <ProgressIndicator
            current={completedLessonCount}
            total={orderedLessons.length}
            label="Lessons completed"
          />
        </div>
        {orderedLessons.length === 0 ? (
          <p className="text-body">This module has no lessons yet.</p>
        ) : (
          <ol className="space-y-3">
            {orderedLessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonListItem
                  lesson={lesson}
                  state={getLessonAvailability(
                    orderedLessons,
                    completedLessonIds,
                    lesson.id,
                  )}
                />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="module-lab-heading" className="space-y-4">
        <h2 id="module-lab-heading" className="text-heading">
          Lab
        </h2>
        <Link
          to={`/modules/${moduleId}/lab`}
          className="flex w-full items-center justify-between gap-4 border border-base-300 bg-base-100 p-4 transition hover:bg-base-200"
        >
          <span>
            <span className="block text-subheading font-semibold">
              Module lab
            </span>
            <span className="mt-2 block text-caption uppercase tracking-wide">
              Always open
            </span>
          </span>
          <span className="text-lg font-bold" aria-hidden="true">
            →
          </span>
        </Link>
      </section>
    </div>
  )
}

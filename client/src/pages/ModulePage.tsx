import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LessonListItem from '../components/LessonListItem'
import ProgressIndicator from '../components/ProgressIndicator'
import { fetchModules } from '../features/module/model/api'
import type { ModuleSummary } from '../features/module/model/ModuleSummary'
import { fetchLessons } from '../features/lesson/model/api'
import type { Lesson } from '../features/lesson/model/Lesson'
import ErrorState from '../components/ErrorState'

export default function ModulePage() {
  const { moduleId } = useParams()

  const [currentModule, setCurrentModule] = useState<ModuleSummary | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!moduleId) return

    Promise.all([fetchModules(), fetchLessons(moduleId)])
      .then(([moduleData, lessonData]) => {
        setCurrentModule(
          moduleData.find((oneModule) => oneModule.id === moduleId) ?? null,
        )
        setLessons(lessonData)
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

  const orderedLessons = [...lessons].sort(
    (first, second) => first.orderIndex - second.orderIndex,
  )

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
            current={0}
            total={orderedLessons.length}
            label="Lessons completed"
          />
        </div>
        {orderedLessons.length === 0 ? (
          <p className="text-body">This module has no lessons yet.</p>
        ) : (
          <ol className="space-y-3">
            {orderedLessons.map((lesson, index) => (
              <li key={lesson.id}>
                {/* temporary: the first lesson is open and the rest are locked until #52 lands */}
                <LessonListItem
                  lesson={lesson}
                  state={index === 0 ? 'unlocked' : 'locked'}
                />
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

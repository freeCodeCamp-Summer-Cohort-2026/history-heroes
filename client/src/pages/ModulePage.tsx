import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import LessonListItem from '../components/LessonListItem'
import ProgressIndicator from '../components/ProgressIndicator'
import ButtonLink from '../components/ButtonLink'
import { fetchModules } from '../features/module/model/api'
import type { ModuleSummary } from '../features/module/model/ModuleSummary'
import { fetchLessons } from '../features/lesson/model/api'
import type { Lesson } from '../features/lesson/model/Lesson'
import ErrorState from '../components/ErrorState'
import {
  getLessonAvailability,
  getNextIncompleteItem,
  isModuleFullyCompleted,
  orderLessons,
} from '../features/lesson/progression'
import {
  fetchLessonCompletions,
  getLabCompletion,
} from '../features/progress/model/api'
import { fetchLab } from '../features/lab/model/api'
import type { Lab } from '../features/lab/model/Lab'
import { useDocumentTitle } from '../utils/useDocumentTitle'

export default function ModulePage() {
  const { moduleId } = useParams()

  const [currentModule, setCurrentModule] = useState<ModuleSummary | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(),
  )
  const [lab, setLab] = useState<Lab | null>(null)
  const [isLabCompleted, setIsLabCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!moduleId) return
    let isActive = true

    Promise.all([
      fetchModules(),
      fetchLessons(moduleId),
      fetchLessonCompletions(),
    ])
      .then(([moduleData, lessonData, completionData]) => {
        if (!isActive) return
        setCurrentModule(
          moduleData.find((oneModule) => oneModule.id === moduleId) ?? null,
        )
        setLessons(lessonData)
        setCompletedLessonIds(
          new Set(completionData.map((completion) => completion.lessonId)),
        )
      })
      .catch(() => {
        if (isActive) setHasError(true)
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    fetchLab(moduleId)
      .then(async (labData) => {
        if (!isActive || !labData) return
        setLab(labData)
        try {
          const labCompletion = await getLabCompletion(labData.id)
          if (
            isActive &&
            labCompletion &&
            typeof labCompletion.completedAt === 'string'
          ) {
            setIsLabCompleted(true)
          }
        } catch {
          // Ignore lab completion fetch error
        }
      })
      .catch(() => {
        // Module might not have a lab
      })

    return () => {
      isActive = false
    }
  }, [moduleId])

  useDocumentTitle(currentModule?.title)

  if (isLoading) return <p className="text-body">Loading module...</p>
  if (hasError) {
    return <ErrorState message="We couldn't load this module right now." />
  }
  if (!currentModule) {
    return <p className="text-body">That module could not be found.</p>
  }

  const orderedLessons = orderLessons(lessons)
  const completedLessonCount = orderedLessons.filter(
    (lesson) =>
      getLessonAvailability(orderedLessons, completedLessonIds, lesson.id) ===
      'completed',
  ).length

  const isModuleComplete = isModuleFullyCompleted({
    lessons,
    completedLessonIds,
    hasLab: Boolean(lab),
    isLabCompleted,
  })

  const nextItem = currentModule
    ? getNextIncompleteItem({
        moduleId: currentModule.id,
        lessons,
        completedLessonIds,
        hasLab: Boolean(lab),
        isLabCompleted,
      })
    : null

  return (
    <div className="space-y-8">
      <header className="space-y-3">
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

      {isModuleComplete ? (
        <section
          role="status"
          aria-label="Module completion status"
          className="rounded-lg border border-success/30 bg-success/5 p-4 text-success"
        >
          <div className="flex items-center gap-2">
            <Check className="size-5 shrink-0" aria-hidden="true" />
            <span className="text-body font-semibold">Module completed!</span>
          </div>
          <p className="mt-1 text-small opacity-80">
            You have completed all lessons and the lab in this module.
          </p>
        </section>
      ) : nextItem ? (
        <div>
          <ButtonLink to={nextItem.path} variant="primary">
            {completedLessonIds.size === 0 && !isLabCompleted
              ? 'Start module'
              : 'Resume module'}
          </ButtonLink>
        </div>
      ) : null}

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
          className={`flex w-full items-center justify-between gap-4 border border-base-300 p-4 transition ${
            isLabCompleted
              ? 'bg-success/5 border-success/30 hover:bg-base-200'
              : 'bg-base-100 hover:bg-base-200'
          }`}
        >
          <span>
            <span className="block text-subheading font-semibold">
              Module lab
            </span>
            <span className="mt-2 block text-caption uppercase tracking-wide">
              {isLabCompleted ? 'Completed' : 'Always open'}
            </span>
          </span>
          <span aria-hidden="true">
            {isLabCompleted ? (
              <Check className="size-5" />
            ) : (
              <ArrowRight className="size-5" />
            )}
          </span>
        </Link>
      </section>
    </div>
  )
}

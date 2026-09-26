import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  fetchLessons,
  fetchLessonActivities,
} from '../features/lesson/model/api'
import { fetchModules } from '../features/module/model/api'
import type { Activity } from '../features/activities/types'
import ActivityWorkspace from '../features/activities/ActivityWorkspace'
import type { Lesson } from '../features/lesson/model/Lesson'
import {
  getLessonAvailability,
  getNextLesson,
  orderLessons,
} from '../features/lesson/progression'
import {
  fetchLessonCompletions,
  recordLessonCompletion,
} from '../features/progress/model/api'
import ButtonLink from '../components/ButtonLink'
import ErrorBoundary from '../components/ErrorBoundary'
import { useDocumentTitle } from '../utils/useDocumentTitle'

export default function LessonPage() {
  const { moduleId, lessonId } = useParams()

  if (!moduleId || !lessonId) {
    return <p>That lesson could not be found.</p>
  }

  return (
    <LessonPageContent
      key={`${moduleId}:${lessonId}`}
      moduleId={moduleId}
      lessonId={lessonId}
    />
  )
}

function LessonPageContent({
  moduleId,
  lessonId,
}: {
  moduleId: string
  lessonId: string
}) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [activityError, setActivityError] = useState<string | null>(null)
  const [moduleTitle, setModuleTitle] = useState<string | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(),
  )
  const completionRequestStarted = useRef(false)

  useEffect(() => {
    let isActive = true

    Promise.all([fetchLessons(moduleId), fetchLessonCompletions()])
      .then(([lessonData, completionData]) => {
        if (!isActive) return
        setLessons(lessonData)
        setCompletedLessonIds(
          new Set(completionData.map((completion) => completion.lessonId)),
        )
      })
      .catch((err) => {
        if (!isActive) return
        setError(err instanceof Error ? err.message : 'Unable to load lesson.')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    fetchLessonActivities(lessonId)
      .then((activityData) => {
        if (isActive) setActivities(activityData)
      })
      .catch(() => {
        if (isActive) {
          setActivityError(
            'The activities for this lesson could not be loaded.',
          )
        }
      })

    fetchModules()
      .then((moduleData) => {
        if (!isActive) return
        setModuleTitle(
          moduleData.find((oneModule) => oneModule.id === moduleId)?.title ??
            null,
        )
      })
      .catch(() => {
        if (isActive) setModuleTitle(null)
      })

    return () => {
      isActive = false
    }
  }, [moduleId, lessonId])

  async function handleLessonComplete() {
    if (completionRequestStarted.current || completedLessonIds.has(lessonId)) {
      return
    }

    completionRequestStarted.current = true

    try {
      const completion = await recordLessonCompletion(lessonId)
      setCompletedLessonIds((currentIds) => {
        const updatedIds = new Set(currentIds)
        updatedIds.add(completion.lessonId)
        return updatedIds
      })
    } catch {
      completionRequestStarted.current = false
    }
  }

  const orderedLessons = orderLessons(lessons)
  const lessonIndex = orderedLessons.findIndex(
    (oneLesson) => oneLesson.id === lessonId,
  )
  const lesson = orderedLessons[lessonIndex]
  const lessonAvailability = getLessonAvailability(
    orderedLessons,
    completedLessonIds,
    lessonId,
  )
  const isLessonCompleted = lessonAvailability === 'completed'
  const nextLesson = getNextLesson(orderedLessons, lessonId)
  const isNextLessonUnlocked =
    nextLesson !== null &&
    getLessonAvailability(orderedLessons, completedLessonIds, nextLesson.id) !==
      'locked'

  useDocumentTitle(lesson ? lesson.title : 'Loading...')

  if (isLoading) return <p>Loading lesson...</p>
  if (error) return <p>{error}</p>
  if (!lesson) return <p>That lesson could not be found.</p>
  if (lessonAvailability === 'locked') {
    return <Navigate to={`/modules/${moduleId}/locked`} replace />
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Link to={`/modules/${moduleId}`} className="link link-primary">
          Back to {moduleTitle ?? 'the module'}
        </Link>
        <p className="text-small uppercase tracking-wide text-base-content/70">
          Lesson {lessonIndex + 1} of {orderedLessons.length}
        </p>
        <h1 className="text-display">{lesson.title}</h1>
      </header>

      <section aria-label="Lesson text" className="max-w-prose space-y-4">
        {lesson.contents.split('\n\n').map((paragraph, index) => (
          <p className="text-body leading-relaxed" key={index}>
            {paragraph}
          </p>
        ))}
      </section>

      <div className="border-t border-base-300 pt-8">
        {activityError ? (
          <p className="text-body">{activityError}</p>
        ) : (
          <ErrorBoundary>
            <ActivityWorkspace
              activities={activities}
              onComplete={handleLessonComplete}
            />
          </ErrorBoundary>
        )}
      </div>

      {isLessonCompleted && (
        <section
          aria-label="Lesson completion"
          className="space-y-4 border-t border-base-300 pt-8"
        >
          <p role="status" className="text-success">
            Lesson completion saved.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {nextLesson && isNextLessonUnlocked && (
              <ButtonLink to={`/modules/${moduleId}/lessons/${nextLesson.id}`}>
                Next lesson: {nextLesson.title}
              </ButtonLink>
            )}
            <ButtonLink
              variant={
                nextLesson && isNextLessonUnlocked ? 'secondary' : 'primary'
              }
              to={`/modules/${moduleId}`}
            >
              Back to module
            </ButtonLink>
          </div>
        </section>
      )}
    </div>
  )
}

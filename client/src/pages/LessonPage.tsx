import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  fetchLessons,
  fetchLessonActivities,
} from '../features/lesson/model/api'
import { fetchModules } from '../features/module/model/api'
import type { Activity } from '../features/activities/types'
import ActivityWorkspace from '../features/activities/ActivityWorkspace'
import type { Lesson } from '../features/lesson/model/Lesson'
import { recordLessonCompletion } from '../features/progress/model/api'
import ErrorState from '../components/ErrorState'

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
  const [hasError, setHasError] = useState(false)
  const [hasActivityError, setHasActivityError] = useState(false)
  const [moduleTitle, setModuleTitle] = useState<string | null>(null)
  const completionRequestStarted = useRef(false)
  const [isCompletionSaved, setIsCompletionSaved] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    fetchLessons(moduleId)
      .then((lessonData) => setLessons(lessonData))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))

    fetchLessonActivities(lessonId)
      .then((activityData) => setActivities(activityData))
      .catch(() => setHasActivityError(true))

    fetchModules()
      .then((moduleData) =>
        setModuleTitle(
          moduleData.find((oneModule) => oneModule.id === moduleId)?.title ??
            null,
        ),
      )
      .catch(() => setModuleTitle(null))
  }, [moduleId, lessonId])

  async function handleLessonComplete() {
    if (completionRequestStarted.current) return

    completionRequestStarted.current = true

    try {
      await recordLessonCompletion(lessonId)
      setIsCompletionSaved(true)
    } catch {
      completionRequestStarted.current = false
    }
  }

  const orderedLessons = [...lessons].sort(
    (first, second) => first.orderIndex - second.orderIndex,
  )
  const lessonIndex = orderedLessons.findIndex(
    (oneLesson) => oneLesson.id === lessonId,
  )
  const lesson = orderedLessons[lessonIndex]

  if (isLoading) return <p>Loading lesson...</p>
  if (hasError) {
    return <ErrorState message="We couldn't load this lesson right now." />
  }
  if (!lesson) return <p>That lesson could not be found.</p>

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
        {hasActivityError ? (
          <ErrorState message="We couldn't load the activities for this lesson." />
        ) : (
          <>
            <ActivityWorkspace
              activities={activities}
              onComplete={handleLessonComplete}
            />
            {isCompletionSaved && (
              <p role="status" className="mt-4 text-success">
                Lesson completion saved.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  fetchLessons,
  fetchLessonActivities,
} from '../features/lesson/model/api'
import { fetchModules } from '../features/module/model/api'
import type { Activity } from '../features/activities/types'
import ActivityWorkspace from '../features/activities/ActivityWorkspace'
import type { Lesson } from '../features/lesson/model/Lesson'

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

  useEffect(() => {
    fetchLessons(moduleId)
      .then((lessonData) => setLessons(lessonData))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Unable to load lesson.'),
      )
      .finally(() => setIsLoading(false))

    fetchLessonActivities(lessonId)
      .then((activityData) => setActivities(activityData))
      .catch(() =>
        setActivityError('The activities for this lesson could not be loaded.'),
      )

    fetchModules()
      .then((moduleData) =>
        setModuleTitle(
          moduleData.find((oneModule) => oneModule.id === moduleId)?.title ??
            null,
        ),
      )
      .catch(() => setModuleTitle(null))
  }, [moduleId, lessonId])

  const orderedLessons = [...lessons].sort(
    (first, second) => first.orderIndex - second.orderIndex,
  )
  const lessonIndex = orderedLessons.findIndex(
    (oneLesson) => oneLesson.id === lessonId,
  )
  const lesson = orderedLessons[lessonIndex]

  if (isLoading) return <p>Loading lesson...</p>
  if (error) return <p>{error}</p>
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
        {activityError ? (
          <p className="text-body">{activityError}</p>
        ) : (
          <ActivityWorkspace activities={activities} />
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  fetchLessons,
  fetchLessonActivities,
} from '../features/lesson/model/api'
import type { Activity } from '../features/activities/types'
import ActivityWorkspace from '../features/activities/ActivityWorkspace'
import type { Lesson } from '../features/lesson/model/Lesson'

export default function LessonPage() {
  const { moduleId, lessonId } = useParams()

  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    if (!moduleId || !lessonId) return

    Promise.all([fetchLessons(moduleId), fetchLessonActivities(lessonId)])
      .then(([lessonData, activityData]) => {
        setLessons(lessonData)
        setActivities(activityData)
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Unable to load lesson.'),
      )
      .finally(() => setIsLoading(false))
  }, [moduleId, lessonId])

  const lesson = lessons.find((oneLesson) => oneLesson.id === lessonId)

  if (isLoading) return <p>Loading lesson...</p>
  if (error) return <p>{error}</p>
  if (!lesson) return <p>That lesson could not be found.</p>

  return (
    <div>
      <h1>{lesson.title}</h1>
      {lesson.contents.split('\n\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <ActivityWorkspace activities={activities} />
    </div>
  )
}

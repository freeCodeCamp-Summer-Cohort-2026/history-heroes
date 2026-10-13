import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import InputField from '../components/InputField'
import ErrorState from '../components/ErrorState'
import {
  fetchLessonActivities,
  fetchLessons,
  updateLesson,
} from '../features/lesson/model/api'
import type { Lesson } from '../features/lesson/model/Lesson'
import type { Activity } from '../features/activities/types'

type LessonEditorFormData = {
  title: string
  description: string
  contents: string
}

export default function LessonEditorPage() {
  const { moduleId, lessonId } = useParams()
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [view, setView] = useState<'edit' | 'activities' | 'preview'>('edit')
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(false)
  const [hasActivitiesError, setHasActivitiesError] = useState(false)
  const [hasSaveError, setHasSaveError] = useState(false)
  const { register, reset, control, handleSubmit } =
    useForm<LessonEditorFormData>({
      defaultValues: {
        title: '',
        description: '',
        contents: '',
      },
    })

  const formValues = useWatch({ control })

  useEffect(() => {
    if (!moduleId || !lessonId) return

    fetchLessons(moduleId)
      .then((lessons) => {
        const lesson =
          lessons.find((oneLesson) => oneLesson.id === lessonId) ?? null

        setCurrentLesson(lesson)

        if (lesson) {
          reset({
            title: lesson.title,
            description: lesson.description,
            contents: lesson.contents,
          })
        }
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false))
  }, [moduleId, lessonId, reset])

  const handleSave = async (data: LessonEditorFormData) => {
    if (!lessonId) return

    setHasSaveError(false)

    try {
      const updatedLesson = await updateLesson(lessonId, data)

      setCurrentLesson(updatedLesson)

      reset({
        title: updatedLesson.title,
        description: updatedLesson.description,
        contents: updatedLesson.contents,
      })
    } catch {
      setHasSaveError(true)
    }
  }

  const handleActivitiesView = async () => {
    if (!lessonId) return

    setView('activities')
    setIsLoadingActivities(true)
    setHasActivitiesError(false)

    try {
      const lessonActivities = await fetchLessonActivities(lessonId)
      setActivities(lessonActivities)
    } catch {
      setHasActivitiesError(true)
    } finally {
      setIsLoadingActivities(false)
    }
  }

  if (!moduleId || !lessonId) {
    return <p className="text-body">That lesson could not be found.</p>
  }

  if (isLoading) {
    return <p className="text-body">Loading lesson...</p>
  }

  if (hasError) {
    return <ErrorState message="We couldn't load this lesson right now." />
  }

  if (!currentLesson) {
    return <p className="text-body">That lesson could not be found.</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-display">Edit lesson</h1>

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
          onClick={handleActivitiesView}
        >
          Activities
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
        <form className="space-y-4" onSubmit={handleSubmit(handleSave)}>
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

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">
              <label htmlFor="contents">Contents</label>
            </legend>

            <textarea
              id="contents"
              className="textarea min-h-48 w-full"
              {...register('contents')}
            />
          </fieldset>

          {hasSaveError && (
            <ErrorState message="We couldn't save this lesson right now." />
          )}

          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </form>
      )}

      {view === 'activities' && (
        <section className="space-y-4">
          <h2 className="text-heading">Activities</h2>

          {isLoadingActivities ? (
            <p className="text-body">Loading activities...</p>
          ) : hasActivitiesError ? (
            <ErrorState message="We couldn't load the activities for this lesson." />
          ) : activities.length === 0 ? (
            <p className="text-body">This lesson has no activities.</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="rounded-box border border-base-300 p-4"
                >
                  <h3 className="text-subheading font-semibold">
                    {activity.title}
                  </h3>

                  <p className="text-small text-base-content/70">
                    {activity.type}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {view === 'preview' && (
        <section className="space-y-4">
          <h2 className="text-heading">{formValues.title}</h2>

          <p className="text-body text-base-content/70">
            {formValues.description}
          </p>

          <div className="max-w-prose space-y-4">
            {formValues.contents?.split('\n\n').map((paragraph) => (
              <p className="text-body leading-relaxed" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

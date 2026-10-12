import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import InputField from '../components/InputField'
import ErrorState from '../components/ErrorState'
import { fetchLessons } from '../features/lesson/model/api'
import type { Lesson } from '../features/lesson/model/Lesson'

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

  const { register, reset } = useForm<LessonEditorFormData>({
    defaultValues: {
      title: '',
      description: '',
      contents: '',
    },
  })

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

      <form className="space-y-4">
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
      </form>
    </div>
  )
}

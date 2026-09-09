import { useParams } from 'react-router-dom'

export default function LessonPage() {
  const { moduleId, lessonId } = useParams()

  return (
    <div>
      <h1>Lesson: {lessonId}</h1>
      <p>From Module: {moduleId}</p>
    </div>
  )
}

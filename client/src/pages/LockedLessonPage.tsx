import { useParams } from 'react-router-dom'
import ButtonLink from '../components/ButtonLink'

export default function LockedLessonPage() {
  const { moduleId } = useParams()

  return (
    <div className="space-y-6">
      <h1 className="text-display">This lesson is locked</h1>
      <p className="text-body">
        Finish the lessons before this one to unlock it.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink to={`/modules/${moduleId}`}>Back to the module</ButtonLink>
        <ButtonLink variant="secondary" to="/">
          Back to all modules
        </ButtonLink>
      </div>
    </div>
  )
}

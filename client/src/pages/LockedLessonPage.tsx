import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'

export default function LockedLessonPage() {
  const { moduleId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <h1 className="text-display">This lesson is locked</h1>
      <p className="text-body">
        Finish the lessons before this one to unlock it.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => navigate(`/modules/${moduleId}`)}>
          Back to the module
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to all modules
        </Button>
      </div>
    </div>
  )
}

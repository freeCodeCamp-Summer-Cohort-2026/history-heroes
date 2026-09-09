import { useParams } from 'react-router-dom'

export default function ModulePage() {
  const { moduleId } = useParams()

  return <h1>Module: {moduleId}</h1>
}

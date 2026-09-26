import type { Lab } from './Lab'

export async function fetchLab(moduleId: string): Promise<Lab> {
  const response = await fetch(`/api/v1/labs/${moduleId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch lab: ${response.status}`)
  }

  return response.json()
}

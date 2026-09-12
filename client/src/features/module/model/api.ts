import type { ModuleSummary } from './ModuleSummary'

const MODULES_URL = '/api/v1/modules'

export async function fetchModules(): Promise<ModuleSummary[]> {
  const response = await fetch(MODULES_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch modules: ${response.status}`)
  }

  return response.json()
}

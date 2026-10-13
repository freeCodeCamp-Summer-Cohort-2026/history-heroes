import type { ModuleSummary } from './ModuleSummary'

const MODULES_URL = '/api/v1/modules'

export type UpdateModuleInput = Partial<
  Pick<ModuleSummary, 'title' | 'description' | 'period' | 'theme'>
>

export async function fetchModules(): Promise<ModuleSummary[]> {
  const response = await fetch(MODULES_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch modules: ${response.status}`)
  }

  return response.json()
}

export async function updateModule(
  moduleId: string,
  updates: UpdateModuleInput,
): Promise<ModuleSummary> {
  const response = await fetch(`${MODULES_URL}/${moduleId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error(`Failed to update module: ${response.status}`)
  }

  return response.json()
}

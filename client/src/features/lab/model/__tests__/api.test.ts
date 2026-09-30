import { fetchLab } from '../api'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('fetches the lab for a module', async () => {
  const lab = {
    id: 'first-lab',
    moduleId: 'first-module',
    title: 'Test Lab',
    description: 'Complete the lab.',
    activities: [],
  }
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => lab,
  })
  vi.stubGlobal('fetch', fetchMock)

  await expect(fetchLab('first-module')).resolves.toEqual(lab)
  expect(fetchMock).toHaveBeenCalledWith('/api/v1/labs/first-module')
})

test('throws when the lab cannot be loaded', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }),
  )

  await expect(fetchLab('missing-module')).rejects.toThrow(
    'Failed to fetch lab: 404',
  )
})

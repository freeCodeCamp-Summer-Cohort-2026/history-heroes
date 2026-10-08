import { updateModule } from '../api'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('updates a module and returns the updated module', async () => {
  const updates = {
    title: 'Updated Seven Wonders',
    description: 'Updated description',
    period: 'Ancient',
    theme: 'Architecture',
  }

  const updatedModule = {
    id: 'seven-wonders',
    ...updates,
  }

  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => updatedModule,
  })

  vi.stubGlobal('fetch', fetchMock)

  await expect(updateModule('seven-wonders', updates)).resolves.toEqual(
    updatedModule,
  )

  expect(fetchMock).toHaveBeenCalledWith('/api/v1/modules/seven-wonders', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })
})

test('throws when the module cannot be updated', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    }),
  )
  await expect(
    updateModule('seven-wonders', {
      title: 'Updated title',
    }),
  ).rejects.toThrow('Failed to update module: 400')
})

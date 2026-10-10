import { updateLesson } from '../api'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('updates a lesson and returns the updated lesson', async () => {
  const updates = {
    title: 'Updated Great Pyramid',
    description: 'Updated description',
    contents: 'Updated lesson contents',
  }

  const updatedLesson = {
    id: 'great-pyramid',
    moduleId: 'seven-wonders',
    orderIndex: 1,
    activityIds: [],
    ...updates,
  }

  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => updatedLesson,
  })

  vi.stubGlobal('fetch', fetchMock)

  await expect(updateLesson('great-pyramid', updates)).resolves.toEqual(
    updatedLesson,
  )

  expect(fetchMock).toHaveBeenCalledWith('/api/v1/lessons/great-pyramid', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })
})

test('throws when the lesson cannot be updated', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    }),
  )

  await expect(
    updateLesson('great-pyramid', {
      title: 'Update title',
    }),
  ).rejects.toThrow('Failed to update lesson: 400')
})

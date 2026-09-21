import { recordLessonCompletion } from '../api'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('posts the completed lesson and returns the saved completion', async () => {
  const completion = {
    lessonId: 'great-pyramid',
    completedAt: '2026-09-20T12:00:00.000Z',
  }
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => completion,
  })
  vi.stubGlobal('fetch', fetchMock)

  await expect(recordLessonCompletion('great-pyramid')).resolves.toEqual(
    completion,
  )
  expect(fetchMock).toHaveBeenCalledTimes(1)
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/v1/progress/lessons/great-pyramid',
    { method: 'POST' },
  )
})

test('throws when lesson completion cannot be saved', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }),
  )

  await expect(recordLessonCompletion('great-pyramid')).rejects.toThrow(
    'Failed to save lesson completion: 500',
  )
})

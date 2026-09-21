import {
  getLabCompletion,
  recordLabCompletion,
  recordLessonCompletion,
} from '../api'

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

test('posts the completed lab and returns the saved completion', async () => {
  const completion = {
    labId: 'great-pyramid-lab',
    completedAt: '2026-09-21T14:00:00.000Z',
  }
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => completion,
  })
  vi.stubGlobal('fetch', fetchMock)

  await expect(recordLabCompletion('great-pyramid-lab')).resolves.toEqual(
    completion,
  )
  expect(fetchMock).toHaveBeenCalledTimes(1)
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/v1/progress/labs/great-pyramid-lab',
    { method: 'POST' },
  )
})

test('throws when lab completion cannot be saved', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }),
  )

  await expect(recordLabCompletion('great-pyramid-lab')).rejects.toThrow(
    'Failed to save lab completion: 500',
  )
})

test('returns lab completion when found', async () => {
  const completion = {
    labId: 'great-pyramid-lab',
    completedAt: '2026-09-21T14:00:00.000Z',
  }
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => completion,
  })
  vi.stubGlobal('fetch', fetchMock)

  await expect(getLabCompletion('great-pyramid-lab')).resolves.toEqual(
    completion,
  )
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/v1/progress/labs/great-pyramid-lab',
  )
})

test('returns null when lab completion is 404', async () => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
  })
  vi.stubGlobal('fetch', fetchMock)

  await expect(getLabCompletion('nonexistent-lab')).resolves.toBeNull()
})

test('throws when getLabCompletion encounters error other than 404', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }),
  )

  await expect(getLabCompletion('great-pyramid-lab')).rejects.toThrow(
    'Failed to get lab completion: 500',
  )
})

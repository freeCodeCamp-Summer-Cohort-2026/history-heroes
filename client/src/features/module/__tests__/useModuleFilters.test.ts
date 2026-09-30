import { renderHook } from '@testing-library/react'
import { act } from '@testing-library/react'
import useModuleFilters from '../useModuleFilters'
import type { ModuleSummary } from '../model/ModuleSummary'

test('displays modules period list', () => {
  const mockModules: ModuleSummary[] = [
    {
      id: 'mod-001',
      title: 'Introduction to Web Development',
      description:
        'Covers the basics of HTML, CSS, and JavaScript for beginners.',
      period: 'Spring 2026',
      theme: 'Frontend Foundations',
    },
    {
      id: 'mod-002',
      title: 'Database Systems',
      description:
        'Explores relational databases, SQL queries, and normalization concepts.',
      period: 'Summer 2026',
      theme: 'Backend Essentials',
    },
    {
      id: 'mod-003',
      title: 'DevOps with Docker',
      description:
        'Focuses on containerization, orchestration, and deployment workflows.',
      period: 'Fall 2026',
      theme: 'DevOps Practices',
    },
  ]

  const { result } = renderHook(() => useModuleFilters(mockModules))

  act(() => {
    result.current.setSelectedPeriod('Fall 2026')
  })
  expect(result.current.selectedPeriod).toBe('Fall 2026')
})

test('displays modules theme list', () => {
  const mockModules: ModuleSummary[] = [
    {
      id: 'mod-001',
      title: 'Introduction to Web Development',
      description:
        'Covers the basics of HTML, CSS, and JavaScript for beginners.',
      period: 'Spring 2026',
      theme: 'Frontend Foundations',
    },
    {
      id: 'mod-002',
      title: 'Database Systems',
      description:
        'Explores relational databases, SQL queries, and normalization concepts.',
      period: 'Summer 2026',
      theme: 'Backend Essentials',
    },
    {
      id: 'mod-003',
      title: 'DevOps with Docker',
      description:
        'Focuses on containerization, orchestration, and deployment workflows.',
      period: 'Fall 2026',
      theme: 'DevOps Practices',
    },
  ]

  const { result } = renderHook(() => useModuleFilters(mockModules))

  act(() => {
    result.current.setSelectedTheme('DevOps Practices')
  })
  expect(result.current.selectedTheme).toBe('DevOps Practices')
})

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

  expect(result.current.periodsList).toStrictEqual([
    'All',
    'Spring 2026',
    'Summer 2026',
    'Fall 2026',
  ])
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

  expect(result.current.themesList).toStrictEqual([
    'All',
    'Frontend Foundations',
    'Backend Essentials',
    'DevOps Practices',
  ])
})

test('displays all modules', () => {
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
    result.current.setSelectedTheme('All')
  })
  expect(result.current.selectedTheme).toBe('All')
  expect(result.current.filteredModules).toHaveLength(3)
})

test('filtering by period', () => {
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
  const title = result.current.filteredModules.map((obj) => obj.title)

  expect(result.current.selectedPeriod).toBe('Fall 2026')
  expect(result.current.filteredModules).toHaveLength(1)
  expect(title).toContain('DevOps with Docker')
})

test('filtering by theme', () => {
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
    result.current.setSelectedTheme('Backend Essentials')
  })
  const title = result.current.filteredModules.map((obj) => obj.title)

  expect(result.current.selectedTheme).toBe('Backend Essentials')
  expect(result.current.filteredModules).toHaveLength(1)
  expect(title).toContain('Database Systems')
})

test('no matching result', () => {
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
    result.current.setSelectedTheme('Backend Essentials')
    result.current.setSelectedPeriod('Fall 2026')
  })
  expect(result.current.selectedTheme).toBe('Backend Essentials')
  expect(result.current.selectedPeriod).toBe('Fall 2026')
  expect(result.current.filteredModules).toHaveLength(0)
})

import type { RouteObject } from 'react-router-dom'
import LessonPage from './pages/LessonPage'
import ModuleCatalogPage from './pages/ModuleCatalogPage'
import ModulePage from './pages/ModulePage'
import NotFoundPage from './pages/NotFoundPage'
import Layout from './components/Layout'
import ComponentShowcase from './components/ComponentShowcase'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <ModuleCatalogPage /> },
      { path: '/modules/:moduleId', element: <ModulePage /> },
      { path: '/modules/:moduleId/lessons/:lessonId', element: <LessonPage /> },
      { path: 'components', element: <ComponentShowcase /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

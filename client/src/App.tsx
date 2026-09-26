import type { RouteObject } from 'react-router-dom'
import LessonPage from './pages/LessonPage'
import ModuleCatalogPage from './pages/ModuleCatalogPage'
import ModulePage from './pages/ModulePage'
import LockedLessonPage from './pages/LockedLessonPage'
import NotFoundPage from './pages/NotFoundPage'
import LabPage from './pages/LabPage'
import Layout from './components/Layout'
import ComponentShowcase from './components/ComponentShowcase'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <ModuleCatalogPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/modules/:moduleId', element: <ModulePage /> },
      { path: '/modules/:moduleId/lessons/:lessonId', element: <LessonPage /> },
      { path: '/modules/:moduleId/locked', element: <LockedLessonPage /> },
      { path: '/modules/:moduleId/lab', element: <LabPage /> },
      { path: 'components', element: <ComponentShowcase /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

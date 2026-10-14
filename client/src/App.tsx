import type { RouteObject } from 'react-router-dom'
import ComponentShowcase from './components/ComponentShowcase'
import ContentAuthorGuard from './components/ContentAuthorGuard'
import Layout from './components/Layout'
import LabPage from './pages/LabPage'
import LessonPage from './pages/LessonPage'
import LockedLessonPage from './pages/LockedLessonPage'
import LoginPage from './pages/LoginPage'
import ModuleCatalogPage from './pages/ModuleCatalogPage'
import ModuleEditorPage from './pages/ModuleEditorPage'
import ModulePage from './pages/ModulePage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <ModuleCatalogPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/modules/:moduleId', element: <ModulePage /> },
      {
        path: '/modules/:moduleId/edit',
        element: (
          <ContentAuthorGuard>
            <ModuleEditorPage />
          </ContentAuthorGuard>
        ),
      },
      { path: '/modules/:moduleId/lessons/:lessonId', element: <LessonPage /> },
      { path: '/modules/:moduleId/locked', element: <LockedLessonPage /> },
      { path: '/modules/:moduleId/lab', element: <LabPage /> },
      { path: 'components', element: <ComponentShowcase /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { routes } from './App.tsx'
import './index.css'
import { enableDragDropTouch } from '@dragdroptouch/drag-drop-touch'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './state/auth/auth-provider.tsx'

enableDragDropTouch()

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)

import { Routes, Route } from 'react-router-dom'
import LessonPage from './pages/LessonPage'
import ModuleCatalogPage from './pages/ModuleCatalogPage'
import ModulePage from './pages/ModulePage'
import NotFoundPage from './pages/NotFoundPage'
import Layout from './components/Layout'
import ComponentShowcase from './components/ComponentShowcase'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ModuleCatalogPage />} />
        <Route path="/modules/:moduleId" element={<ModulePage />} />
        <Route
          path="/modules/:moduleId/lessons/:lessonId"
          element={<LessonPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="components" element={<ComponentShowcase />} />
      </Route>
    </Routes>
  )
}

export default App

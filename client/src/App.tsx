import { Routes, Route } from 'react-router-dom'
import LessonPage from './pages/LessonPage'
import ModuleCatalogPage from './pages/ModuleCatalogPage'
import ModulePage from './pages/ModulePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ModuleCatalogPage />} />
      <Route path="/modules/:moduleId" element={<ModulePage />} />
      <Route
        path="/modules/:moduleId/lessons/:lessonId"
        element={<LessonPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App

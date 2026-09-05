import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TutorialList from './components/TutorialList'
import LessonView from './components/LessonView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tutorials" element={<TutorialList />} />
        <Route path="/lesson/:id" element={<LessonView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

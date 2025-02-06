import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { GNav } from './components/GNav/GNav'
import { GFooter } from './components/GFooter/GFooter'
import { Home } from './pages/Home'
import { Palette } from './pages/Palette'
import { Picker } from './pages/Picker'
import { About } from './pages/About'
import { Image } from './pages/Image/index'
import { NotFound } from './pages/NotFound'
import { palettes } from './data/data'
import { ToastContainer } from './components/Toast/Toast'
import { useToastStore } from './stores/toastStore'
import { useDocumentTitle } from './hooks/useDocumentTitle'

function App() {
  const toasts = useToastStore((state) => state.toasts);
  useDocumentTitle();

  return (
    <>
      <header><GNav /></header>
      <div className='content'>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/palette" element={<Palette palettes={palettes} />} />
            <Route path="/picker" element={<Picker />} />
            <Route path="/about" element={<About />} />
            <Route path="/image" element={<Image />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <footer>
          <GFooter />
        </footer>
      </div>
      <ToastContainer toasts={toasts} />
    </>
  )
}

export default App

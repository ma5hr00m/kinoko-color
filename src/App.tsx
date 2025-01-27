import './App.css'
import { Routes, Route } from 'react-router-dom'
import { GNav } from './components/GNav/GNav'
import { Home } from './pages/Home'
import { Palette } from './pages/Palette'
import { Picker } from './pages/Picker'
import { About } from './pages/About'
import { Image } from './pages/Image/index'
import { palettes } from './data/data'

function App() {
  return (
    <>
      <header><GNav /></header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/palette" element={<Palette palettes={palettes} />} />
          <Route path="/picker" element={<Picker />} />
          <Route path="/about" element={<About />} />
          <Route path="/image" element={<Image />} />
        </Routes>
      </main>
    </>
  )
}

export default App

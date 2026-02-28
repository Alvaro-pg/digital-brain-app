import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Inicio from './pages/Inicio'
import Categorias from './pages/Categorias'
import Graficos from './pages/Graficos'

function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#201C4E] w-full min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/graficos" element={<Graficos />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

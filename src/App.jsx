import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import RightSidebar from './components/RightSidebar'
import Inicio from './pages/Inicio'
import Categorias from './pages/Categorias'
import Graficos from './pages/Graficos'
import CategoriaDetalle from './pages/CategoriaDetalle'

function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#201C4E] w-full min-h-screen flex">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/categoria/:slug" element={<CategoriaDetalle />} />
            <Route path="/graficos" element={<Graficos />} />
          </Routes>
        </main>
        <RightSidebar />
      </div>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Sidebar from './components/Sidebar'
import RightSidebar from './components/RightSidebar'
import Inicio from './pages/Inicio'
import Categorias from './pages/Categorias'
import Graficos from './pages/Graficos'
import CategoriaDetalle from './pages/CategoriaDetalle'
import MemoriaDetalle from './pages/MemoriaDetalle'
import TodasMemorias from './pages/TodasMemorias'
import { DragProvider } from './context/DragContext'

function App() {
  return (
    <BrowserRouter>
      <DragProvider>
        <div className="bg-[#201C4E] w-full min-h-screen flex">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/memorias" element={<TodasMemorias />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categoria/:tagId" element={<CategoriaDetalle />} />
              <Route path="/memoria/:memoryId" element={<MemoriaDetalle />} />
              <Route path="/graficos" element={<Graficos />} />
            </Routes>
          </main>
          <RightSidebar />
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1744',
              color: '#fff',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#a855f7',
                secondary: '#fff',
              },
            },
          }}
        />
      </DragProvider>
    </BrowserRouter>
  )
}

export default App

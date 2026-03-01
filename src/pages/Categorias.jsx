import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import CategoryCard from '../components/CategoryCard'
import OrbitSpinner from '../components/OrbitSpinner'

// Cargar categorías del backend
const fetchCategories = async () => {
  const response = await fetch('http://localhost:8000/tag/', {
    headers: { 'Accept': 'application/json' }
  })
  if (!response.ok) throw new Error('Error al cargar categorías')
  const data = await response.json()
  return data.tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    slug: tag.name.toLowerCase().replace(/\s+/g, '-'),
    type: 'custom',
    image: null
  }))
}

function Categorias() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Llamada al backend al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  // Crear nueva categoría
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || isCreating) return
    
    setIsCreating(true)
    try {
      const response = await fetch('http://localhost:8000/tag/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      })
      
      if (!response.ok) throw new Error('Error al crear categoría')
      
      const data = await response.json()
      const newCategory = {
        id: data.tag.id,
        name: data.tag.name,
        slug: data.tag.name.toLowerCase().replace(/\s+/g, '-'),
        type: 'custom',
        image: null
      }
      
      setCategories(prev => [...prev, newCategory])
      setNewCategoryName('')
      setIsModalOpen(false)
      toast.success(`Categoría "${newCategory.name}" creada`)
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Error al crear la categoría')
    } finally {
      setIsCreating(false)
    }
  }

  // Filtrar categorías por búsqueda
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col px-16 py-8 overflow-y-auto">
      {/* Header con barra de búsqueda */}
      <div className="flex items-center justify-between mb-8">
        <h1 
          className="text-white text-[16px]"
          style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
        >
          categorías
        </h1>
        
        {/* Barra de búsqueda y botón añadir */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="buscar categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors w-80"
            />
          </div>
          
          {/* Botón añadir categoría */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-3 bg-purple-500 hover:bg-purple-400 rounded-full transition-colors"
            title="Añadir categoría"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Grid de categorías */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <OrbitSpinner size={60} />
          </div>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              image={category.image}
              name={category.name}
              id={category.id}
              type={category.type}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/40 text-sm">no se encontraron categorías</p>
        </div>
      )}

      {/* Modal crear categoría */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#1a1744] border border-white/10 rounded-2xl p-6 w-96 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 
              className="text-white text-lg mb-6"
              style={{ fontFamily: 'Syncopate, sans-serif' }}
            >
              Nueva Categoría
            </h2>
            
            <input
              type="text"
              placeholder="Nombre de la categoría..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors mb-6"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setNewCategoryName('')
                }}
                className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
                style={{ fontFamily: 'Syncopate, sans-serif' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim() || isCreating}
                className={`flex-1 py-3 rounded-xl text-white transition-colors flex items-center justify-center gap-2 ${
                  newCategoryName.trim() && !isCreating
                    ? 'bg-purple-500 hover:bg-purple-400 cursor-pointer'
                    : 'bg-gray-700 cursor-not-allowed opacity-50'
                }`}
                style={{ fontFamily: 'Syncopate, sans-serif' }}
              >
                {isCreating ? (
                  <OrbitSpinner size={20} />
                ) : (
                  'Crear'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categorias

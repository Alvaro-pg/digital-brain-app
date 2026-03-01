import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import InsightCard from '../components/InsightCard'
import OrbitSpinner from '../components/OrbitSpinner'

// Helper para calcular tiempo relativo
const getTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffDays / 7)
  
  if (diffMins < 60) return `hace ${diffMins} min`
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  return `hace ${diffWeeks} semana${diffWeeks > 1 ? 's' : ''}`
}

function CategoriaDetalle() {
  const { tagId } = useParams()
  const navigate = useNavigate()
  const [categoryName, setCategoryName] = useState('')
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Cargar información de la categoría y sus memorias
  useEffect(() => {
    const fetchCategoryAndMemories = async () => {
      setLoading(true)
      try {
        // Primero obtenemos la información del tag para tener el nombre
        const tagResponse = await fetch(`http://localhost:8000/tag/${tagId}`, {
          headers: { 'Accept': 'application/json' }
        })
        
        let tagName = tagId
        if (tagResponse.ok) {
          const tagData = await tagResponse.json()
          tagName = tagData.tag?.name || tagId
          setCategoryName(tagName)
        } else {
          setCategoryName(tagId)
        }

        // Luego obtenemos todas las memorias
        const response = await fetch('http://localhost:8000/memory/', {
          headers: { 'Accept': 'application/json' }
        })
        
        if (!response.ok) throw new Error('Error al cargar memorias')
        const data = await response.json()
        
        // Mapear memorias al formato esperado (igual que en Inicio.jsx)
        const mappedMemories = data.memories.map(memory => ({
          id: memory.id,
          title: memory.summary || memory.keyword,
          category: memory.tags?.[0] || memory.type,
          subcategory: memory.keyword,
          timeAgo: getTimeAgo(memory.created_at),
          createdAt: new Date(memory.created_at),
          image: null,
          type: memory.type === 'youtube' ? 'youtube' : memory.type === 'nota' ? 'pdf' : 'code',
          isAIGenerated: memory.generated === true,
          description: memory.raw_content,
          tags: memory.tags || []
        }))
        
        // Filtrar memorias usando el NOMBRE del tag (igual que en Inicio.jsx)
        const filteredMemories = mappedMemories.filter(memory => 
          memory.category === tagName
        )
        
        // Ordenar de más nuevo a más viejo
        filteredMemories.sort((a, b) => b.createdAt - a.createdAt)
        
        setMemories(filteredMemories)
      } catch (error) {
        console.error('Error fetching category memories:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategoryAndMemories()
  }, [tagId])

  // Filtrar memorias por búsqueda
  const filteredMemories = memories.filter(memory =>
    memory.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.subcategory?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Separar memorias generadas por IA
  const aiGeneratedMemories = filteredMemories.filter(m => m.isAIGenerated)
  const regularMemories = filteredMemories.filter(m => !m.isAIGenerated)

  return (
    <div className="flex-1 flex flex-col px-16 py-8 overflow-y-auto">
      {/* Header con botón volver y búsqueda */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* Botón volver */}
          <button
            onClick={() => navigate('/categorias')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Volver a categorías"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 
            className="text-white text-[16px]"
            style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
          >
            {categoryName || 'cargando...'}
          </h1>
        </div>
        
        {/* Barra de búsqueda */}
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
            placeholder="buscar en esta categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors w-80"
          />
        </div>
      </div>

      {/* Contenido principal */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <OrbitSpinner size={60} />
            <p className="text-white/60 text-sm">Cargando memorias...</p>
          </div>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-white/60 text-lg mb-2">No hay memorias en esta categoría</p>
          <p className="text-white/40 text-sm">Añade contenido a esta categoría arrastrando memorias aquí</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Sección: Todas las memorias */}
          <div>
            <h2 
              className="text-white text-lg mb-4 lowercase"
              style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
            >
              memorias ({filteredMemories.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMemories.map((memory) => (
                <InsightCard
                  key={memory.id}
                  id={memory.id}
                  image={memory.image}
                  title={memory.title}
                  category={memory.subcategory}
                  timeAgo={memory.timeAgo}
                  type={memory.type}
                  isAIGenerated={memory.isAIGenerated}
                />
              ))}
            </div>
          </div>

          {/* Sección: Generadas por IA (si hay) */}
          {aiGeneratedMemories.length > 0 && (
            <div>
              <h2 
                className="text-white text-lg mb-4 lowercase flex items-center gap-2"
                style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
              >
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                generado por tu brain ({aiGeneratedMemories.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {aiGeneratedMemories.map((memory) => (
                  <InsightCard
                    key={memory.id}
                    id={memory.id}
                    image={memory.image}
                    title={memory.title}
                    category={memory.subcategory}
                    timeAgo={memory.timeAgo}
                    type={memory.type}
                    isAIGenerated={memory.isAIGenerated}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoriaDetalle

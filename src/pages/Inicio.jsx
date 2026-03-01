import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InsightCard from '../components/InsightCard'
import CategoryCard from '../components/CategoryCard'
import CategoryFilter from '../components/CategoryFilter'
import DynamicCalendar from '../components/DynamicCalendar'
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

const mockCategories = [
  { id: 1, name: 'Informática FIC', slug: 'informatica-fic', type: 'code', image: null },
  { id: 2, name: 'Música', slug: 'musica', type: 'spotify', image: null },
  { id: 3, name: 'Memes', slug: 'memes', type: 'image', image: null },
]

function Inicio() {
  const [activeCategory, setActiveCategory] = useState('Inicio')
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategories, setFilterCategories] = useState(['Inicio'])
  const navigate = useNavigate()

  // Cargar memorias del backend
  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:8000/memory/', {
          headers: { 'Accept': 'application/json' }
        })
        if (!response.ok) throw new Error('Error al cargar memorias')
        const data = await response.json()
        
        // Mapear memorias al formato esperado
        const mappedMemories = data.memories.map(memory => ({
          id: memory.id,
          title: memory.summary || memory.keyword,
          category: memory.tags?.[0] || memory.type,
          subcategory: memory.keyword,
          timeAgo: getTimeAgo(memory.created_at),
          image: null,
          type: memory.type === 'youtube' ? 'youtube' : memory.type === 'nota' ? 'pdf' : 'code',
          isAIGenerated: memory.status === 'processed',
          description: memory.raw_content
        }))
        
        setMemories(mappedMemories)
        
        // Extraer categorías únicas para el filtro
        const uniqueCategories = ['Inicio', ...new Set(mappedMemories.map(m => m.category).filter(Boolean))]
        setFilterCategories(uniqueCategories)
      } catch (error) {
        console.error('Error fetching memories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMemories()
  }, [])

  // Filtrar insights según categoría activa
  const filteredInsights = activeCategory === 'Inicio'
    ? memories
    : memories.filter(insight => insight.category === activeCategory)

  // Filtrar solo los insights generados por el brain
  const brainInsights = memories.filter(insight => insight.isAIGenerated)

  return (
    <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
      {/* Filtro de categorías */}
      <div className="mb-6 mx-10">
        <CategoryFilter 
          categories={filterCategories} 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      <div className="px-10">
      {/* Calendario dinámico - solo en tab Inicio */}
      {activeCategory === 'Inicio' && (
        <div className="mb-8 mt-6">
          <DynamicCalendar />
        </div>
      )}
      {/* Sección: Últimos Insights */}
      <div className="mb-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-white text-xl lowercase"
            style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
          >
            {activeCategory === 'Inicio' ? 'vuelve a tus últimas memorias' : `insights de ${activeCategory.toLowerCase()}`}
          </h2>
          {activeCategory === 'Inicio' && (
            <span
              onClick={() => navigate('/memorias')}
              className="text-white/40 hover:text-white/70 text-xs lowercase cursor-pointer transition-colors"
              style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
            >
              mostrar todos
            </span>
          )}
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {loading ? (
            <div className="flex items-center justify-center w-full py-8">
              <OrbitSpinner size={40} />
            </div>
          ) : filteredInsights.length > 0 ? (
            filteredInsights.map((insight) => (
              <InsightCard
                key={insight.id}
                id={insight.id}
                image={insight.image}
                title={insight.title}
                category={insight.subcategory}
                timeAgo={insight.timeAgo}
                type={insight.type}
                isAIGenerated={insight.generated}
              />
            ))
          ) : (
            <p className="text-gray-400">No hay insights en esta categoría</p>
          )}
        </div>
      </div>

      {/* Sección: Insights del Brain */}
      <div className="mb-8">
        <h2 
          className="text-white text-xl mb-4 lowercase"
          style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
        >
          generado por tu brain
        </h2>
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center w-full py-8">
              <OrbitSpinner size={40} />
            </div>
          ) : brainInsights.length > 0 ? (
            brainInsights.map((insight) => (
              <div 
                key={insight.id}
                onClick={() => navigate(`/memoria/${insight.id}`)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-900/20 via-[#1a1744] to-pink-900/10 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                {/* Icono con gradiente */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-500/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                  </svg>
                </div>
                
                {/* Info principal */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{insight.subcategory}</p>
                  {insight.description && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{insight.description}</p>
                  )}
                </div>
                
                {/* Badge y tiempo */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full lowercase"
                    style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '400' }}
                  >
                    generado
                  </span>
                  <span className="text-gray-500 text-sm">{insight.timeAgo}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No hay insights generados por el brain</p>
          )}
        </div>
      </div>

      {/* Sección: Categorías */}
      <div>
        <h2 
          className="text-white text-xl mb-4 lowercase"
          style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
        >
          categorías
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {mockCategories.map((category) => (
            <CategoryCard
              key={category.id}
              image={category.image}
              name={category.name}
              slug={category.slug}
              type={category.type}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default Inicio

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import InsightCard from '../components/InsightCard'
import CategoryCard from '../components/CategoryCard'
import CategoryFilter from '../components/CategoryFilter'
import DynamicCalendar from '../components/DynamicCalendar'
import OrbitSpinner from '../components/OrbitSpinner'

// Skeleton Components
const InsightCardSkeleton = () => (
  <div className="flex flex-col gap-2 animate-pulse">
    <div className="w-48 h-32 rounded-xl bg-white/5 border border-gray-700" />
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 bg-white/5 rounded w-32" />
        <div className="h-2 bg-white/5 rounded w-24" />
        <div className="h-2 bg-white/5 rounded w-16" />
      </div>
    </div>
  </div>
)

const CategoryCardSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse flex-shrink-0">
    <div className="w-52 h-64 rounded-xl bg-white/5 border border-gray-700" />
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded bg-white/5" />
      <div className="h-3 bg-white/5 rounded w-32" />
    </div>
  </div>
)

const BrainInsightSkeleton = () => (
  <div className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-700 bg-[#1a1744] animate-pulse">
    <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-4 bg-white/5 rounded w-3/4" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
      <div className="h-2 bg-white/5 rounded w-full" />
    </div>
    <div className="flex items-center gap-3 flex-shrink-0">
      <div className="h-5 w-20 bg-white/5 rounded-full" />
      <div className="h-3 w-16 bg-white/5 rounded" />
    </div>
  </div>
)

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

const CATEGORY_CARD_WIDTH = 224 // 208px card + 16px gap

function Inicio() {
  const [activeCategory, setActiveCategory] = useState('Inicio')
  const [memories, setMemories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategories, setFilterCategories] = useState(['Inicio'])
  const [categoryIndex, setCategoryIndex] = useState(0)
  const navigate = useNavigate()

  // Navegación del carrusel de categorías
  const canGoPrev = categoryIndex > 0
  const canGoNext = categoryIndex < categories.length - 4

  const handlePrevCategories = () => {
    if (canGoPrev) setCategoryIndex(prev => Math.max(0, prev - 1))
  }

  const handleNextCategories = () => {
    if (canGoNext) setCategoryIndex(prev => prev + 1)
  }

  // Cargar memorias y categorías del backend
  const fetchData = async () => {
    setLoading(true)
    try {
      const [memoriesRes, tagsRes] = await Promise.all([
        fetch('http://localhost:8000/memory/', {
          headers: { 'Accept': 'application/json' }
        }),
        fetch('http://localhost:8000/tag/', {
          headers: { 'Accept': 'application/json' }
        })
      ])
      
      if (!memoriesRes.ok) throw new Error('Error al cargar memorias')
      const memoriesData = await memoriesRes.json()
      
      // Mapear memorias al formato esperado
      const mappedMemories = memoriesData.memories.map(memory => ({
        id: memory.id,
        title: memory.summary || memory.keyword,
        category: memory.tags?.[0] || memory.type,
        subcategory: memory.keyword,
        timeAgo: getTimeAgo(memory.created_at),
        createdAt: new Date(memory.created_at),
        image: null,
        type: memory.type === 'youtube' ? 'youtube' : memory.type === 'nota' ? 'pdf' : 'code',
        isAIGenerated: memory.generated === true,
        description: memory.raw_content
      }))
      
      // Ordenar de más nuevo a más viejo
      mappedMemories.sort((a, b) => b.createdAt - a.createdAt)
      
      setMemories(mappedMemories)
      
      // Extraer categorías únicas para el filtro
      const uniqueCategories = ['Inicio', ...new Set(mappedMemories.map(m => m.category).filter(Boolean))]
      setFilterCategories(uniqueCategories)
      
      // Cargar categorías/tags
      if (tagsRes.ok) {
        const tagsData = await tagsRes.json()
        setCategories(tagsData.tags || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Escuchar eventos de actualización del brain
  useEffect(() => {
    const handleBrainUpdate = () => {
      console.log('Brain updated, reloading data...')
      fetchData()
    }

    window.addEventListener('brain:updated', handleBrainUpdate)
    return () => {
      window.removeEventListener('brain:updated', handleBrainUpdate)
    }
  }, [])

  // Filtrar insights según categoría activa
  const filteredInsights = activeCategory === 'Inicio'
    ? memories
    : memories.filter(insight => insight.category === activeCategory)

  // Filtrar solo los insights generados por el brain
  const brainInsights = memories.filter(insight => insight.isAIGenerated)

  // Calcular las 3 categorías con más memorias
  const topCategories = (() => {
    const categoryCounts = {}
    memories.forEach(memory => {
      const cat = memory.category
      if (cat) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
      }
    })
    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }))
  })()

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
            {activeCategory === 'Inicio' ? 'vuelve a tus últimas memorias' : `memorias de ${activeCategory.toLowerCase()}`}
          </h2>
          {activeCategory === 'Inicio' && (
            <span
              onClick={() => navigate('/memorias')}
              className="text-white/40 hover:text-white/70 text-xs lowercase cursor-pointer transition-colors"
              style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
            >
              mostrar todas
            </span>
          )}
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {loading ? (
            <>
              <InsightCardSkeleton />
              <InsightCardSkeleton />
              <InsightCardSkeleton />
              <InsightCardSkeleton />
              <InsightCardSkeleton />
            </>
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
                isAIGenerated={insight.isAIGenerated}
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
            <>
              <BrainInsightSkeleton />
              <BrainInsightSkeleton />
              <BrainInsightSkeleton />
            </>
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
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-white text-xl lowercase"
            style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
          >
            categorías
          </h2>
          <span
            onClick={() => navigate('/categorias')}
            className="text-white/40 hover:text-white/70 text-xs lowercase cursor-pointer transition-colors"
            style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
          >
            mostrar todos
          </span>
        </div>
        <div className="flex items-center gap-4 pb-4">
          {/* Flecha izquierda */}
          <button
            onClick={handlePrevCategories}
            disabled={!canGoPrev}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              canGoPrev 
                ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer' 
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Contenedor con overflow y animación */}
          <div className="flex-1 overflow-hidden">
            <div 
              className="flex gap-4 transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${categoryIndex * CATEGORY_CARD_WIDTH}px)` }}
            >
              {loading ? (
                <>
                  <CategoryCardSkeleton />
                  <CategoryCardSkeleton />
                  <CategoryCardSkeleton />
                  <CategoryCardSkeleton />
                  <CategoryCardSkeleton />
                </>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="flex-shrink-0">
                    <CategoryCard
                      id={category.id}
                      image={null}
                      name={category.name}
                      slug={category.id.toString()}
                      type="folder"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No hay categorías disponibles</p>
              )}
            </div>
          </div>

          {/* Flecha derecha */}
          <button
            onClick={handleNextCategories}
            disabled={!canGoNext}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              canGoNext 
                ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer' 
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Secciones: Top 3 Categorías con más memorias */}
      {activeCategory === 'Inicio' && topCategories.map((topCat, idx) => {
        const categoryMemories = memories.filter(m => m.category === topCat.name).slice(0, 6)
        if (categoryMemories.length === 0) return null
        
        return (
          <div key={topCat.name} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="text-white text-xl lowercase"
                style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
              >
                {topCat.name.toLowerCase()}
              </h2>
              <span
                onClick={() => setActiveCategory(topCat.name)}
                className="text-white/40 hover:text-white/70 text-xs lowercase cursor-pointer transition-colors"
                style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
              >
                ver todas
              </span>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {categoryMemories.map((insight) => (
                <InsightCard
                  key={insight.id}
                  id={insight.id}
                  image={insight.image}
                  title={insight.title}
                  category={insight.subcategory}
                  timeAgo={insight.timeAgo}
                  type={insight.type}
                  isAIGenerated={insight.isAIGenerated}
                />
              ))}
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default Inicio

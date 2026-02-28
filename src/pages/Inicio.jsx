import { useState } from 'react'
import InsightCard from '../components/InsightCard'
import CategoryCard from '../components/CategoryCard'
import CategoryFilter from '../components/CategoryFilter'
import DynamicCalendar from '../components/DynamicCalendar'

// Datos mockeados
const mockInsights = [
  { id: 1, title: 'Kemba Kalwer', category: 'Música', subcategory: 'eladiocarrionofficial', timeAgo: 'hace 1 hora', image: null, type: 'spotify', isAIGenerated: false },
  { id: 2, title: 'Bad Bunny - Monaco', category: 'Música', subcategory: 'badbunny', timeAgo: 'hace 5 horas', image: null, type: 'youtube', isAIGenerated: false },
  { id: 3, title: 'Conexión: Grafos y Algoritmos de Dijkstra', category: 'Informática', subcategory: 'Informática FIC', timeAgo: 'hace 2 días', image: null, type: 'code', isAIGenerated: true, description: 'Tu brain detectó una conexión entre tus apuntes de matemáticas discretas y el algoritmo de Dijkstra que estudiaste la semana pasada.' },
  { id: 4, title: 'Estructuras de Datos', category: 'Informática', subcategory: 'Algoritmos', timeAgo: 'hace 4 días', image: null, type: 'pdf', isAIGenerated: false },
  { id: 5, title: 'Resumen: Patrones REST en tus apuntes', category: 'Desarrollo Backend', subcategory: 'Node.js', timeAgo: 'hace 3 días', image: null, type: 'code', isAIGenerated: true, description: 'Resumen automático generado a partir de tus notas sobre APIs RESTful, Express.js y buenas prácticas de desarrollo backend.' },
  { id: 6, title: 'PostgreSQL Avanzado', category: 'Desarrollo Backend', subcategory: 'Bases de Datos', timeAgo: 'hace 1 semana', image: null, type: 'code', isAIGenerated: false },
  { id: 7, title: 'Docker Compose', category: 'Desarrollo Backend', subcategory: 'DevOps', timeAgo: 'hace 2 semanas', image: null, type: 'code', isAIGenerated: false },
]

const mockCategories = [
  { id: 1, name: 'Informática FIC', slug: 'informatica-fic', type: 'code', image: null },
  { id: 2, name: 'Música', slug: 'musica', type: 'spotify', image: null },
  { id: 3, name: 'Memes', slug: 'memes', type: 'image', image: null },
]

const filterCategories = ['Inicio', 'Música', 'Desarrollo Backend', 'Informática']

function Inicio() {
  const [activeCategory, setActiveCategory] = useState('Inicio')

  // Filtrar insights según categoría activa
  const filteredInsights = activeCategory === 'Inicio'
    ? mockInsights
    : mockInsights.filter(insight => insight.category === activeCategory)

  // Filtrar solo los insights generados por el brain
  const brainInsights = mockInsights.filter(insight => insight.isAIGenerated)

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
        <h2 
          className="text-white text-xl mb-4 lowercase"
          style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
        >
          {activeCategory === 'Inicio' ? 'vuelve a tus últimas memorias' : `insights de ${activeCategory.toLowerCase()}`}
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {filteredInsights.length > 0 ? (
            filteredInsights.map((insight) => (
              <InsightCard
                key={insight.id}
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
          {brainInsights.length > 0 ? (
            brainInsights.map((insight) => (
              <div 
                key={insight.id}
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

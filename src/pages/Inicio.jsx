import { useState } from 'react'
import InsightCard from '../components/InsightCard'
import CategoryCard from '../components/CategoryCard'
import CategoryFilter from '../components/CategoryFilter'

// Datos mockeados
const mockInsights = [
  { id: 1, title: 'Kemba Kalwer', category: 'Música', subcategory: 'eladiocarrionofficial', timeAgo: 'hace 1 hora', image: null },
  { id: 2, title: 'Bad Bunny - Monaco', category: 'Música', subcategory: 'badbunny', timeAgo: 'hace 5 horas', image: null },
  { id: 3, title: 'Tema de grafos TC', category: 'Informática', subcategory: 'Informática FIC', timeAgo: 'hace 2 días', image: null },
  { id: 4, title: 'Estructuras de Datos', category: 'Informática', subcategory: 'Algoritmos', timeAgo: 'hace 4 días', image: null },
  { id: 5, title: 'API REST con Node', category: 'Desarrollo Backend', subcategory: 'Node.js', timeAgo: 'hace 3 días', image: null },
  { id: 6, title: 'PostgreSQL Avanzado', category: 'Desarrollo Backend', subcategory: 'Bases de Datos', timeAgo: 'hace 1 semana', image: null },
  { id: 7, title: 'Docker Compose', category: 'Desarrollo Backend', subcategory: 'DevOps', timeAgo: 'hace 2 semanas', image: null },
]

const mockCategories = [
  { id: 1, name: 'Informática FIC', slug: 'informatica-fic', image: null },
  { id: 2, name: 'Música', slug: 'musica', image: null },
  { id: 3, name: 'Memes', slug: 'memes', image: null },
]

const filterCategories = ['Todo', 'Música', 'Desarrollo Backend', 'Informática']

function Inicio() {
  const [activeCategory, setActiveCategory] = useState('Todo')

  // Filtrar insights según categoría activa
  const filteredInsights = activeCategory === 'Todo'
    ? mockInsights
    : mockInsights.filter(insight => insight.category === activeCategory)

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
      {/* Sección: Últimos Insights */}
      <div className="mb-8 mt-10">
        <h2 
          className="text-white text-xl mb-4 lowercase"
          style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
        >
          {activeCategory === 'Todo' ? 'vuelve a tus últimos insights' : `insights de ${activeCategory.toLowerCase()}`}
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
              />
            ))
          ) : (
            <p className="text-gray-400">No hay insights en esta categoría</p>
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
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default Inicio

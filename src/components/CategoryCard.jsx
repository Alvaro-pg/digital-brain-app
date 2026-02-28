import { Link } from 'react-router-dom'

function CategoryCard({ image, name, color = '#1a1744', slug }) {
  return (
    <Link to={`/categoria/${slug}`} className="flex flex-col gap-3 cursor-pointer group">
      {/* Imagen de categoría */}
      <div 
        className="w-52 h-64 rounded-xl overflow-hidden border border-gray-600 group-hover:border-gray-400 transition-colors"
        style={{ backgroundColor: color }}
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Nombre de categoría */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded bg-gray-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <span className="text-white text-base">{name}</span>
      </div>
    </Link>
  )
}

export default CategoryCard

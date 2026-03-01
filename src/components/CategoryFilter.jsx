import { useState, useRef, useEffect } from 'react'

function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  const containerRef = useRef(null)
  const innerRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Detectar overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && innerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const innerWidth = innerRef.current.scrollWidth
        setIsOverflowing(innerWidth > containerWidth - 60) // 60px para la flecha
      }
    }
    
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [categories])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Ordenar categorías alfabéticamente (sin "Inicio")
  const sortedCategories = [...categories]
    .filter(c => c !== 'Inicio')
    .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))

  // Agrupar por letra inicial
  const groupedCategories = sortedCategories.reduce((acc, category) => {
    const letter = category.charAt(0).toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(category)
    return acc
  }, {})

  const letters = Object.keys(groupedCategories).sort()

  // Categorías visibles (las primeras que quepan + Inicio)
  const visibleCategories = isOverflowing 
    ? categories.slice(0, Math.max(3, Math.floor(categories.length / 2)))
    : categories

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        ref={containerRef}
        className="flex items-center gap-1 bg-[#1a1744] rounded-full p-1 w-full"
      >
        <div ref={innerRef} className="flex gap-1 overflow-hidden flex-1">
          {visibleCategories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-200 whitespace-nowrap
                ${activeCategory === category
                  ? 'bg-gray-500 text-white shadow-md'
                  : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              style={{ fontFamily: 'Syncopate, sans-serif' }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Flecha expandir */}
        {isOverflowing && (
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`ml-1 p-2 rounded-full transition-all duration-300 ${
              isDropdownOpen 
                ? 'bg-purple-500/30 text-purple-300' 
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown con categorías ordenadas */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-full max-h-96 overflow-y-auto bg-[#1a1744]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4">
            <h3 
              className="text-white/60 text-[10px] uppercase tracking-widest mb-4"
              style={{ fontFamily: 'Syncopate, sans-serif' }}
            >
              Todas las categorías
            </h3>
            
            {/* Lista por letras en 4 columnas */}
            <div className="grid grid-cols-4 gap-4">
              {letters.map((letter) => (
                <div key={letter}>
                  {/* Índice de letra */}
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-purple-400 text-lg font-bold"
                      style={{ fontFamily: 'Syncopate, sans-serif' }}
                    >
                      {letter}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent"></div>
                  </div>
                  
                  {/* Categorías de esa letra */}
                  <div className="space-y-1">
                    {groupedCategories[letter].map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          onCategoryChange(category)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all duration-200 truncate ${
                          activeCategory === category
                            ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-500'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        style={{ fontFamily: 'Syncopate, sans-serif' }}
                        title={category}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón Inicio siempre visible */}
            {categories.includes('Inicio') && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    onCategoryChange('Inicio')
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    activeCategory === 'Inicio'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: 'Syncopate, sans-serif' }}
                >
                  ← Volver a Inicio
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryFilter

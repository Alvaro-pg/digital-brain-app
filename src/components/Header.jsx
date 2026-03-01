import { NavLink } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import digitalBrainLogo from '../assets/digital brain.png'

function Header() {
  const [categories, setCategories] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const timeoutRef = useRef(null)

  const linkClass = ({ isActive }) =>
    `text-white hover:text-gray-300 text-lg tracking-wider ${isActive ? 'border-b-2 border-white' : ''}`

  // Cargar categorías con conteo de memorias
  useEffect(() => {
    const fetchCategoriesWithCount = async () => {
      try {
        // Cargar categorías y memorias en paralelo
        const [tagsRes, memoriesRes] = await Promise.all([
          fetch('http://localhost:8000/tag/', { headers: { 'Accept': 'application/json' } }),
          fetch('http://localhost:8000/memory/', { headers: { 'Accept': 'application/json' } })
        ])
        
        if (!tagsRes.ok || !memoriesRes.ok) throw new Error('Error al cargar datos')
        
        const tagsData = await tagsRes.json()
        const memoriesData = await memoriesRes.json()
        
        // Contar memorias por categoría
        const countMap = {}
        memoriesData.memories.forEach(memory => {
          if (memory.tags && Array.isArray(memory.tags)) {
            memory.tags.forEach(tagName => {
              countMap[tagName] = (countMap[tagName] || 0) + 1
            })
          }
        })
        
        // Mapear categorías con su conteo y ordenar por cantidad (mayor a menor)
        const categoriesWithCount = tagsData.tags
          .map(tag => ({
            id: tag.id,
            name: tag.name,
            count: countMap[tag.name] || 0
          }))
          .sort((a, b) => b.count - a.count)
        
        setCategories(categoriesWithCount)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategoriesWithCount()
  }, [])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 150)
  }

  return (
    <header className="w-full py-4 px-6 flex flex-col items-center bg-gradient-to-b from-[#090816] to-transparent">
      
      
      <NavLink to="/" style={{ marginTop: '20px', display: 'block' }}>
      
        <img 
          src={digitalBrainLogo}
          alt="Digital Brain" 
          style={{ height: 'auto', width: '30px', display: 'block' }} 
        />
      </NavLink>
      <nav className="flex gap-8 mt-4" style={{ fontFamily: 'Syncopate, sans-serif' }}>
        <NavLink to="/" className={linkClass}>INICIO</NavLink>
        
        {/* Categorías con desplegable */}
        <div 
          ref={dropdownRef}
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <NavLink 
            to="/categorias" 
            className={linkClass}
          >
            CATEGORÍAS
            <svg 
              className={`inline-block w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </NavLink>
          
          {/* Dropdown */}
          <div 
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#1a1744] border border-gray-700 rounded-xl shadow-xl overflow-hidden transition-all duration-200 z-50 ${
              isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}
          >
            <div className="max-h-80 overflow-y-auto py-2">
              {categories.length === 0 ? (
                <div className="px-4 py-3 text-gray-400 text-sm text-center">
                  Cargando...
                </div>
              ) : (
                categories.map(cat => (
                  <NavLink
                    key={cat.id}
                    to={`/categoria/${cat.id}`}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-purple-900/30 transition-colors group"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <span className="text-white text-sm group-hover:text-purple-300 transition-colors truncate">
                      {cat.name}
                    </span>
                    <span className="text-gray-400 text-xs bg-gray-800 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                      {cat.count}
                    </span>
                  </NavLink>
                ))
              )}
            </div>
          </div>
        </div>
        
        <NavLink to="/graficos" className={linkClass}>GRÁFICOS</NavLink>
      </nav>
    </header>
  )
}

export default Header

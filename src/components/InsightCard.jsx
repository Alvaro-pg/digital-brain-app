import { useNavigate } from 'react-router-dom'
import { useDrag } from '../context/DragContext'

const getIconByType = (type, size = 'small') => {
  const sizeClasses = size === 'small' ? 'w-4 h-4' : 'w-12 h-12'
  
  switch (type) {
    case 'youtube':
      return (
        <svg className={`${sizeClasses} text-red-500`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'spotify':
      return (
        <svg className={`${sizeClasses} text-green-500`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg className={`${sizeClasses} text-sky-500`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    case 'instagram':
      return (
        <svg className={`${sizeClasses} text-pink-500`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      )
    case 'pdf':
      return (
        <svg className={`${sizeClasses} text-red-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    case 'image':
      return (
        <svg className={`${sizeClasses} text-purple-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'audio':
      return (
        <svg className={`${sizeClasses} text-orange-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    case 'code':
      return (
        <svg className={`${sizeClasses} text-cyan-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    case 'folder':
    default:
      return (
        <svg className={`${sizeClasses} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
  }
}

function InsightCard({ id, image, title, category, timeAgo, type = 'folder', isAIGenerated = false }) {
  const { startDrag, endDrag } = useDrag()
  const navigate = useNavigate()

  const handleDragStart = (e) => {
    const insightData = { id, title, category, type, isAIGenerated, image, timeAgo }
    e.dataTransfer.setData('application/json', JSON.stringify(insightData))
    e.dataTransfer.effectAllowed = 'copy'
    startDrag(insightData)
  }

  const handleDragEnd = () => {
    endDrag()
  }

  const handleClick = (e) => {
    // Solo navegar si no es un drag
    if (e.defaultPrevented) return
    navigate(`/memoria/${id}`)
  }

  return (
    <div 
      className="flex flex-col gap-2 cursor-pointer group"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      {/* Imagen o placeholder */}
      <div className={`w-48 h-32 rounded-xl overflow-hidden border relative ${
        isAIGenerated 
          ? 'border-purple-500/50' 
          : 'border-gray-600'
      }`}>
        {/* Fondo mágico para IA */}
        {isAIGenerated && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-cyan-400/30" />
        )}
        <div className={`absolute inset-0 ${
          isAIGenerated 
            ? 'bg-gradient-to-tr from-[#1a1744] via-purple-900/40 to-[#1a1744]' 
            : 'bg-[#1a1744]'
        }`}>
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative">
              {isAIGenerated && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10" />
              )}
              {getIconByType(type, 'large')}
            </div>
          )}
        </div>
        {/* Badge generado */}
        {isAIGenerated && (
          <div 
            className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 lowercase"
            style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '400' }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
            </svg>
            Generado
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-700/50 flex-shrink-0 flex items-center justify-center">
          {getIconByType(type, 'small')}
        </div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium truncate max-w-[150px]">{title}</span>
          <span className="text-gray-400 text-xs">{category}</span>
          <span className="text-gray-500 text-xs">{timeAgo}</span>
        </div>
      </div>
    </div>
  )
}

export default InsightCard

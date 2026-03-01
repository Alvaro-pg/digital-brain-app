import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
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

// Helper para previsualización multimedia
const getFileExtension = (url) => {
  if (!url) return '';
  return url.split('.').pop().toLowerCase();
}

const renderFilePreview = (url) => {
  if (!url) return null;
  const fullUrl = url.startsWith('http') ? url : `http://localhost:8000/${url.startsWith('/') ? url.substring(1) : url}`;
  const ext = getFileExtension(url);

  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
    return <img src={fullUrl} alt="Preview" className="w-full max-h-[500px] object-contain rounded-xl shadow-lg border border-[#6366f1]/20 bg-black/20" />;
  }
  if (['mp3', 'wav', 'ogg'].includes(ext)) {
    return <audio controls src={fullUrl} className="w-full mt-2 outline-none" />;
  }
  if (['mp4', 'webm', 'mov'].includes(ext)) {
    return <video controls src={fullUrl} className="w-full max-h-[500px] rounded-xl shadow-lg border border-[#6366f1]/20 bg-black/20" />;
  }
  if (['pdf'].includes(ext)) {
    return <iframe src={fullUrl} className="w-full h-[500px] rounded-xl shadow-lg border border-[#6366f1]/20 bg-[#0f0d24]" title="PDF Preview" />;
  }
  if(['txt', 'md'].includes(ext)) {
      return <iframe src={fullUrl} className="w-full h-[200px] rounded-xl shadow-lg border border-[#6366f1]/20 bg-[#0f0d24]" title="Document Preview" />;
  }
  
if ([
  'js','ts','jsx','tsx','json','py','java','c','cpp',
  'cs','php','rb','go','rs','html','css','scss','sql'
].includes(ext)) {
  return (
    <iframe
      src={fullUrl}
      className="w-full h-[200px] rounded-xl shadow-lg border border-[#6366f1]/20 bg-[#0f0d24]"
      title="Code Preview"
    />
  );  
}
  
  // Archivo genérico (Solo botón)
  return (
    <div className="bg-[#1a1744] border border-gray-700 p-8 rounded-xl text-center">
      <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-gray-400 text-sm mb-4">La previsualización en línea no está disponible para formato .{ext}</p>
      <a href={fullUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Descargar Archivo
      </a>
    </div>
  );
}

// Icono por tipo
const getIconByType = (type) => {
  switch (type) {
    case 'youtube':
      return (
        <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'nota':
    case 'pdf':
      return (
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    case 'recurso':
    case 'code':
      return (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    default:
      return (
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
  }
}

function MemoriaDetalle() {
  const { memoryId } = useParams()
  const navigate = useNavigate()
  const [memory, setMemory] = useState(null)
  const [allTags, setAllTags] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Cargar memoria y tags del backend
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [memoryRes, tagsRes] = await Promise.all([
          fetch(`http://localhost:8000/memory/${memoryId}`, {
            headers: { 'Accept': 'application/json' }
          }),
          fetch('http://localhost:8000/tag/', {
            headers: { 'Accept': 'application/json' }
          })
        ])
        if (!memoryRes.ok) throw new Error('Error al cargar memoria')
        const memoryData = await memoryRes.json()
        setMemory(memoryData.memory)
        
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json()
          setAllTags(tagsData.tags || [])
        }
        console.log('Memoria cargada:', memoryData.memory)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('No se pudo cargar la memoria')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [memoryId])
  
  // Helper para encontrar el ID de un tag por su nombre
  const getTagId = (tagName) => {
    const tag = allTags.find(t => t.name === tagName)
    return tag ? tag.id : null
  }

  // Función para eliminar memoria
  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta memoria? Esta acción no se puede deshacer.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:8000/memory/${memoryId}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      })

      if (!response.ok) throw new Error('Error al eliminar la memoria')

      toast.success('Memoria eliminada correctamente')
      window.dispatchEvent(new CustomEvent('brain:updated'))
      navigate('/')
    } catch (err) {
      console.error('Error deleting memory:', err)
      toast.error('No se pudo eliminar la memoria')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <OrbitSpinner size={60} />
      </div>
    )
  }

  if (error || !memory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">{error || 'Memoria no encontrada'}</p>
        <Link 
          to="/" 
          className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    )
  }

  const isProcessed = memory.generated === true

  return (
    <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 px-10">
        <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-white">{memory.keyword || 'Memoria'}</span>
      </div>

      <div className="px-10">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          {/* Icono */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
            isProcessed
              ? 'bg-gradient-to-br from-purple-600/30 to-pink-500/30 border border-purple-500/30'
              : 'bg-[#1a1744] border border-gray-700'
          }`}>
            {getIconByType(memory.type)}
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-white text-2xl font-bold">
                {memory.summary || memory.keyword}
              </h1>
              {isProcessed && (
                <span 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full lowercase"
                  style={{ fontFamily: 'Syncopate, sans-serif' }}
                >
                  procesado
                </span>
              )}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="ml-auto p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Eliminar memoria"
              >
                {isDeleting ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-1">
              Keyword: <span className="text-white">{memory.keyword}</span>
            </p>
            <p className="text-gray-400 text-sm mb-1">
              Tipo: <span className="text-white capitalize">{memory.type}</span>
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Creado {getTimeAgo(memory.created_at)} por {memory.user_name}
            </p>
          </div>
        </div>

        {/* Categorías */}
        {memory.tags && memory.tags.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-white text-lg mb-3 lowercase"
              style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
            >
              categorías
            </h2>
            <div className="flex flex-wrap gap-2">
              {memory.tags.map((tag, index) => {
                const tagId = getTagId(tag)
                return tagId ? (
                  <Link 
                    key={index}
                    to={`/categoria/${tagId}`}
                    className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full text-sm hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </Link>
                ) : (
                  <span 
                    key={index}
                    className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Previsualización del archivo original */}
        {memory.file_url && (
          <div className="mb-8 mt-2">
            <h2 
              className="text-white text-lg mb-3 lowercase flex items-center gap-2"
              style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
            >
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              archivo original
            </h2>
            <div className="rounded-xl overflow-hidden p-1 bg-white/5 border border-white/10">
              {renderFilePreview(memory.file_url)}
            </div>
            {/* Botón para abrir en pestaña nueva */}
            <div className="mt-3 flex justify-end">
                <button 
                  onClick={() => {
                    const url = memory.file_url.startsWith('http') ? memory.file_url : `http://localhost:8000/${memory.file_url.startsWith('/') ? memory.file_url.substring(1) : memory.file_url}`;
                    window.open(url, '_blank');
                  }}
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Abrir en pestaña nueva
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </button>
            </div>
          </div>
        )}

        {/* Contenido */}
        <div className="mb-8">
          <h2 
            className="text-white text-lg mb-3 lowercase"
            style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
          >
            contenido
          </h2>
          <div className={`rounded-2xl p-6 ${
            isProcessed
              ? 'bg-gradient-to-r from-purple-900/20 via-[#1a1744] to-pink-900/10 border border-purple-500/20'
              : 'bg-[#1a1744] border border-gray-700'
          }`}>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {memory.raw_content}
            </p>
          </div>
        </div>

        {/* Resumen (si existe) */}
        {memory.summary && memory.summary !== memory.raw_content && (
          <div className="mb-8">
            <h2 
              className="text-white text-lg mb-3 lowercase flex items-center gap-2"
              style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
            >
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
              </svg>
              resumen generado
            </h2>
            <div className="bg-gradient-to-r from-purple-900/30 via-[#1a1744] to-pink-900/20 border border-purple-500/30 rounded-2xl p-6">
              <p className="text-white leading-relaxed">
                {memory.summary}
              </p>
            </div>
          </div>
        )}

        {/* Estado */}
        <div className="mb-8">
          <h2 
            className="text-white text-lg mb-3 lowercase"
            style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
          >
            estado
          </h2>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              memory.generated ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <span className="text-gray-300">{memory.generated ? 'Procesado' : 'Pendiente'}</span>
          </div>
        </div>

        {/* Botón volver */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default MemoriaDetalle

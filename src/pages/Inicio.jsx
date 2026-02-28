import { useState, useRef } from 'react'

function Inicio() {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...selectedFiles])
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleGuardar = () => {
    if (files.length > 0) {
      setIsProcessing(true)
      // Simular procesamiento
      setTimeout(() => {
        setIsProcessing(false)
        setFiles([])
      }, 3000)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      {/* Contenedor principal estilo embudo */}
      <div className="relative w-full max-w-2xl">
        {/* Área de drop */}
        <div className="flex items-stretch gap-2">
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300
              ${isDragging 
                ? 'border-white bg-white/10 scale-105' 
                : 'border-gray-500 hover:border-gray-400 bg-[#1a1744]'
              }`}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              {/* Icono de documento */}
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-300 text-center" style={{ fontFamily: 'Syncopate, sans-serif' }}>
                {files.length > 0 
                  ? `${files.length} archivo${files.length > 1 ? 's' : ''} seleccionado${files.length > 1 ? 's' : ''}`
                  : 'Añade tus archivos aquí'
                }
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Botón de micrófono */}
          <button className="bg-[#1a1744] border-2 border-gray-500 rounded-2xl px-4 hover:border-gray-400 transition-colors">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGuardar}
            disabled={files.length === 0 || isProcessing}
            className={`px-8 py-3 rounded-xl text-white font-medium transition-all
              ${files.length > 0 && !isProcessing
                ? 'bg-gray-500 hover:bg-gray-400 cursor-pointer'
                : 'bg-gray-700 cursor-not-allowed opacity-50'
              }`}
            style={{ fontFamily: 'Syncopate, sans-serif' }}
          >
            Guardar
          </button>
        </div>

        {/* Barra de procesamiento */}
        {isProcessing && (
          <div className="mt-6 bg-gray-200 rounded-xl p-4 flex items-center gap-4">
            <svg className="animate-spin w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-700 font-medium">
              Procesando {files.length} documento{files.length > 1 ? 's' : ''}...
            </span>
          </div>
        )}

        {/* Lista de archivos */}
        {files.length > 0 && !isProcessing && (
          <div className="mt-4 bg-[#1a1744] rounded-xl p-4 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-300 py-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Inicio

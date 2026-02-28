import { useState, useRef, useEffect } from 'react'
import OrbitSpinner from './OrbitSpinner'
import FunnelIcon from './FunnelIcon'
import { brainService } from '../services/brainService'

const AI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'gpt-3.5', name: 'GPT-3.5', provider: 'OpenAI' },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  { id: 'llama-3', name: 'Llama 3', provider: 'Meta' },
]

function RightSidebar() {
  const [activeTab, setActiveTab] = useState('archivos')
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPanelExpanded, setIsPanelExpanded] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0])
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const [isFunnelAnimating, setIsFunnelAnimating] = useState(false)
  const [filePrompt, setFilePrompt] = useState('')
  const [processingQueue, setProcessingQueue] = useState([]) // Cola de archivos en proceso
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)
  const sidebarRef = useRef(null)
  const modelDropdownRef = useRef(null)

  // Expandir panel cuando hay archivos nuevos
  useEffect(() => {
    if (files.length > 0) {
      setIsPanelExpanded(true)
    }
  }, [files.length])

  // Cerrar área expandida al clickear fuera (sin borrar archivos)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isPanelExpanded && !isProcessing) {
        setIsPanelExpanded(false)
      }
      // Cerrar dropdown de modelos
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPanelExpanded, isProcessing])

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
    // Trigger funnel animation
    setIsFunnelAnimating(true)
    setTimeout(() => setIsFunnelAnimating(false), 700)
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...selectedFiles])
    // Trigger funnel animation
    setIsFunnelAnimating(true)
    setTimeout(() => setIsFunnelAnimating(false), 700)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleSave = async (mode = 'single') => {
    if (files.length > 0) {
      const filesToProcess = [...files]
      const prompt = filePrompt.trim() || "Procesa estos archivos y extrae la información relevante para mi cerebro digital."
      
      // Movemos a la cola de procesamiento inmediatamente
      const newItems = filesToProcess.map(f => ({ 
        id: Math.random().toString(36).substr(2, 9),
        name: f.name, 
        size: f.size,
        status: 'pending' 
      }))
      
      setProcessingQueue(prev => [...prev, ...newItems])
      setFiles([]) // Limpiamos el área de drop
      setFilePrompt('')
      
      setIsProcessing(true)
      try {
        let response;
        if (mode === 'per-file') {
          response = await brainService.processPerFile(prompt, filesToProcess)
        } else {
          response = await brainService.processSingleSummary(prompt, filesToProcess)
        }
        
        console.log('Brain response:', response)
        
        // Actualizamos estado a éxito en la cola
        setProcessingQueue(prev => prev.map(item => 
          newItems.find(ni => ni.id === item.id) ? { ...item, status: 'success' } : item
        ))
        
        // Limpiamos los exitosos después de 5 segundos
        setTimeout(() => {
          setProcessingQueue(prev => prev.filter(item => 
            !newItems.find(ni => ni.id === item.id)
          ))
        }, 5000)
        
      } catch (err) {
        console.error('Error al procesar archivos:', err)
        setProcessingQueue(prev => prev.map(item => 
          newItems.find(ni => ni.id === item.id) ? { ...item, status: 'error' } : item
        ))
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    
    const userMessage = { role: 'user', content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simular respuesta de LLM (aquí se conectaría con una API externa)
    setTimeout(() => {
      const assistantMessage = { 
        role: 'assistant', 
        content: 'Esta es una respuesta simulada. Conecta con tu LLM preferida para obtener respuestas reales.' 
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    if (['pdf'].includes(ext)) {
      return (
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return (
        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    } else if (['txt', 'md'].includes(ext)) {
      return (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
    return (
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const hasFiles = files.length > 0
  const showExpandedPanel = hasFiles && isPanelExpanded && !isProcessing

  return (
    <aside 
      ref={sidebarRef}
      className={`min-h-screen bg-[#0f0d24] flex border-l border-gray-800 transition-all duration-500 ease-in-out ${
        showExpandedPanel ? 'w-[600px]' : 'w-96'
      }`}
    >
      {/* Panel expandido de archivos */}
      {showExpandedPanel && (
        <div className="w-[220px] p-4 border-r border-gray-800 flex flex-col">
          <h3 
            className="text-white text-sm mb-4 uppercase tracking-wider"
            style={{ fontFamily: 'Syncopate, sans-serif' }}
          >
            Archivos listos
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="bg-[#1a1744] rounded-xl p-3 relative group hover:bg-[#252250] transition-all"
              >
                <button 
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex flex-col items-center text-center">
                  {getFileIcon(file.name)}
                  <span className="text-gray-300 text-xs mt-2 truncate w-full">{file.name}</span>
                  <span className="text-gray-500 text-xs mt-1">{formatFileSize(file.size)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel principal */}
      <div className="flex-1 flex flex-col p-4">
      {/* Pestañas */}
      <div className="flex mb-4 bg-[#1a1744] rounded-xl p-1">
        <button
          onClick={() => setActiveTab('archivos')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'archivos'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{ fontFamily: 'Syncopate, sans-serif' }}
        >
          ARCHIVOS
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'chat'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          style={{ fontFamily: 'Syncopate, sans-serif' }}
        >
          CHAT
        </button>
      </div>

      {/* Contenido de Archivos */}
      {activeTab === 'archivos' && (
        <div className="flex flex-col flex-1">
          {/* Indicador de archivos pendientes (cuando panel cerrado) */}
          {hasFiles && !isPanelExpanded && !isProcessing && (
            <button
              onClick={() => setIsPanelExpanded(true)}
              className="mb-4 bg-indigo-600/20 border border-indigo-500 rounded-xl p-3 flex items-center justify-between hover:bg-indigo-600/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-indigo-300 text-sm" style={{ fontFamily: 'Syncopate, sans-serif' }}>
                  {files.length} archivo{files.length > 1 ? 's' : ''} listo{files.length > 1 ? 's' : ''}
                </span>
              </div>
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Área de drop */}
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg aspect-square cursor-pointer transition-all duration-300 mb-4 flex items-center justify-center
              ${isDragging 
                ? 'border-white bg-white/10 scale-105' 
                : 'border-gray-600 hover:border-gray-400 bg-[#1a1744]'
              }`}
          >
            <div className="flex flex-col items-center gap-3">
              <FunnelIcon size={120} isAnimating={isFunnelAnimating} isDragging={isDragging} />
              <p className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Syncopate, sans-serif' }}>
                {files.length > 0 
                  ? `${files.length} archivo${files.length > 1 ? 's' : ''}`
                  : 'Arrastra información aquí'
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
          <button className="w-full bg-[#1a1744] border border-gray-600 rounded-xl p-3 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-gray-300 text-sm" style={{ fontFamily: 'Syncopate, sans-serif' }}>GRABAR</span>
          </button>

          {/* Input de Prompt para Archivos (Instrucción) */}
          {hasFiles && !isProcessing && (
            <div className="mb-4">
              <label className="text-[10px] text-gray-500 mb-1 block uppercase font-bold tracking-tighter" style={{ fontFamily: 'Syncopate, sans-serif' }}>
                Instrucción opcional
              </label>
              <textarea
                value={filePrompt}
                onChange={(e) => setFilePrompt(e.target.value)}
                placeholder="Ej: Resume estos archivos..."
                className="w-full bg-[#1a1744] border border-gray-600 rounded-xl p-3 text-white text-xs resize-none focus:outline-none focus:border-indigo-500 transition-all"
                rows={2}
              />
            </div>
          )}

          {/* Barra de procesamiento */}
          {isProcessing && (
            <div className="bg-[#1a1744] border border-indigo-500/30 rounded-xl p-4 mb-4 flex flex-col items-center gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <OrbitSpinner size={24} />
                <span className="text-indigo-300 text-sm font-['Syncopate'] tracking-tighter">
                  Procesando Conocimiento...
                </span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full animate-shimmer" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}

          {/* Cola de Procesamiento */}
          {processingQueue.length > 0 && (
            <div className="mb-6 bg-[#1a1744]/50 rounded-xl p-4 border border-white/5">
              <h4 className="text-[10px] text-indigo-400 mb-4 uppercase font-bold tracking-widest" style={{ fontFamily: 'Syncopate, sans-serif' }}>
                Cola de Procesamiento
              </h4>
              <div className="space-y-3">
                {processingQueue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5 group transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex-shrink-0">
                        {item.status === 'pending' && <OrbitSpinner size={16} />}
                        {item.status === 'success' && (
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {item.status === 'error' && (
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-white text-xs truncate font-medium">{item.name}</span>
                        <span className={`text-[10px] uppercase font-bold tracking-tighter ${
                          item.status === 'pending' ? 'text-indigo-400' : 
                          item.status === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {item.status === 'pending' ? 'Procesando...' : 
                           item.status === 'success' ? 'Completado' : 'Error en Carga'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono">{formatFileSize(item.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSave('single')}
              disabled={files.length === 0 || isProcessing}
              className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all shadow-lg
                ${files.length > 0 && !isProcessing
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-indigo-500/20'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              style={{ fontFamily: 'Syncopate, sans-serif' }}
            >
              PROCESAR JUNTOS
            </button>
            <button
              onClick={() => handleSave('per-file')}
              disabled={files.length === 0 || isProcessing}
              className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-all border
                ${files.length > 0 && !isProcessing
                  ? 'bg-[#1a1744] border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/10 cursor-pointer'
                  : 'bg-gray-700 border-transparent text-gray-500 cursor-not-allowed opacity-50'
                }`}
              style={{ fontFamily: 'Syncopate, sans-serif' }}
            >
              PROCESAR CADA UNO
            </button>
          </div>

          {/* Espaciador */}
          <div className="flex-1" />

          {/* Info */}
          <div className="text-gray-500 text-sm text-center mt-4">
            <p>Formatos: PDF, TXT, MD, IMG</p>
          </div>
        </div>
      )}

      {/* Contenido de Chat */}
      {activeTab === 'chat' && (
        <div className="flex flex-col flex-1">
          {/* Selector de modelo */}
          <div className="mb-4 relative" ref={modelDropdownRef}>
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="w-full bg-[#1a1744] border border-gray-600 rounded-xl p-3 flex items-center justify-between hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="text-white text-sm">{selectedModel.name}</span>
                  <span className="text-gray-500 text-xs">{selectedModel.provider}</span>
                </div>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown de modelos */}
            {isModelDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1744] border border-gray-600 rounded-xl overflow-hidden z-10">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model)
                      setIsModelDropdownOpen(false)
                    }}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-[#252250] transition-colors ${
                      selectedModel.id === model.id ? 'bg-[#252250]' : ''
                    }`}
                  >
                    {selectedModel.id === model.id && (
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                    <div className={`flex flex-col items-start ${selectedModel.id !== model.id ? 'ml-7' : ''}`}>
                      <span className="text-white text-sm">{model.name}</span>
                      <span className="text-gray-500 text-xs">{model.provider}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mensajes */}
          <div className="flex-1 bg-[#1a1744] rounded-xl p-3 mb-4 overflow-y-auto max-h-[calc(100vh-250px)]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-center">Aquí puedo hacer tareas que tú me indiques</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white ml-4'
                        : 'bg-[#252250] text-gray-300 mr-4'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-[#252250] text-gray-300 mr-4 p-3 rounded-lg text-sm flex items-center gap-2">
                    <OrbitSpinner size={20} />
                    Pensando...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input de mensaje */}
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-[#1a1744] border border-gray-600 rounded-xl p-3 text-white text-sm resize-none focus:outline-none focus:border-indigo-500"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`px-4 rounded-xl transition-all ${
                inputMessage.trim() && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
      </div>
    </aside>
  )
}

export default RightSidebar

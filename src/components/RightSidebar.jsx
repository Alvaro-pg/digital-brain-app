import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mp3Encoder } from '@breezystack/lamejs'
import OrbitSpinner from './OrbitSpinner'
import FunnelIcon from './FunnelIcon'
import { brainService } from '../services/brainService'
import { useDrag } from '../context/DragContext'

const AUDIO_MIME_TYPE_CANDIDATES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus'
]

const getSupportedRecorderMimeType = () => {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') {
    return null
  }
  return AUDIO_MIME_TYPE_CANDIDATES.find(type => window.MediaRecorder.isTypeSupported(type)) || null
}

const formatRecordingClock = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

const mixToMono = (audioBuffer) => {
  if (audioBuffer.numberOfChannels === 1) {
    return new Float32Array(audioBuffer.getChannelData(0))
  }
  const length = audioBuffer.length
  const result = new Float32Array(length)
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      result[i] += channelData[i]
    }
  }
  for (let i = 0; i < result.length; i++) {
    result[i] /= audioBuffer.numberOfChannels
  }
  return result
}

const floatTo16BitPCM = (input) => {
  const buffer = new Int16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    const sample = Math.max(-1, Math.min(1, input[i]))
    buffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
  }
  return buffer
}

const convertBlobToMp3File = async (blob) => {
  if (typeof window === 'undefined') {
    throw new Error('Entorno no soportado para conversión de audio')
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) {
    throw new Error('AudioContext no disponible')
  }
  const audioContext = new AudioContext()
  try {
    const arrayBuffer = await blob.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    const monoChannel = mixToMono(audioBuffer)
    const samples = floatTo16BitPCM(monoChannel)
    
    const encoder = new Mp3Encoder(1, audioBuffer.sampleRate, 128)
    const sampleBlockSize = 1152
    const mp3Chunks = []
    for (let i = 0; i < samples.length; i += sampleBlockSize) {
      const chunk = samples.subarray(i, i + sampleBlockSize)
      const mp3buf = encoder.encodeBuffer(chunk)
      if (mp3buf.length > 0) {
        mp3Chunks.push(mp3buf)
      }
    }
    const end = encoder.flush()
    if (end.length > 0) {
      mp3Chunks.push(end)
    }
    const mp3Blob = new Blob(mp3Chunks, { type: 'audio/mpeg' })
    return new File([mp3Blob], `nota_audio_${Date.now()}.mp3`, { type: 'audio/mpeg' })
  } finally {
    await audioContext.close()
  }
}

function RightSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab] = useState('archivos')
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPanelExpanded, setIsPanelExpanded] = useState(false)
  const [isFunnelAnimating, setIsFunnelAnimating] = useState(false)
  const [filePrompt, setFilePrompt] = useState('')
  const [processingQueue, setProcessingQueue] = useState([]) // Cola de archivos en proceso
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [isNoteExpanded, setIsNoteExpanded] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const fileInputRef = useRef(null)
  const sidebarRef = useRef(null)
  const categoryDropdownRef = useRef(null)
  const noteInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordingChunksRef = useRef([])
  const recordingTimerRef = useRef(null)
  const audioStreamRef = useRef(null)
  const audioVisualizerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)

  // Hook para drag & drop de insights
  const { droppedInsights, addDroppedInsight, removeDroppedInsight, clearDroppedInsights } = useDrag()

  // Cargar categorías del backend al montar
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true)
      try {
        const response = await fetch('http://localhost:8000/tag/', {
          headers: { 'Accept': 'application/json' }
        })
        if (!response.ok) throw new Error('Error al cargar categorías')
        const data = await response.json()
        const mappedCategories = data.tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          slug: tag.name.toLowerCase().replace(/\s+/g, '-'),
          type: 'custom'
        }))
        setCategories(mappedCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Filtrar categorías por búsqueda
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  // Crear nueva categoría (tag) en el backend
  const handleCreateCategory = async () => {
    if (!categorySearch.trim() || isCreatingCategory) return
    
    setIsCreatingCategory(true)
    try {
      const response = await fetch('http://localhost:8000/tag/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categorySearch.trim() })
      })
      
      if (!response.ok) throw new Error('Error al crear categoría')
      
      const data = await response.json()
      const newCategory = {
        id: data.tag.id,
        name: data.tag.name,
        slug: data.tag.name.toLowerCase().replace(/\s+/g, '-'),
        type: 'custom'
      }
      
      setCategories(prev => [...prev, newCategory])
      setSelectedCategory(newCategory)
      setCategorySearch('')
      toast.success(`Categoría "${newCategory.name}" creada`)
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Error al crear la categoría')
    } finally {
      setIsCreatingCategory(false)
    }
  }

  // Expandir panel cuando hay archivos nuevos o insights
  useEffect(() => {
    if (files.length > 0 || droppedInsights.length > 0) {
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
      // Cerrar dropdown de categorías
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPanelExpanded, isProcessing])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [])

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
    
    // Verificar si es un insight arrastrado
    const insightData = e.dataTransfer.getData('application/json')
    if (insightData) {
      try {
        const insight = JSON.parse(insightData)
        addDroppedInsight(insight)
        setIsFunnelAnimating(true)
        setTimeout(() => setIsFunnelAnimating(false), 700)
        return
      } catch (err) {
        // No es JSON válido, continuar con archivos
      }
    }
    
    // Es un archivo
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

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
    }
    setIsRecording(false)
  }

  const visualizeAudio = () => {
    if (!audioVisualizerRef.current || !analyserRef.current) return
    
    const canvas = audioVisualizerRef.current
    const ctx = canvas.getContext('2d')
    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)
      
      ctx.fillStyle = '#1a1744'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8
        
        const colorStop = dataArray[i] / 255
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
        gradient.addColorStop(0, `rgba(168, 85, 247, ${0.4 + colorStop * 0.6})`)
        gradient.addColorStop(1, `rgba(6, 182, 212, ${0.3 + colorStop * 0.7})`)
        
        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
        
        x += barWidth + 1
      }
    }
    
    draw()
  }

  const startRecording = async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      toast.error('Tu navegador no soporta grabación de audio')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Configurar visualización de audio
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 256
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      
      const mimeType = getSupportedRecorderMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      recordingChunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordingChunksRef.current.push(event.data)
        }
      }
      recorder.onstop = async () => {
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
          recordingTimerRef.current = null
        }
        const cleanupAfterRecording = () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
          }
          if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close()
            audioContextRef.current = null
          }
          analyserRef.current = null
          stream.getTracks().forEach(track => track.stop())
          audioStreamRef.current = null
          mediaRecorderRef.current = null
          setRecordingDuration(0)
          setIsRecording(false)
        }
        if (recordingChunksRef.current.length === 0) {
          recordingChunksRef.current = []
          toast.error('No se capturó audio')
          cleanupAfterRecording()
          return
        }
        const toastId = toast.loading('Procesando audio...')
        try {
          const audioBlob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || mimeType || 'audio/webm' })
          recordingChunksRef.current = []
          const mp3File = await convertBlobToMp3File(audioBlob)
          setFiles(prev => [...prev, mp3File])
          setIsFunnelAnimating(true)
          setTimeout(() => setIsFunnelAnimating(false), 700)
          toast.success('Audio añadido al embudo', { id: toastId })
        } catch (error) {
          console.error('Error al convertir audio:', error)
          toast.error('No se pudo procesar el audio', { id: toastId })
        } finally {
          cleanupAfterRecording()
        }
      }
      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error)
        toast.error('Error durante la grabación')
        stopRecording()
      }
      mediaRecorderRef.current = recorder
      audioStreamRef.current = stream
      recorder.start()
      setIsRecording(true)
      setRecordingDuration(0)
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)
      
      // Iniciar visualización
      setTimeout(() => {
        if (audioVisualizerRef.current && analyserRef.current) {
          visualizeAudio()
        }
      }, 100)
    } catch (error) {
      console.error('No se pudo acceder al micrófono:', error)
      toast.error('Necesitamos acceso al micrófono')
    }
  }

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
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
      clearDroppedInsights()
      
      setIsProcessing(true)
      try {
        let response;
        if (mode === 'per-file') {
          response = await brainService.processPerFile(prompt, filesToProcess)
        } else {
          response = await brainService.processSingleSummary(prompt, filesToProcess)
        }
        
        console.log('Brain response:', response)
        
        // Avisar a la aplicación (ej. Graficos.jsx) que hay nodos nuevos
        window.dispatchEvent(new CustomEvent('brain:updated'))
        
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
        
        toast.success(`¡${filesToProcess.length} archivo${filesToProcess.length > 1 ? 's' : ''} procesado${filesToProcess.length > 1 ? 's' : ''} correctamente!`)
        
        // Navegar a inicio si no estamos ya allí
        if (location.pathname !== '/') {
          setTimeout(() => {
            navigate('/')
          }, 1000)
        }
        
      } catch (err) {
        console.error('Error al procesar archivos:', err)
        setProcessingQueue(prev => prev.map(item => 
          newItems.find(ni => ni.id === item.id) ? { ...item, status: 'error' } : item
        ))
        toast.error('Error al procesar archivos')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeInsight = (id) => {
    removeDroppedInsight(id)
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

  const hasFiles = files.length > 0 || droppedInsights.length > 0
  const totalItems = files.length + droppedInsights.length
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
            Listos para procesar
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3">
            {/* Insights arrastrados */}
            {droppedInsights.map((insight) => (
              <div 
                key={`insight-${insight.id}`} 
                className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 rounded-xl p-3 relative group hover:border-purple-500/50 transition-all"
              >
                <button 
                  onClick={() => removeInsight(insight.id)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                    </svg>
                  </div>
                  <span className="text-purple-300 text-xs truncate w-full">{insight.title}</span>
                  <span className="text-gray-500 text-xs mt-1">insight</span>
                </div>
              </div>
            ))}
            {/* Archivos */}
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
      {/* Título */}
      <div className="flex mb-10 bg-[#1a1744] rounded-xl p-1">
        <div
          className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-[#1a1744] text-white text-center"
          style={{ fontFamily: 'Syncopate, sans-serif' }}
        >
          ARCHIVOS
        </div>
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
                  {totalItems} elemento{totalItems > 1 ? 's' : ''} listo{totalItems > 1 ? 's' : ''}
                </span>
              </div>
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Botón de nota rápida + grabación */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsNoteExpanded(!isNoteExpanded)
                  setTimeout(() => noteInputRef.current?.focus(), 100)
                }}
                className={`w-14 h-14 bg-[#1a1744] border rounded-full hover:border-gray-400 transition-all duration-300 flex items-center justify-center ${
                  isNoteExpanded ? 'border-purple-500' : 'border-gray-600'
                }`}
                title={isNoteExpanded ? 'Cerrar nota' : 'Escribir nota rápida'}
                aria-label={isNoteExpanded ? 'Cerrar nota' : 'Escribir nota rápida'}
              >
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleRecordClick}
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  isRecording
                    ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(248,113,113,0.4)]'
                    : 'bg-[#1a1744] border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
                title={isRecording ? 'Detener grabación' : 'Grabar nota de voz'}
                aria-label={isRecording ? 'Detener grabación' : 'Grabar nota de voz'}
              >
                {isRecording ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="7" y="7" width="10" height="10" rx="2" ry="2" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 15a3 3 0 01-3-3V5a3 3 0 116 0v7a3 3 0 01-3 3zm6-4v1a6 6 0 01-12 0v-1m6 6v3" />
                  </svg>
                )}
              </button>
            </div>
            {isRecording && (
              <p className="text-[11px] text-red-400 text-right mt-1 font-mono tracking-wider">
                REC {formatRecordingClock(recordingDuration)}
              </p>
            )}
            
            {/* Panel de visualización de grabación */}
            <div className={`overflow-hidden transition-all duration-300 ${isRecording ? 'max-h-32 mt-2' : 'max-h-0'}`}>
              <div className="bg-[#1a1744] border border-purple-500/30 rounded-xl p-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <canvas
                  ref={audioVisualizerRef}
                  width={320}
                  height={80}
                  className="w-full h-20 rounded-lg"
                />
              </div>
            </div>
            
            {/* Input de nota desplegable */}
            <div className={`overflow-hidden transition-all duration-300 ${isNoteExpanded ? 'max-h-40 mt-2' : 'max-h-0'}`}>
              <div className="relative">
                <textarea
                  ref={noteInputRef}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Escribe tu nota aquí..."
                  className="w-full bg-[#1a1744] border border-gray-600 rounded-xl p-3 pr-12 text-white text-sm resize-none focus:outline-none focus:border-purple-500 transition-colors"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && noteText.trim()) {
                      e.preventDefault()
                      // Crear archivo de texto con la nota
                      const noteBlob = new Blob([noteText], { type: 'text/plain' })
                      const noteFile = new File([noteBlob], `nota_${Date.now()}.txt`, { type: 'text/plain' })
                      setFiles(prev => [...prev, noteFile])
                      setNoteText('')
                      setIsNoteExpanded(false)
                      toast.success('Nota añadida al embudo')
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (noteText.trim()) {
                      const noteBlob = new Blob([noteText], { type: 'text/plain' })
                      const noteFile = new File([noteBlob], `nota_${Date.now()}.txt`, { type: 'text/plain' })
                      setFiles(prev => [...prev, noteFile])
                      setNoteText('')
                      setIsNoteExpanded(false)
                      toast.success('Nota añadida al embudo')
                    }
                  }}
                  disabled={!noteText.trim()}
                  className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors ${
                    noteText.trim() 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer' 
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

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
              <p className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}>
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

          {/* Botón de añadir a categoría */}
          <div className="mb-4 flex justify-end">
            <div className="relative" ref={categoryDropdownRef}>
              <button 
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`bg-[#1a1744] border rounded-xl p-3 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 ${
                  isCategoryDropdownOpen ? 'border-purple-500' : 'border-gray-600'
                } ${selectedCategory ? 'border-purple-500/50' : ''}`}
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown de categorías */}
              {isCategoryDropdownOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#1a1744] border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  {/* Barra de búsqueda */}
                  <div className="p-3 border-b border-gray-700">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <svg 
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="buscar o crear..."
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && categorySearch.trim() && handleCreateCategory()}
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                      </div>
                      <button
                        onClick={handleCreateCategory}
                        disabled={!categorySearch.trim() || isCreatingCategory}
                        className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                          categorySearch.trim() && !isCreatingCategory
                            ? 'bg-purple-500 hover:bg-purple-400 text-white cursor-pointer'
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }`}
                        title="Crear categoría"
                      >
                        {isCreatingCategory ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Lista de categorías */}
                  <div className="max-h-48 overflow-y-auto p-2">
                    {isLoadingCategories ? (
                      <div className="flex justify-center py-4">
                        <OrbitSpinner size={24} />
                      </div>
                    ) : filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat)
                            setIsCategoryDropdownOpen(false)
                            setCategorySearch('')
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                            selectedCategory?.id === cat.id 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'text-gray-300 hover:bg-white/5'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                            </svg>
                          </div>
                          <span className="text-sm truncate">{cat.name}</span>
                          {selectedCategory?.id === cat.id && (
                            <svg className="w-4 h-4 ml-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-2">No hay categorías</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

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
            <div className="bg-[#1a1744] border border-indigo-500/30 rounded-xl p-4 mb-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <OrbitSpinner size={24} />
                <span className="text-indigo-300 text-sm font-['Syncopate'] tracking-tighter">
                  Procesando Conocimiento...
                </span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: '100%' }}></div>
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
                  <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5 group">
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
              disabled={files.length <= 1 || isProcessing}
              className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-colors shadow-lg
                ${files.length > 1 && !isProcessing
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
              className={`flex-1 py-3 rounded-xl text-[11px] font-bold transition-colors border
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
      </div>
    </aside>
  )
}

export default RightSidebar

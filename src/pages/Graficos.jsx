import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import 'echarts-gl'
import { graphService } from '../services/graphService'

/**
 * Transforma los datos del backend al formato que entiende ECharts.
 */
const transformDataForECharts = (backendData) => {
  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4']
  
  // 1. Agrupar nodos por 'label'
  const groupedNodesMap = {}
  backendData.nodes.forEach(node => {
    if (!groupedNodesMap[node.label]) {
      groupedNodesMap[node.label] = []
    }
    groupedNodesMap[node.label].push(node)
  })

  // 2. Crear nodos agrupados únicos
  const uniqueNodes = []
  const oldIdToGroupId = {}
  const typesSet = new Set()

  Object.keys(groupedNodesMap).forEach((label) => {
    const nodesInGroup = groupedNodesMap[label]
    const representative = nodesInGroup[0]
    const groupId = `group_${label}`
    
    nodesInGroup.forEach(n => oldIdToGroupId[n.id] = groupId)
    typesSet.add(representative.type || 'Sin tipo')

    uniqueNodes.push({
      id: groupId,
      name: label,
      type: representative.type || 'Sin tipo',
      // Escalado: 40px base + 15px por cada nodo extra en el grupo
      symbolSize: 40 + (nodesInGroup.length > 1 ? (nodesInGroup.length - 1) * 20 : 0),
      summary: representative.summary || '',
      tags: [...new Set(nodesInGroup.flatMap(n => n.tags || []).map(t => t.name))].join(', '),
      groupCount: nodesInGroup.length
    })
  })

  const types = Array.from(typesSet)
  const categories = types.map((type, index) => ({
    name: type,
    itemStyle: { color: colors[index % colors.length] }
  }))

  uniqueNodes.forEach(node => {
    node.category = types.indexOf(node.type)
  })

  // 3. Re-mapear y consolidar aristas
  const consolidatedEdges = {}
  backendData.edges.forEach(edge => {
    const srcGroup = oldIdToGroupId[edge.source]
    const targetGroup = oldIdToGroupId[edge.target]

    if (srcGroup && targetGroup && srcGroup !== targetGroup) {
      const edgeKey = [srcGroup, targetGroup].sort().join('--')
      if (!consolidatedEdges[edgeKey]) {
        consolidatedEdges[edgeKey] = {
          source: srcGroup,
          target: targetGroup,
          weightSum: 0,
          count: 0,
          tags: new Set()
        }
      }
      consolidatedEdges[edgeKey].weightSum += edge.weight || 0.5
      consolidatedEdges[edgeKey].count++
      if (edge.common_tags) edge.common_tags.forEach(t => consolidatedEdges[edgeKey].tags.add(t))
    }
  })

  const links = Object.values(consolidatedEdges).map(e => {
    const avgWeight = e.weightSum / e.count
    const minWidth = 1
    const maxWidth = 10
    return {
      source: e.source,
      target: e.target,
      lineStyle: {
        width: Math.max(minWidth, Math.min(maxWidth, avgWeight * 6))
      },
      edgeWeight: avgWeight.toFixed(3),
      commonTags: Array.from(e.tags).join(', ')
    }
  })

  return { nodes: uniqueNodes, links, categories }
}

function Graficos() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEmpty, setIsEmpty] = useState(false)
  
  // Estados para el panel lateral
  const [selectedKeyword, setSelectedKeyword] = useState(null)
  const [memories, setMemories] = useState([])
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelLoading, setPanelLoading] = useState(false)

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return

      try {
        setLoading(true)
        setError(null)
        
        const backendResponse = await graphService.getGraphData()
        const { nodes, links, categories } = transformDataForECharts(backendResponse)

        if (nodes.length === 0) {
          setIsEmpty(true)
          setLoading(false)
          return
        }

        setIsEmpty(false)
        if (!chartInstance.current) {
          chartInstance.current = echarts.init(chartRef.current, 'dark')
          
          // Evento de click para explorar memorias detalladas
          chartInstance.current.on('click', async (params) => {
            if (params.dataType === 'node') {
              const keyword = params.name
              setSelectedKeyword(keyword)
              setIsPanelOpen(true)
              setPanelLoading(true)
              
              try {
                const response = await graphService.getMemoriesByKeyword(keyword)
                setMemories(response.memories || [])
              } catch (err) {
                console.error('Error cargando memorias:', err)
              } finally {
                setPanelLoading(false)
              }
            }
          })
        }

        const option = {
          backgroundColor: 'transparent',
          title: {
            text: 'Grafo de Memorias',
            subtext: 'Conexiones por Tags Compartidos | Click para explorar',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#fff',
              fontFamily: 'Syncopate, sans-serif',
              fontSize: 24,
            },
            subtextStyle: {
              color: '#9ca3af',
              fontFamily: 'Inter, sans-serif',
            },
          },
          legend: {
            data: categories.map((c) => c.name),
            orient: 'vertical',
            left: 20,
            top: 80,
            textStyle: { color: '#fff' },
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(26, 23, 68, 0.9)',
            borderColor: '#6366f1',
            textStyle: { color: '#fff' },
            formatter: (params) => {
              if (params.dataType === 'node') {
                const nodeData = params.data
                const tagPills = (nodeData.tags && nodeData.tags !== 'Sin categorías')
                  ? nodeData.tags.split(', ').map(tag => 
                      `<span style="display: inline-block; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 4px; padding: 2px 6px; margin: 2px; font-size: 10px; color: #a5b4fc;">${tag}</span>`
                    ).join('')
                  : '<span style="color: #6b7280; font-style: italic;">Sin categorías</span>'

                return `
                  <div style="padding: 10px; min-width: 220px; border-radius: 8px;">
                    <div style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; display: flex; justify-content: space-between; align-items: baseline;">
                      <strong style="color: #6366f1; font-size: 14px;">${params.name}</strong>
                      ${nodeData.groupCount > 1 ? `<span style="font-size: 10px; background: rgba(99, 102, 241, 0.3); padding: 1px 4px; border-radius: 3px; color: #a5b4fc;">x${nodeData.groupCount}</span>` : ''}
                    </div>
                    <div style="margin-bottom: 8px;">
                      <span style="color: #9ca3af; font-size: 11px; text-transform: uppercase;">Resumen</span><br/>
                      <span style="font-size: 12px; color: #cbd5e1; display: block; margin-top: 2px;">${nodeData.summary}</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                      <span style="color: #9ca3af; font-size: 11px; text-transform: uppercase;">Tipo</span><br/>
                      <span style="font-size: 13px; color: #fff;">${categories[nodeData.category].name}</span>
                    </div>
                    <div>
                      <span style="color: #9ca3af; font-size: 11px; text-transform: uppercase;">Categorías</span><br/>
                      <div style="margin-top: 4px; display: flex; flex-wrap: wrap;">
                        ${tagPills}
                      </div>
                    </div>
                  </div>
                `
              }
              const commonTagPills = (params.data.commonTags)
                ? params.data.commonTags.split(', ').map(tag => 
                    `<span style="display: inline-block; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 4px; padding: 1px 5px; margin: 2px; font-size: 10px; color: #a5b4fc;">${tag}</span>`
                  ).join('')
                : '<span style="color: #6b7280; font-style: italic; font-size: 11px;">Sin tags en común</span>'

              return `
                <div style="padding: 10px; min-width: 180px; border-radius: 8px;">
                  <div style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                    <strong style="color: #6366f1; font-size: 13px;">Relación Semántica</strong>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <span style="color: #9ca3af; font-size: 11px; text-transform: uppercase;">Similitud</span><br/>
                    <span style="font-size: 14px; color: #fff;">${(params.data.edgeWeight * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span style="color: #9ca3af; font-size: 11px; text-transform: uppercase;">Tags Comunes</span><br/>
                    <div style="margin-top: 4px; display: flex; flex-wrap: wrap;">
                      ${commonTagPills}
                    </div>
                  </div>
                </div>
              `
            },
          },
          series: [
            {
              type: 'graph',
              layout: 'force',
              nodes: nodes,
              links: links,
              categories: categories,
              roam: true,
              draggable: true,
              label: {
                show: true,
                position: 'right',
                formatter: '{b}',
                color: '#fff',
                fontSize: 12,
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6,
                curveness: 0.1,
              },
              force: {
                repulsion: 2500,
                edgeLength: [120, 350],
                gravity: 0.1,
              },
              emphasis: {
                focus: 'adjacency',
                lineStyle: {
                  width: 8,
                },
                label: {
                  show: true,
                  fontWeight: 'bold',
                }
              },
            },
          ],
        }

        chartInstance.current.setOption(option)
        setLoading(false)
      } catch (err) {
        console.error('Error al cargar el grafo:', err)
        setError('No se pudo conectar con el servidor de Digital Brain. Asegúrate de que el backend está corriendo.')
        setLoading(false)
      }
    }

    initChart()

    // Escuchar evento global de actualización de memoria
    const handleBrainUpdate = () => {
      console.log('Evento brain:updated recibido. Recargando grafo...')
      initChart()
    }
    window.addEventListener('brain:updated', handleBrainUpdate)

    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('brain:updated', handleBrainUpdate)
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col p-4 relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#201C4E]/50 rounded-2xl">
          <div className="text-white text-xl animate-pulse font-['Syncopate']">Iniciando Red Neuronal...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 p-10 text-center">
          <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-xl max-w-md">
            <h3 className="text-xl font-bold mb-2">Error de Conexión</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {isEmpty && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 p-10 text-center">
          <div className="bg-[#1a1744]/40 border border-[#6366f1]/30 backdrop-blur-md p-12 rounded-3xl max-w-lg shadow-[0_0_50px_rgba(99,102,241,0.15)] group transition-all hover:border-[#6366f1]/50">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-[#6366f1]/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <svg className="w-20 h-20 text-[#6366f1] mx-auto relative group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white font-['Syncopate'] tracking-wider">Cerebro en Reposo</h3>
            <p className="text-gray-400 leading-relaxed mb-8 font-['Inter']">
              Aún no has guardado memorias o conocimientos suficientes para generar una red neuronal. 
              ¡Empieza a subir archivos o chatear para ver cómo crece tu cerebro!
            </p>
            <div className="inline-block px-6 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#a5b4fc] text-xs uppercase tracking-widest font-bold">
              Esperando Datos...
            </div>
          </div>
        </div>
      )}

      {/* Grafo Principal */}
      <div 
        ref={chartRef} 
        className={`w-full flex-1 min-h-[500px] rounded-2xl transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: 'rgba(26, 23, 68, 0.4)' }}
      />

      {/* Panel Lateral de Detalles (Slide-over) */}
      <div 
        className={`fixed top-0 right-0 h-full w-[400px] bg-[#161344]/90 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-6 pt-10 relative">
          {/* Botón Cerrar */}
          <button 
            onClick={() => setIsPanelOpen(false)}
            className="absolute top-4 right-4 text-[#6366f1]  text-2xl z-[60]"
          >
            ✕
          </button>

          <header className="mb-8">
            <h2 className="text-2xl font-['Syncopate'] text-white uppercase tracking-wider mb-2">{selectedKeyword}</h2>
            <div className="h-1 w-20 bg-[#6366f1] rounded-full"></div>
          </header>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
            {panelLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="text-white text-sm animate-pulse font-['Syncopate'] tracking-tighter">Extrayendo Memorias...</div>
              </div>
            ) : memories.length > 0 ? (
              <div className="space-y-4 pb-10">
                {memories.map((memo, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#6366f1] font-bold">{memo.type}</span>
                    </div>
                    <p className="text-white font-medium mb-3 line-clamp-2 leading-relaxed">{memo.summary}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {memo.tags?.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-[#6366f1]/20 text-[#a5b4fc] px-2 py-0.5 rounded border border-[#6366f1]/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-white/40 text-[11px] leading-relaxed italic">{memo.raw_content ? `"${memo.raw_content.substring(0, 100)}..."` : 'Sin contenido adicional'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-white/30 italic">No se han encontrado memorias detalladas para este concepto.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Graficos

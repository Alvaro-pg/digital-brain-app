import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import 'echarts-gl'
import { graphService } from '../services/graphService'

/**
 * Transforma los datos del backend al formato que entiende ECharts.
 */
const transformDataForECharts = (backendData) => {
  // 1. Extraer categorías únicas (types)
  const types = Array.from(new Set(backendData.nodes.map(n => n.type || 'Sin tipo')))
  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4']
  
  const categories = types.map((type, index) => ({
    name: type,
    itemStyle: { color: colors[index % colors.length] }
  }))

  // 2. Mapear nodos
  const nodes = backendData.nodes.map(node => {
    const categoryIndex = types.indexOf(node.type || 'Sin tipo')
    return {
      id: node.id,
      name: node.label,
      category: categoryIndex,
      symbolSize: 40,
      summary: node.summary || 'Sin resumen',
      tags: (node.tags && node.tags.length > 0) 
        ? node.tags.map(t => t.name).join(', ') 
        : 'Sin tags'
    }
  })

  // 3. Mapear enlaces (edges)
  const links = backendData.edges.map(edge => ({
    source: edge.source,
    target: edge.target,
    lineStyle: {
      width: (edge.weight || 0.5) * 5
    },
    edgeWeight: edge.weight,
    commonTags: (edge.common_tags && edge.common_tags.length > 0)
      ? edge.common_tags.join(', ')
      : ''
  }))

  return { nodes, links, categories }
}

function Graficos() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return

      try {
        setLoading(true)
        setError(null)
        
        // Obtener datos reales del backend
        const backendResponse = await graphService.getGraphData()
        const { nodes, links, categories } = transformDataForECharts(backendResponse)

        // Inicializar ECharts si no está inicializado
        if (!chartInstance.current) {
          chartInstance.current = echarts.init(chartRef.current, 'dark')
        }

        const option = {
          backgroundColor: 'transparent',
          title: {
            text: 'Grafo de Memorias',
            subtext: 'Conexiones por Tags Compartidos',
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
                const tagPills = (nodeData.tags && nodeData.tags !== 'Sin tags')
                  ? nodeData.tags.split(', ').map(tag => 
                      `<span style="display: inline-block; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 4px; padding: 2px 6px; margin: 2px; font-size: 10px; color: #a5b4fc;">#${tag}</span>`
                    ).join('')
                  : '<span style="color: #6b7280; font-style: italic;">Sin etiquetas</span>'

                return `
                  <div style="padding: 10px; min-width: 200px; border-radius: 8px;">
                    <div style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">
                      <strong style="color: #6366f1; font-size: 14px;">${params.name}</strong>
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
                      <span style="color: #9ca3af; font-size: 11px; text-transform: uppercase;">Etiquetas</span><br/>
                      <div style="margin-top: 4px; display: flex; flex-wrap: wrap;">
                        ${tagPills}
                      </div>
                    </div>
                  </div>
                `
              }
              return `
                <div style="padding: 5px;">
                  <strong>Relación Semántica</strong><br/>
                  <span>Similitud: ${(params.data.edgeWeight * 100).toFixed(1)}%</span><br/>
                  ${params.data.commonTags ? `<span style="font-size: 11px; color: #a5b4fc;">Tags comunes: ${params.data.commonTags}</span>` : ''}
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

    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartInstance.current) {
        chartInstance.current.dispose()
        chartInstance.current = null
      }
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col p-4 relative">
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

      <div 
        ref={chartRef} 
        className={`w-full flex-1 min-h-[500px] rounded-2xl transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: 'rgba(26, 23, 68, 0.4)' }}
      />
    </div>
  )
}

export default Graficos

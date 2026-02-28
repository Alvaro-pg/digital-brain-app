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

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return

      try {
        setLoading(true)
        setError(null)
        
        const backendResponse = await graphService.getGraphData()
        const { nodes, links, categories } = transformDataForECharts(backendResponse)

        if (!chartInstance.current) {
          chartInstance.current = echarts.init(chartRef.current, 'dark')
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
                const tagPills = (nodeData.tags && nodeData.tags !== 'Sin tags')
                  ? nodeData.tags.split(', ').map(tag => 
                      `<span style="display: inline-block; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 4px; padding: 2px 6px; margin: 2px; font-size: 10px; color: #a5b4fc;">#${tag}</span>`
                    ).join('')
                  : '<span style="color: #6b7280; font-style: italic;">Sin etiquetas</span>'

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
                      <span style="color: #9ca3af; font-size: 11px; text-transform: uppercase;">Etiquetas</span><br/>
                      <div style="margin-top: 4px; display: flex; flex-wrap: wrap;">
                        ${tagPills}
                      </div>
                    </div>
                  </div>
                `
              }
              const commonTagPills = (params.data.commonTags)
                ? params.data.commonTags.split(', ').map(tag => 
                    `<span style="display: inline-block; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 4px; padding: 1px 5px; margin: 2px; font-size: 10px; color: #a5b4fc;">#${tag}</span>`
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

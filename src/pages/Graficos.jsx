import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import 'echarts-gl'

// Datos mockeados - Simulación de grafo de conocimiento
const generateMockData = () => {
  const categories = [
    { name: 'Documentos', itemStyle: { color: '#6366f1' } },
    { name: 'Conceptos', itemStyle: { color: '#22c55e' } },
    { name: 'Personas', itemStyle: { color: '#f59e0b' } },
    { name: 'Proyectos', itemStyle: { color: '#ef4444' } },
    { name: 'Tecnologías', itemStyle: { color: '#06b6d4' } },
  ]

  const nodes = [
    // Documentos
    { name: 'Informe Q4', category: 0 },
    { name: 'Propuesta Tech', category: 0 },
    { name: 'Manual Usuario', category: 0 },
    { name: 'Análisis Datos', category: 0 },
    // Conceptos
    { name: 'Machine Learning', category: 1 },
    { name: 'Big Data', category: 1 },
    { name: 'Cloud Computing', category: 1 },
    { name: 'Blockchain', category: 1 },
    { name: 'IoT', category: 1 },
    // Personas
    { name: 'Ana García', category: 2 },
    { name: 'Carlos López', category: 2 },
    { name: 'María Ruiz', category: 2 },
    { name: 'Juan Martín', category: 2 },
    // Proyectos
    { name: 'Digital Brain', category: 3 },
    { name: 'DataHub', category: 3 },
    { name: 'SmartCity', category: 3 },
    // Tecnologías
    { name: 'React', category: 4 },
    { name: 'Python', category: 4 },
    { name: 'TensorFlow', category: 4 },
    { name: 'Node.js', category: 4 },
    { name: 'PostgreSQL', category: 4 },
  ]

  const links = [
    // Digital Brain connections
    { source: 'Digital Brain', target: 'Machine Learning' },
    { source: 'Digital Brain', target: 'React' },
    { source: 'Digital Brain', target: 'Python' },
    { source: 'Digital Brain', target: 'Ana García' },
    { source: 'Digital Brain', target: 'Carlos López' },
    { source: 'Digital Brain', target: 'Informe Q4' },
    // Machine Learning connections
    { source: 'Machine Learning', target: 'TensorFlow' },
    { source: 'Machine Learning', target: 'Python' },
    { source: 'Machine Learning', target: 'Big Data' },
    { source: 'Machine Learning', target: 'Análisis Datos' },
    // DataHub connections
    { source: 'DataHub', target: 'Big Data' },
    { source: 'DataHub', target: 'Cloud Computing' },
    { source: 'DataHub', target: 'PostgreSQL' },
    { source: 'DataHub', target: 'María Ruiz' },
    // SmartCity connections
    { source: 'SmartCity', target: 'IoT' },
    { source: 'SmartCity', target: 'Cloud Computing' },
    { source: 'SmartCity', target: 'Juan Martín' },
    // Other connections
    { source: 'Propuesta Tech', target: 'Blockchain' },
    { source: 'Propuesta Tech', target: 'Carlos López' },
    { source: 'Manual Usuario', target: 'React' },
    { source: 'Node.js', target: 'React' },
    { source: 'Big Data', target: 'Cloud Computing' },
    { source: 'Ana García', target: 'María Ruiz' },
    { source: 'TensorFlow', target: 'Python' },
  ]

  // Calcular peso de cada nodo basado en número de conexiones
  const nodeWeights = {}
  links.forEach(link => {
    nodeWeights[link.source] = (nodeWeights[link.source] || 0) + 1
    nodeWeights[link.target] = (nodeWeights[link.target] || 0) + 1
  })

  // Encontrar peso máximo y mínimo para normalizar
  const weights = Object.values(nodeWeights)
  const maxWeight = Math.max(...weights)
  const minWeight = Math.min(...weights)

  // Tamaño mínimo y máximo de los nodos
  const minSize = 20
  const maxSize = 60

  // Asignar symbolSize basado en el peso normalizado
  const nodesWithSize = nodes.map(node => {
    const weight = nodeWeights[node.name] || 1
    // Normalizar el peso al rango [0, 1] y escalar al tamaño
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight || 1)
    const symbolSize = minSize + normalizedWeight * (maxSize - minSize)
    
    return {
      ...node,
      symbolSize: Math.round(symbolSize),
      value: weight, // Guardar peso para tooltip
    }
  })

  return { nodes: nodesWithSize, links, categories }
}

function Graficos() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Inicializar ECharts
    chartInstance.current = echarts.init(chartRef.current, 'dark')

    const { nodes, links, categories } = generateMockData()

    const option = {
      backgroundColor: 'transparent',
      title: {
        text: 'Grafo de Conocimiento',
        subtext: 'Digital Brain',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#fff',
          fontFamily: 'Syncopate, sans-serif',
          fontSize: 24,
        },
        subtextStyle: {
          color: '#9ca3af',
          fontFamily: 'Syncopate, sans-serif',
        },
      },
      legend: {
        data: categories.map((c) => c.name),
        orient: 'vertical',
        left: 20,
        top: 80,
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (params.dataType === 'node') {
            return `<strong>${params.name}</strong><br/>Categoría: ${categories[params.data.category].name}<br/>Conexiones: ${params.data.value}`
          }
          return `${params.data.source} → ${params.data.target}`
        },
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          nodes: nodes.map((node) => ({
            ...node,
            itemStyle: categories[node.category].itemStyle,
          })),
          links: links,
          categories: categories,
          roam: true,
          draggable: true,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            fontSize: 12,
            color: '#fff',
          },
          lineStyle: {
            color: 'source',
            opacity: 0.4,
            width: 2,
            curveness: 0.1,
          },
          force: {
            repulsion: 500,
            gravity: 0.1,
            edgeLength: [100, 200],
            layoutAnimation: true,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 4,
            },
          },
        },
      ],
    }

    chartInstance.current.setOption(option)

    // Resize handler
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col p-4">
      <div 
        ref={chartRef} 
        className="w-full flex-1 min-h-[500px] rounded-2xl"
        style={{ backgroundColor: 'rgba(26, 23, 68, 0.5)' }}
      />
    </div>
  )
}

export default Graficos

import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import InsightCard from '../components/InsightCard'

// Datos de grafos por categoría
const categoryGraphData = {
  'informatica-fic': {
    categories: [
      { name: 'Asignaturas', itemStyle: { color: '#3b82f6' } },
      { name: 'Conceptos', itemStyle: { color: '#22c55e' } },
      { name: 'Profesores', itemStyle: { color: '#f59e0b' } },
      { name: 'Herramientas', itemStyle: { color: '#ec4899' } },
    ],
    nodes: [
      // Asignaturas
      { name: 'Teoría de la Computación', category: 0 },
      { name: 'Estructuras de Datos', category: 0 },
      { name: 'BBDD', category: 0 },
      { name: 'Paradigmas', category: 0 },
      { name: 'Algoritmia', category: 0 },
      // Conceptos
      { name: 'Grafos', category: 1 },
      { name: 'Árboles', category: 1 },
      { name: 'SQL', category: 1 },
      { name: 'NoSQL', category: 1 },
      { name: 'Recursión', category: 1 },
      { name: 'POO', category: 1 },
      { name: 'Funcional', category: 1 },
      // Profesores
      { name: 'Prof. García', category: 2 },
      { name: 'Prof. Martínez', category: 2 },
      { name: 'Prof. López', category: 2 },
      // Herramientas
      { name: 'PostgreSQL', category: 3 },
      { name: 'MongoDB', category: 3 },
      { name: 'Python', category: 3 },
      { name: 'Java', category: 3 },
    ],
    links: [
      { source: 'Teoría de la Computación', target: 'Grafos' },
      { source: 'Teoría de la Computación', target: 'Árboles' },
      { source: 'Teoría de la Computación', target: 'Prof. García' },
      { source: 'Estructuras de Datos', target: 'Grafos' },
      { source: 'Estructuras de Datos', target: 'Árboles' },
      { source: 'Estructuras de Datos', target: 'Recursión' },
      { source: 'Estructuras de Datos', target: 'Java' },
      { source: 'BBDD', target: 'SQL' },
      { source: 'BBDD', target: 'NoSQL' },
      { source: 'BBDD', target: 'PostgreSQL' },
      { source: 'BBDD', target: 'MongoDB' },
      { source: 'BBDD', target: 'Prof. Martínez' },
      { source: 'Paradigmas', target: 'POO' },
      { source: 'Paradigmas', target: 'Funcional' },
      { source: 'Paradigmas', target: 'Java' },
      { source: 'Paradigmas', target: 'Python' },
      { source: 'Algoritmia', target: 'Grafos' },
      { source: 'Algoritmia', target: 'Recursión' },
      { source: 'Algoritmia', target: 'Prof. López' },
      { source: 'POO', target: 'Java' },
      { source: 'Funcional', target: 'Python' },
      { source: 'SQL', target: 'PostgreSQL' },
      { source: 'NoSQL', target: 'MongoDB' },
    ]
  },
  'musica': {
    categories: [
      { name: 'Artistas', itemStyle: { color: '#ec4899' } },
      { name: 'Géneros', itemStyle: { color: '#8b5cf6' } },
      { name: 'Álbumes', itemStyle: { color: '#06b6d4' } },
    ],
    nodes: [
      { name: 'Bad Bunny', category: 0 },
      { name: 'Eladio Carrión', category: 0 },
      { name: 'Quevedo', category: 0 },
      { name: 'Reggaetón', category: 1 },
      { name: 'Trap', category: 1 },
      { name: 'Urbano Latino', category: 1 },
      { name: 'Un Verano Sin Ti', category: 2 },
      { name: 'SEN2 KBRÓN', category: 2 },
    ],
    links: [
      { source: 'Bad Bunny', target: 'Reggaetón' },
      { source: 'Bad Bunny', target: 'Trap' },
      { source: 'Bad Bunny', target: 'Un Verano Sin Ti' },
      { source: 'Eladio Carrión', target: 'Trap' },
      { source: 'Eladio Carrión', target: 'SEN2 KBRÓN' },
      { source: 'Quevedo', target: 'Urbano Latino' },
      { source: 'Reggaetón', target: 'Urbano Latino' },
      { source: 'Trap', target: 'Urbano Latino' },
    ]
  },
  'memes': {
    categories: [
      { name: 'Fuentes', itemStyle: { color: '#f59e0b' } },
      { name: 'Temas', itemStyle: { color: '#ef4444' } },
      { name: 'Formatos', itemStyle: { color: '#22c55e' } },
    ],
    nodes: [
      { name: 'Twitter', category: 0 },
      { name: 'Reddit', category: 0 },
      { name: 'Instagram', category: 0 },
      { name: 'Programación', category: 1 },
      { name: 'Gatos', category: 1 },
      { name: 'Animales', category: 1 },
      { name: 'Imagen', category: 2 },
      { name: 'Video', category: 2 },
      { name: 'GIF', category: 2 },
    ],
    links: [
      { source: 'Twitter', target: 'Imagen' },
      { source: 'Twitter', target: 'Video' },
      { source: 'Reddit', target: 'Programación' },
      { source: 'Reddit', target: 'GIF' },
      { source: 'Instagram', target: 'Video' },
      { source: 'Gatos', target: 'Animales' },
      { source: 'Gatos', target: 'GIF' },
      { source: 'Programación', target: 'Imagen' },
    ]
  }
}

// Datos mockeados (en producción vendrían de una API/base de datos)
const categoriesData = {
  'informatica-fic': {
    name: 'Informática FIC',
    description: 'Recursos y apuntes de la Facultad de Informática de A Coruña',
    color: '#3b82f6',
    insights: [
      { id: 1, title: 'Tema de grafos TC', subcategory: 'Teoría de la Computación', timeAgo: 'hace 2 días', image: null },
      { id: 2, title: 'Estructuras de Datos', subcategory: 'Algoritmos', timeAgo: 'hace 4 días', image: null },
      { id: 3, title: 'Bases de Datos Relacionales', subcategory: 'BBDD', timeAgo: 'hace 1 semana', image: null },
      { id: 4, title: 'Paradigmas de Programación', subcategory: 'PP', timeAgo: 'hace 2 semanas', image: null },
    ]
  },
  'musica': {
    name: 'Música',
    description: 'Canciones, artistas y descubrimientos musicales',
    color: '#ec4899',
    insights: [
      { id: 1, title: 'Kemba Kalwer', subcategory: 'eladiocarrionofficial', timeAgo: 'hace 1 hora', image: null },
      { id: 2, title: 'Bad Bunny - Monaco', subcategory: 'badbunny', timeAgo: 'hace 5 horas', image: null },
      { id: 3, title: 'Quevedo - Columbia', subcategory: 'quaborntodo', timeAgo: 'hace 1 día', image: null },
    ]
  },
  'memes': {
    name: 'Memes',
    description: 'Los mejores memes guardados',
    color: '#f59e0b',
    insights: [
      { id: 1, title: 'Meme del gato', subcategory: 'Twitter', timeAgo: 'hace 3 horas', image: null },
      { id: 2, title: 'Meme programador', subcategory: 'Reddit', timeAgo: 'hace 1 día', image: null },
    ]
  }
}

function CategoriaDetalle() {
  const { slug } = useParams()
  const category = categoriesData[slug]
  const graphData = categoryGraphData[slug]
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  // Inicializar grafo
  useEffect(() => {
    if (!chartRef.current || !graphData) return

    chartInstance.current = echarts.init(chartRef.current, 'dark')

    // Calcular pesos de nodos
    const nodeWeights = {}
    graphData.links.forEach(link => {
      nodeWeights[link.source] = (nodeWeights[link.source] || 0) + 1
      nodeWeights[link.target] = (nodeWeights[link.target] || 0) + 1
    })

    const weights = Object.values(nodeWeights)
    const maxWeight = Math.max(...weights)
    const minWeight = Math.min(...weights)
    const minSize = 15
    const maxSize = 45

    const nodesWithSize = graphData.nodes.map(node => {
      const weight = nodeWeights[node.name] || 1
      const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight || 1)
      const symbolSize = minSize + normalizedWeight * (maxSize - minSize)
      return { ...node, symbolSize: Math.round(symbolSize), value: weight }
    })

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (params.dataType === 'node') {
            return `<strong>${params.name}</strong><br/>Tipo: ${graphData.categories[params.data.category].name}<br/>Conexiones: ${params.data.value}`
          }
          return `${params.data.source} → ${params.data.target}`
        },
      },
      legend: {
        data: graphData.categories.map((c) => c.name),
        orient: 'vertical',
        left: 10,
        top: 'middle',
        textStyle: { color: '#9ca3af', fontSize: 11 },
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          nodes: nodesWithSize.map((node) => ({
            ...node,
            itemStyle: graphData.categories[node.category].itemStyle,
          })),
          links: graphData.links,
          categories: graphData.categories,
          roam: true,
          draggable: true,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            fontSize: 10,
            color: '#fff',
          },
          lineStyle: {
            color: 'source',
            opacity: 0.5,
            width: 1.5,
            curveness: 0.15,
          },
          force: {
            repulsion: 300,
            gravity: 0.15,
            edgeLength: [60, 120],
            layoutAnimation: true,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: { width: 3 },
          },
        },
      ],
    }

    chartInstance.current.setOption(option)

    const handleResize = () => chartInstance.current?.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
    }
  }, [graphData])

  if (!category) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        <svg className="w-20 h-20 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 
          className="text-white text-2xl mb-2"
          style={{ fontFamily: 'Syncopate, sans-serif' }}
        >
          Categoría no encontrada
        </h2>
        <p className="text-gray-400 mb-6">La categoría que buscas no existe</p>
        <Link 
          to="/"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-colors"
          style={{ fontFamily: 'Syncopate, sans-serif' }}
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
      {/* Header con botón de volver */}
      <div className="mb-6">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span style={{ fontFamily: 'Syncopate, sans-serif' }}>Volver</span>
        </Link>
        
        {/* Info de la categoría */}
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: category.color + '30' }}
          >
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: category.color }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 
              className="text-white text-2xl lowercase"
              style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
            >
              {category.name}
            </h1>
            <p className="text-gray-400">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-8">
        <div className="bg-[#1a1744] rounded-xl px-4 py-3 flex items-center gap-3">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-white">{category.insights.length} insights</span>
        </div>
        <div className="bg-[#1a1744] rounded-xl px-4 py-3 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white">Última actualización: {category.insights[0]?.timeAgo || 'N/A'}</span>
        </div>
      </div>

      {/* Grafo de la categoría */}
      {graphData && (
        <div className="mb-8">
          <h2 
            className="text-white text-xl mb-4 lowercase"
            style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
          >
            mapa de conexiones
          </h2>
          <div 
            ref={chartRef}
            className="w-full h-96 rounded-2xl border border-gray-700"
            style={{ backgroundColor: 'rgba(26, 23, 68, 0.5)' }}
          />
        </div>
      )}

      {/* Insights de la categoría */}
      <div>
        <h2 
          className="text-white text-xl mb-4 lowercase"
          style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
        >
          todos los insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.insights.map((insight) => (
            <InsightCard
              key={insight.id}
              image={insight.image}
              title={insight.title}
              category={insight.subcategory}
              timeAgo={insight.timeAgo}
            />
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-8 flex gap-4">
        <button 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
          style={{ fontFamily: 'Syncopate, sans-serif' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Añadir insight
        </button>
        <button 
          className="bg-[#1a1744] hover:bg-[#252250] text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 border border-gray-600"
          style={{ fontFamily: 'Syncopate, sans-serif' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Editar categoría
        </button>
      </div>
    </div>
  )
}

export default CategoriaDetalle

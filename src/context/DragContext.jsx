import { createContext, useContext, useState } from 'react'

const DragContext = createContext()

export function DragProvider({ children }) {
  const [draggedInsight, setDraggedInsight] = useState(null)
  const [droppedInsights, setDroppedInsights] = useState([])

  const startDrag = (insight) => {
    setDraggedInsight(insight)
  }

  const endDrag = () => {
    setDraggedInsight(null)
  }

  const addDroppedInsight = (insight) => {
    // Evitar duplicados
    if (!droppedInsights.find(i => i.id === insight.id)) {
      setDroppedInsights(prev => [...prev, insight])
    }
  }

  const removeDroppedInsight = (id) => {
    setDroppedInsights(prev => prev.filter(i => i.id !== id))
  }

  const clearDroppedInsights = () => {
    setDroppedInsights([])
  }

  return (
    <DragContext.Provider value={{
      draggedInsight,
      droppedInsights,
      startDrag,
      endDrag,
      addDroppedInsight,
      removeDroppedInsight,
      clearDroppedInsights
    }}>
      {children}
    </DragContext.Provider>
  )
}

export function useDrag() {
  const context = useContext(DragContext)
  if (!context) {
    throw new Error('useDrag must be used within a DragProvider')
  }
  return context
}

import { useState, useMemo } from 'react'

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

// Eventos mockeados
const mockEvents = [
  { id: 1, date: new Date(2026, 1, 23), title: 'Entrega Proyecto', type: 'deadline', color: 'red' },
  { id: 2, date: new Date(2026, 1, 25), title: 'Clase Algoritmos', type: 'class', color: 'blue' },
  { id: 3, date: new Date(2026, 1, 26), title: 'Reunión Equipo', type: 'meeting', color: 'green' },
  { id: 4, date: new Date(2026, 1, 28), title: 'Hackathon', type: 'event', color: 'purple' },
  { id: 5, date: new Date(2026, 2, 2), title: 'Examen Parcial', type: 'exam', color: 'orange' },
  { id: 6, date: new Date(2026, 2, 5), title: 'Tutoría', type: 'meeting', color: 'cyan' },
]

// Animación estilo iOS picker - suave sin rebote
const pickerAnimation = `
  @keyframes picker-snap {
    0% { transform: translateY(var(--direction, 0px)); opacity: 0.6; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes picker-slide-in {
    0% { transform: scale(0.90) translateY(calc(var(--direction, 1) * 6px)); opacity: 0.2; }
    100% { transform: scale(0.92) translateY(0); opacity: 0.4; }
  }
  @keyframes expand-in {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
`

// Colores para eventos
const eventColors = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  cyan: 'bg-cyan-500',
}

function DynamicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(null)
  const [animationKey, setAnimationKey] = useState(0)
  const [animationDirection, setAnimationDirection] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  // Obtener eventos para una fecha
  const getEventsForDate = (date) => {
    return mockEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  // Obtener el primer día del mes y calcular semanas
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const today = new Date()
    
    // Ajustar para que la semana empiece en lunes
    let startDayOfWeek = firstDay.getDay()
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1
    
    const weeks = []
    let currentWeek = []
    
    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i)
      currentWeek.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        date,
        events: getEventsForDate(date)
      })
    }
    
    // Días del mes actual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      const isToday = date.toDateString() === today.toDateString()
      
      currentWeek.push({
        day,
        isCurrentMonth: true,
        isToday,
        date,
        events: getEventsForDate(date)
      })
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }
    
    // Días del próximo mes
    if (currentWeek.length > 0) {
      let nextDay = 1
      while (currentWeek.length < 7) {
        const date = new Date(year, month + 1, nextDay)
        currentWeek.push({
          day: nextDay++,
          isCurrentMonth: false,
          isToday: false,
          date,
          events: getEventsForDate(date)
        })
      }
      weeks.push(currentWeek)
    }
    
    // Determinar qué semana contiene el día actual
    let currentWeekIndex = weeks.findIndex(week => 
      week.some(d => d.isToday)
    )
    
    // Si no hay día actual este mes, usar la primera semana
    if (currentWeekIndex === -1) currentWeekIndex = 0
    
    return { weeks, currentWeekIndex, month, year }
  }, [currentDate])

  // Inicializar con la semana actual
  const activeWeek = selectedWeekIndex ?? calendarData.currentWeekIndex

  // Obtener solo las 3 semanas visibles (anterior, actual, siguiente)
  const visibleWeeks = useMemo(() => {
    const { weeks } = calendarData
    const prevIndex = activeWeek - 1
    const nextIndex = activeWeek + 1
    
    return {
      prev: prevIndex >= 0 ? { week: weeks[prevIndex], index: prevIndex } : null,
      current: { week: weeks[activeWeek], index: activeWeek },
      next: nextIndex < weeks.length ? { week: weeks[nextIndex], index: nextIndex } : null
    }
  }, [calendarData, activeWeek])

  const navigateWeek = (direction) => {
    const newIndex = activeWeek + direction
    if (newIndex >= 0 && newIndex < calendarData.weeks.length) {
      setAnimationDirection(direction)
      setAnimationKey(prev => prev + 1)
      setSelectedWeekIndex(newIndex)
    }
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
    setSelectedWeekIndex(null)
  }

  const canGoPrev = activeWeek > 0
  const canGoNext = activeWeek < calendarData.weeks.length - 1

  // Renderizar indicador de evento
  const EventDot = ({ events, size = 'small' }) => {
    if (events.length === 0) return null
    const dotSize = size === 'small' ? 'w-1 h-1' : 'w-1.5 h-1.5'
    return (
      <div className="flex gap-0.5 justify-center mt-0.5">
        {events.slice(0, 3).map((event, i) => (
          <div key={i} className={`${dotSize} rounded-full ${eventColors[event.color]}`} />
        ))}
      </div>
    )
  }

  // Vista expandida
  if (isExpanded) {
    return (
      <div 
        className="w-full"
        style={{ animation: 'expand-in 0.25s ease-out' }}
      >
        <style>{pickerAnimation}</style>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-white text-xl lowercase"
            style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
          >
            {MONTHS[calendarData.month]} {calendarData.year}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => navigateMonth(-1)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/60 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => navigateMonth(1)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/60 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              onClick={() => setIsExpanded(false)}
              className="w-8 h-8 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center transition-all text-purple-400 hover:text-purple-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day, i) => (
            <div 
              key={i}
              className="text-center text-[10px] text-white/40 uppercase tracking-wider"
              style={{ fontFamily: 'Syncopate, sans-serif' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Todas las semanas */}
        <div className="flex flex-col gap-1">
          {calendarData.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((dayData, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`
                    h-16 flex flex-col items-center justify-start pt-2 rounded-xl transition-all cursor-pointer
                    ${dayData.isToday 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                      : dayData.isCurrentMonth 
                        ? 'bg-white/5 hover:bg-white/10 text-white' 
                        : 'bg-white/[0.02] text-white/20'
                    }
                  `}
                >
                  <span 
                    className="text-sm"
                    style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: dayData.isToday ? '700' : '400' }}
                  >
                    {dayData.day}
                  </span>
                  <EventDot events={dayData.events} size="large" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Lista de eventos del mes */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 
            className="text-white/60 text-xs mb-3 uppercase tracking-wider"
            style={{ fontFamily: 'Syncopate, sans-serif' }}
          >
            próximos eventos
          </h3>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {mockEvents
              .filter(e => e.date.getMonth() === calendarData.month || e.date.getMonth() === calendarData.month + 1)
              .sort((a, b) => a.date - b.date)
              .map(event => (
                <div 
                  key={event.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${eventColors[event.color]}`} />
                  <div className="flex-1">
                    <span className="text-white text-sm">{event.title}</span>
                  </div>
                  <span className="text-white/40 text-xs">
                    {event.date.getDate()} {MONTHS[event.date.getMonth()].slice(0, 3)}
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Estilos de animación iOS picker */}
      <style>{pickerAnimation}</style>
      
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <h2 
          className="text-white text-xl lowercase"
          style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: '600' }}
        >
          {MONTHS[calendarData.month]} {calendarData.year}
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-8 h-8 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center transition-all text-purple-400 hover:text-purple-300"
            title="Ver calendario completo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button 
            onClick={() => navigateMonth(-1)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/60 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => navigateMonth(1)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/60 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day, i) => (
          <div 
            key={i}
            className="text-center text-[10px] text-white/40 uppercase tracking-wider"
            style={{ fontFamily: 'Syncopate, sans-serif' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Contenedor de semanas con navegación */}
      <div className="relative">
        {/* Botón anterior */}
        <button
          onClick={() => navigateWeek(-1)}
          disabled={!canGoPrev}
          className={`absolute right-0 top-0 z-10 transition-all ${
            canGoPrev ? 'opacity-60 cursor-pointer hover:opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <svg className="w-3 h-3 text-white/50 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Semanas */}
        <div className="flex flex-col gap-1 py-4">
          {/* Semana anterior (comprimida) */}
          {visibleWeeks.prev && (
            <div
              key={`prev-${animationKey}`}
              onClick={() => {
                setAnimationDirection(-1)
                setAnimationKey(prev => prev + 1)
                setSelectedWeekIndex(visibleWeeks.prev.index)
              }}
              className="grid grid-cols-7 gap-1 cursor-pointer py-0.5 opacity-40 hover:opacity-60"
              style={{ 
                transform: 'scale(0.92)',
                animation: animationKey > 0 ? 'picker-slide-in 0.2s ease-out' : 'none',
                '--direction': '-1'
              }}
            >
              {visibleWeeks.prev.week.map((dayData, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`
                    h-5 flex items-center justify-center rounded-md transition-all
                    ${dayData.isToday 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                      : dayData.isCurrentMonth 
                        ? 'bg-white/5 text-white' 
                        : 'text-white/20'
                    }
                  `}
                >
                  <span 
                    className="text-[9px]"
                    style={{ fontFamily: 'Syncopate, sans-serif' }}
                  >
                    {dayData.day}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Semana actual (expandida) */}
          <div 
            key={`current-${animationKey}`}
            className="grid grid-cols-7 gap-1 py-2"
            style={{ 
              animation: animationKey > 0 ? 'picker-snap 0.25s ease-out' : 'none',
              '--direction': `${animationDirection * 10}px`
            }}
          >
            {visibleWeeks.current.week.map((dayData, dayIndex) => (
              <div
                key={dayIndex}
                className={`
                  h-14 flex flex-col items-center justify-center rounded-xl transition-all duration-300
                  ${dayData.isToday 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                    : dayData.isCurrentMonth 
                      ? 'bg-white/5 hover:bg-white/10 text-white' 
                      : 'text-white/20'
                  }
                `}
              >
                <span 
                  className="text-base"
                  style={{ fontFamily: 'Syncopate, sans-serif', fontWeight: dayData.isToday ? '700' : '400' }}
                >
                  {dayData.day}
                </span>
                <EventDot events={dayData.events} />
              </div>
            ))}
          </div>

          {/* Semana siguiente (comprimida) */}
          {visibleWeeks.next && (
            <div
              key={`next-${animationKey}`}
              onClick={() => {
                setAnimationDirection(1)
                setAnimationKey(prev => prev + 1)
                setSelectedWeekIndex(visibleWeeks.next.index)
              }}
              className="grid grid-cols-7 gap-1 cursor-pointer py-0.5 opacity-40 hover:opacity-60"
              style={{ 
                transform: 'scale(0.92)',
                animation: animationKey > 0 ? 'picker-slide-in 0.2s ease-out' : 'none',
                '--direction': '1'
              }}
            >
              {visibleWeeks.next.week.map((dayData, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`
                    h-5 flex items-center justify-center rounded-md transition-all
                    ${dayData.isToday 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                      : dayData.isCurrentMonth 
                        ? 'bg-white/5 text-white' 
                        : 'text-white/20'
                    }
                  `}
                >
                  <span 
                    className="text-[9px]"
                    style={{ fontFamily: 'Syncopate, sans-serif' }}
                  >
                    {dayData.day}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={() => navigateWeek(1)}
          disabled={!canGoNext}
          className={`absolute right-0 bottom-0 z-10 transition-all ${
            canGoNext ? 'opacity-60 cursor-pointer hover:opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <svg className="w-3 h-3 text-white/50 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Indicador de semana */}
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {calendarData.weeks.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setAnimationDirection(i > activeWeek ? 1 : -1)
              setAnimationKey(prev => prev + 1)
              setSelectedWeekIndex(i)
            }}
            className={`
              transition-all duration-300 rounded-full
              ${i === activeWeek 
                ? 'w-4 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
              }
            `}
          />
        ))}
      </div>
    </div>
  )
}

export default DynamicCalendar

function InsightCard({ image, title, category, timeAgo }) {
  return (
    <div className="flex flex-col gap-2 cursor-pointer group">
      {/* Imagen o placeholder */}
      <div className="w-48 h-32 rounded-xl overflow-hidden bg-[#1a1744] border border-gray-600">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium truncate max-w-[150px]">{title}</span>
          <span className="text-gray-400 text-xs">{category}</span>
          <span className="text-gray-500 text-xs">{timeAgo}</span>
        </div>
      </div>
    </div>
  )
}

export default InsightCard

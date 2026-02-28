function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex gap-1 bg-[#1a1744] rounded-full p-1 w-fit">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-5 py-2 rounded-full text-sm transition-all duration-200
            ${activeCategory === category
              ? 'bg-gray-500 text-white shadow-md'
              : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          style={{ fontFamily: 'Syncopate, sans-serif' }}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter

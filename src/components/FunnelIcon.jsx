function FunnelIcon({ size = 80, isAnimating = false, isDragging = false, className = '' }) {
  const animationStyle = (delay) => isAnimating ? {
    animation: `funnel-bounce 0.6s ease-out ${delay}s`
  } : {}

  return (
    <div 
      className={`relative flex flex-col items-center justify-center transition-transform duration-300 ${className}`}
      style={{ 
        width: size, 
        height: size,
        transform: isDragging ? 'scaleX(1.3) scaleY(0.9)' : 'scaleX(1) scaleY(1)'
      }}
    >
      <style>
        {`
          @keyframes funnel-bounce {
            0% { transform: scale(1, 1) translateY(0); }
            20% { transform: scale(1.2, 0.8) translateY(5px); }
            40% { transform: scale(0.9, 1.1) translateY(-3px); }
            60% { transform: scale(1.1, 0.9) translateY(2px); }
            80% { transform: scale(0.98, 1.02) translateY(-1px); }
            100% { transform: scale(1, 1) translateY(0); }
          }
        `}
      </style>
      
      {/* Elipse grande (arriba) */}
      <svg 
        className="transition-transform"
        style={{ ...animationStyle(0), marginBottom: -size * 0.08 }}
        width={size * 0.5}
        height={size * 0.32}
        viewBox="0 0 65 27" 
        fill="none"
      >
        <path 
          d="M1 13.5C1 11.9855 1.73491 10.4517 3.25488 8.95898C4.77826 7.4629 7.03398 6.06944 9.90234 4.87793C15.635 2.49669 23.6241 1 32.5 1C41.3759 1 49.365 2.49669 55.0977 4.87793C57.966 6.06944 60.2217 7.4629 61.7451 8.95898C63.2651 10.4517 64 11.9855 64 13.5C64 15.0145 63.2651 16.5483 61.7451 18.041C60.2217 19.5371 57.966 20.9306 55.0977 22.1221C49.365 24.5033 41.3759 26 32.5 26C23.6241 26 15.635 24.5033 9.90234 22.1221C7.03398 20.9306 4.77826 19.5371 3.25488 18.041C1.73491 16.5483 1 15.0145 1 13.5Z" 
          stroke="white"
          strokeWidth="2"
        />
      </svg>

      {/* Elipse mediana (medio) */}
      <svg 
        className="transition-transform"
        style={{ ...animationStyle(0.08), marginBottom: -size * 0.06 }}
        width={size * 0.38}
        height={size * 0.25}
        viewBox="0 0 51 21" 
        fill="none"
      >
        <path 
          d="M1 10.5C1 9.40308 1.53569 8.26464 2.70117 7.12988C3.87007 5.99193 5.61389 4.92059 7.84961 4C12.3163 2.16078 18.5562 1 25.5 1C32.4438 1 38.6837 2.16078 43.1504 4C45.3861 4.92059 47.1299 5.99193 48.2988 7.12988C49.4643 8.26464 50 9.40308 50 10.5C50 11.5969 49.4643 12.7354 48.2988 13.8701C47.1299 15.0081 45.3861 16.0794 43.1504 17C38.6837 18.8392 32.4438 20 25.5 20C18.5562 20 12.3163 18.8392 7.84961 17C5.61389 16.0794 3.87007 15.0081 2.70117 13.8701C1.53569 12.7354 1 11.5969 1 10.5Z" 
          stroke="white"
          strokeWidth="2"
        />
      </svg>

      {/* Elipse pequeña (abajo) */}
      <svg 
        className="transition-transform"
        style={animationStyle(0.16)}
        width={size * 0.26}
        height={size * 0.18}
        viewBox="0 0 34 14" 
        fill="none"
      >
        <path 
          d="M1 7C1 6.38631 1.29783 5.7082 2.0332 4.99219C2.77198 4.27297 3.89373 3.57851 5.36035 2.97461C8.28886 1.76885 12.4036 1 17 1C21.5964 1 25.7111 1.76885 28.6396 2.97461C30.1063 3.57851 31.228 4.27297 31.9668 4.99219C32.7022 5.7082 33 6.38631 33 7C33 7.61369 32.7022 8.2918 31.9668 9.00781C31.228 9.72703 30.1063 10.4215 28.6396 11.0254C25.7111 12.2311 21.5964 13 17 13C12.4036 13 8.28886 12.2311 5.36035 11.0254C3.89373 10.4215 2.77198 9.72703 2.0332 9.00781C1.29783 8.2918 1 7.61369 1 7Z" 
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}

export default FunnelIcon

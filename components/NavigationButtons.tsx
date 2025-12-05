'use client'

interface NavigationButtonsProps {
  onHealthClick: () => void
  onURLClick: () => void
  onGrowthClick: () => void
  activeButton?: 'health' | 'url' | 'growth' | null
}

/**
 * NavigationButtons component for main dashboard navigation
 * 
 * Requirements:
 * - 1.5: Display three navigation buttons at the bottom of the screen after pet is revealed
 * 
 * Features:
 * - Three circular buttons with icons (90x90px touch-optimized)
 * - Left: Health icon (❤️)
 * - Center: URL icon (🔗)
 * - Right: Growth icon (📈)
 * - Active state styling
 * - Touch and click event handling
 */
export default function NavigationButtons({
  onHealthClick,
  onURLClick,
  onGrowthClick,
  activeButton = null,
}: NavigationButtonsProps) {
  // Responsive button sizing: 80px on mobile, 90px on tablet+, 100px on desktop
  const buttonBaseClasses = 
    "flex h-[80px] w-[80px] md:h-[90px] md:w-[90px] lg:h-[100px] lg:w-[100px] items-center justify-center rounded-full shadow-xl transition-all hover:shadow-2xl hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-300 touch-manipulation border-4"
  
  const getButtonClasses = (buttonType: 'health' | 'url' | 'growth') => {
    const isActive = activeButton === buttonType
    return `${buttonBaseClasses} ${
      isActive 
        ? 'bg-gradient-to-br from-sky-400 to-blue-600 ring-4 ring-sky-300 border-white' 
        : 'bg-white border-sky-100 hover:border-sky-300'
    }`
  }

  const getIconClasses = (buttonType: 'health' | 'url' | 'growth') => {
    const isActive = activeButton === buttonType
    return `transition-transform ${isActive ? 'scale-125 animate-bounce' : ''}`
  }

  return (
    <div className="flex justify-center gap-4 md:gap-6 lg:gap-8 animate-fade-in">
      {/* Health Status Button */}
      <button
        onClick={onHealthClick}
        onTouchEnd={onHealthClick}
        className={getButtonClasses('health')}
        aria-label="Health Status"
        type="button"
      >
        <span className={`text-3xl md:text-4xl lg:text-5xl transition-transform ${getIconClasses('health')}`}>
          ❤️
        </span>
      </button>

      {/* URL Input Button */}
      <button
        onClick={onURLClick}
        onTouchEnd={onURLClick}
        className={getButtonClasses('url')}
        aria-label="Submit URL"
        type="button"
      >
        <span className={`text-3xl md:text-4xl lg:text-5xl transition-transform ${getIconClasses('url')}`}>
          🔗
        </span>
      </button>

      {/* Growth Timeline Button */}
      <button
        onClick={onGrowthClick}
        onTouchEnd={onGrowthClick}
        className={getButtonClasses('growth')}
        aria-label="Growth Timeline"
        type="button"
      >
        <span className={`text-3xl md:text-4xl lg:text-5xl transition-transform ${getIconClasses('growth')}`}>
          📈
        </span>
      </button>
    </div>
  )
}

'use client'

import Image from 'next/image'

interface NavigationButtonsProps {
  onHealthClick: () => void
  onURLClick: () => void
  onGrowthClick: () => void
  activeButton?: 'health' | 'url' | 'growth' | null
}

/**
 * NavigationButtons component for main dashboard navigation
 * Matches Figma design with glass effect containers and SVG icons
 */
export default function NavigationButtons({
  onHealthClick,
  onURLClick,
  onGrowthClick,
  activeButton = null,
}: NavigationButtonsProps) {
  const getButtonStyle = (buttonType: 'health' | 'url' | 'growth') => {
    const isActive = activeButton === buttonType
    return {
      background: isActive 
        ? 'rgba(135, 206, 235, 0.8)' 
        : 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      boxShadow: isActive
        ? '0 8px 32px 0 rgba(135, 206, 235, 0.4)'
        : '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
    }
  }

  return (
    <div className="flex justify-center gap-[47px]">
      {/* Health Button */}
      <button
        onClick={onHealthClick}
        className="flex h-[90px] w-[90px] items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 focus:outline-none touch-manipulation"
        style={getButtonStyle('health')}
        aria-label="Health Status"
        type="button"
      >
        <Image 
          src="/icon-health.svg" 
          alt="Health" 
          width={50} 
          height={45}
          className="transition-all"
        />
      </button>

      {/* URL Button */}
      <button
        onClick={onURLClick}
        className="flex h-[90px] w-[90px] items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 focus:outline-none touch-manipulation"
        style={getButtonStyle('url')}
        aria-label="Submit URL"
        type="button"
      >
        <Image 
          src="/icon-url.svg" 
          alt="URL" 
          width={50} 
          height={52}
          className="transition-all"
        />
      </button>

      {/* Growth Button */}
      <button
        onClick={onGrowthClick}
        className="flex h-[90px] w-[90px] items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 focus:outline-none touch-manipulation"
        style={getButtonStyle('growth')}
        aria-label="Growth Timeline"
        type="button"
      >
        <Image 
          src="/icon-growth.svg" 
          alt="Growth" 
          width={50} 
          height={50}
          className="transition-all"
        />
      </button>
    </div>
  )
}

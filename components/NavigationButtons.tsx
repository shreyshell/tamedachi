'use client'

interface NavigationButtonsProps {
  onHealthClick: () => void
  onURLClick: () => void
  onGrowthClick: () => void
  activeButton?: 'health' | 'url' | 'growth' | null
}

/**
 * NavigationButtons component for main dashboard navigation
 * Matches Figma design with SVG icons and exact styling
 */
export default function NavigationButtons({
  onHealthClick,
  onURLClick,
  onGrowthClick,
  activeButton = null,
}: NavigationButtonsProps) {
  const getButtonClasses = (buttonType: 'health' | 'url' | 'growth') => {
    const isActive = activeButton === buttonType
    return `flex h-[90px] w-[90px] items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 focus:outline-none touch-manipulation ${
      isActive 
        ? 'bg-sky-blue shadow-2xl' 
        : 'bg-white shadow-lg hover:shadow-xl'
    }`
  }

  const getIconColor = (buttonType: 'health' | 'url' | 'growth') => {
    return activeButton === buttonType ? '#FFFFFF' : '#87CEEB'
  }

  return (
    <div className="flex justify-center gap-[47px]">
      {/* Health Button */}
      <button
        onClick={onHealthClick}
        className={getButtonClasses('health')}
        aria-label="Health Status"
        type="button"
      >
        <svg width="50" height="45" viewBox="0 0 50 45" fill="none">
          <path
            d="M25 45L21.875 42.1875C8.75 30.3125 0 22.4375 0 12.8125C0 5.9375 5.4375 0.5 12.3125 0.5C16.1875 0.5 19.9375 2.3125 22.5 5.1875H27.5C30.0625 2.3125 33.8125 0.5 37.6875 0.5C44.5625 0.5 50 5.9375 50 12.8125C50 22.4375 41.25 30.3125 28.125 42.1875L25 45Z"
            fill={getIconColor('health')}
          />
        </svg>
      </button>

      {/* URL Button */}
      <button
        onClick={onURLClick}
        className={getButtonClasses('url')}
        aria-label="Submit URL"
        type="button"
      >
        <svg width="50" height="52" viewBox="0 0 50 52" fill="none">
          <path
            d="M22.5 28.5L27.5 23.5M27.5 28.5L22.5 23.5M11.25 15H13.75C16.875 15 19.375 12.5 19.375 9.375V7.5C19.375 4.375 21.875 1.875 25 1.875C28.125 1.875 30.625 4.375 30.625 7.5V9.375C30.625 12.5 33.125 15 36.25 15H38.75M11.25 37H13.75C16.875 37 19.375 39.5 19.375 42.625V44.5C19.375 47.625 21.875 50.125 25 50.125C28.125 50.125 30.625 47.625 30.625 44.5V42.625C30.625 39.5 33.125 37 36.25 37H38.75M6.25 26C6.25 23.75 8.125 21.875 10.375 21.875H12.5C14.75 21.875 16.625 20 16.625 17.75V15.625C16.625 13.375 18.5 11.5 20.75 11.5H29.25C31.5 11.5 33.375 13.375 33.375 15.625V17.75C33.375 20 35.25 21.875 37.5 21.875H39.625C41.875 21.875 43.75 23.75 43.75 26C43.75 28.25 41.875 30.125 39.625 30.125H37.5C35.25 30.125 33.375 32 33.375 34.25V36.375C33.375 38.625 31.5 40.5 29.25 40.5H20.75C18.5 40.5 16.625 38.625 16.625 36.375V34.25C16.625 32 14.75 30.125 12.5 30.125H10.375C8.125 30.125 6.25 28.25 6.25 26Z"
            stroke={getIconColor('url')}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Growth Button */}
      <button
        onClick={onGrowthClick}
        className={getButtonClasses('growth')}
        aria-label="Growth Timeline"
        type="button"
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path
            d="M45 45H5V5M10 35L20 25L27.5 32.5L45 15"
            stroke={getIconColor('growth')}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

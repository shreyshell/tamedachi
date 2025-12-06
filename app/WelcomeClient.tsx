'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function WelcomeClient() {
  const router = useRouter()
  const [tapCount, setTapCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'tap1' | 'tap2' | 'tap3-down' | 'tap3-left' | 'tap3-right' | 'tap3-left2' | 'tap3-disappear'>('idle')

  const handleEggTap = () => {
    if (isAnimating || tapCount >= 3) return

    setIsAnimating(true)
    const newTapCount = tapCount + 1
    setTapCount(newTapCount)

    if (newTapCount === 1) {
      // Tap 1: Show crack 1
      setAnimationPhase('tap1')
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    } else if (newTapCount === 2) {
      // Tap 2: Show crack 2 and crack 3
      setAnimationPhase('tap2')
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    } else if (newTapCount === 3) {
      // Tap 3: Complex animation sequence
      // 1. Come down
      setAnimationPhase('tap3-down')
      setTimeout(() => {
        // 2. Shake left
        setAnimationPhase('tap3-left')
        setTimeout(() => {
          // 3. Shake right
          setAnimationPhase('tap3-right')
          setTimeout(() => {
            // 4. Shake left again
            setAnimationPhase('tap3-left2')
            setTimeout(() => {
              // 5. Disappear
              setAnimationPhase('tap3-disappear')
              setTimeout(() => {
                // Navigate to dashboard
                router.push('/dashboard')
              }, 500)
            }, 150)
          }, 150)
        }, 150)
      }, 200)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B0E0E6] to-[#E0F2F7]">
      {/* Background Decorative Vectors */}
      
      {/* Cloud 1 - Top Left */}
      <div className="absolute top-[80px] left-[-100px] opacity-90">
        <Image src="/cloud1.svg" alt="" width={425} height={155} />
      </div>

      {/* Cloud 2 - Bottom */}
      <div className="absolute bottom-0 left-0 opacity-90">
        <Image src="/cloud2.svg" alt="" width={400} height={163} />
      </div>

      {/* Cloud 3 - Top Right */}
      <div className="absolute top-[120px] right-[-150px] opacity-90">
        <Image src="/cloud3.svg" alt="" width={265} height={118} />
      </div>

      {/* Satellite - Top Right */}
      <div className="absolute top-[40px] right-[60px] opacity-85">
        <Image src="/satellite.svg" alt="" width={93} height={93} />
      </div>

      {/* Nature - Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <Image src="/nature.svg" alt="" width={1440} height={200} className="w-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Welcome Text */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome!
          </h1>
          <p className="text-lg text-white/90">
            Tap the egg to meet your Tamedachi
          </p>
        </div>

        {/* Egg Component with Animations */}
        <button
          onClick={handleEggTap}
          disabled={tapCount >= 3}
          className={`
            relative cursor-pointer transition-all duration-300 touch-manipulation
            ${tapCount >= 3 ? 'cursor-default' : 'hover:scale-105 active:scale-95'}
            ${animationPhase === 'tap3-down' ? 'animate-egg-down' : ''}
            ${animationPhase === 'tap3-left' ? 'animate-egg-shake-left' : ''}
            ${animationPhase === 'tap3-right' ? 'animate-egg-shake-right' : ''}
            ${animationPhase === 'tap3-left2' ? 'animate-egg-shake-left' : ''}
            ${animationPhase === 'tap3-disappear' ? 'animate-egg-disappear' : ''}
          `}
          aria-label="Tap the egg to hatch your pet"
        >
          <div className="relative w-[300px] h-[399px]">
            {/* Base Egg */}
            <Image 
              src="/egg-base.svg" 
              alt="Egg" 
              width={300} 
              height={399}
              className="absolute inset-0"
              priority
            />

            {/* Crack 1 - Appears after tap 1 */}
            {tapCount >= 1 && (
              <Image 
                src="/egg-crack1.svg" 
                alt="" 
                width={144} 
                height={169}
                className={`absolute top-[100px] left-[80px] transition-opacity duration-300 ${
                  animationPhase === 'tap1' ? 'animate-fade-in' : 'opacity-100'
                }`}
                priority
              />
            )}

            {/* Crack 2 - Appears after tap 2 */}
            {tapCount >= 2 && (
              <Image 
                src="/egg-crack2.svg" 
                alt="" 
                width={109} 
                height={138}
                className={`absolute top-[130px] left-[95px] transition-opacity duration-300 ${
                  animationPhase === 'tap2' ? 'animate-fade-in' : 'opacity-100'
                }`}
              />
            )}

            {/* Crack 3 - Appears after tap 2 */}
            {tapCount >= 2 && (
              <Image 
                src="/egg-crack3.svg" 
                alt="" 
                width={93} 
                height={222}
                className={`absolute top-[90px] left-[105px] transition-opacity duration-300 ${
                  animationPhase === 'tap2' ? 'animate-fade-in' : 'opacity-100'
                }`}
                style={{ animationDelay: '0.1s' }}
              />
            )}
          </div>
        </button>

        {/* Tap Counter (optional, for debugging) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 text-white text-sm">
            Taps: {tapCount}/3
          </div>
        )}
      </div>
    </div>
  )
}

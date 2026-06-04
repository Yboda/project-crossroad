"use client"

import { useState } from "react"
import { useGameStore } from "@/lib/game-store"
import { GothicButton, Divider } from "@/components/game/ui-components"
import { motion, AnimatePresence } from "framer-motion"

type EndingType = 'false' | 'true' | 'secret'

interface EndingData {
  type: EndingType
  title: string
  subtitle: string
  description: string[]
  icon: string
}

const ENDINGS: Record<EndingType, EndingData> = {
  false: {
    type: 'false',
    title: '가짜 출구',
    subtitle: 'False Ending',
    description: [
      '문 너머로 빛이 보였다.',
      '손을 뻗어 문을 열었을 때,',
      '당신은 다시 시체더미의 방에 서 있었다.',
      '',
      '출구는 없었다.',
      '아니, 이것이 출구였을지도 모른다.',
      '',
      '루프는 계속된다.'
    ],
    icon: '🚪'
  },
  true: {
    type: 'true',
    title: '지상문',
    subtitle: 'True Ending',
    description: [
      '문지기가 쓰러지고,',
      '닫혀있던 문이 열렸다.',
      '',
      '문 너머로 하늘이 보였다.',
      '해가 없는 하늘이었지만,',
      '그래도 하늘이었다.',
      '',
      '당신은 처음으로 미궁을 벗어났다.',
      '',
      '...정말로?'
    ],
    icon: '🌅'
  },
  secret: {
    type: 'secret',
    title: '아래에서 오는 빛',
    subtitle: 'Secret Ending',
    description: [
      '지상문을 외면하고,',
      '당신은 더 깊은 곳으로 내려갔다.',
      '',
      '중심부.',
      '모든 것이 시작된 곳.',
      '',
      '그곳에서 당신은 보았다.',
      '무너지지 않는 첫 번째 육체를.',
      '기억하지 못하는 첫 번째 영혼을.',
      '',
      '당신 자신을.'
    ],
    icon: '👁️'
  }
}

export function EndingScreen() {
  const { setScreen, updateStats, traces } = useGameStore()
  const [currentEnding] = useState<EndingType>('false') // Default to false ending for demo
  const [textIndex, setTextIndex] = useState(0)
  const [showCredits, setShowCredits] = useState(false)
  
  const ending = ENDINGS[currentEnding]

  const handleContinue = () => {
    if (textIndex < ending.description.length - 1) {
      setTextIndex(prev => prev + 1)
    } else if (!showCredits) {
      setShowCredits(true)
    } else {
      // Return to lobby with bonus traces
      const bonusTraces = currentEnding === 'false' ? 200 : currentEnding === 'true' ? 500 : 1000
      updateStats({ traces: traces + bonusTraces })
      setScreen('lobby')
    }
  }

  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {currentEnding === 'false' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,107,50,0.1)_0%,transparent_70%)]" />
        )}
        {currentEnding === 'true' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,200,100,0.1)_0%,transparent_60%)]" />
        )}
        {currentEnding === 'secret' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(100,150,255,0.1)_0%,transparent_60%)]" />
        )}
      </div>

      <AnimatePresence mode="wait">
        {!showCredits ? (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center w-full max-w-sm"
            onClick={handleContinue}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="text-6xl mb-8"
            >
              {ending.icon}
            </motion.div>

            {/* Title */}
            <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-2">
              {ending.subtitle}
            </span>
            <h1 className="text-3xl font-serif text-gold-bright mb-8">
              {ending.title}
            </h1>

            <Divider className="w-full mb-8" />

            {/* Story Text */}
            <div className="min-h-[200px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={textIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-zinc-400 text-center font-serif leading-relaxed"
                >
                  {ending.description[textIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1 }}
              className="text-[10px] text-zinc-600 mt-8"
            >
              탭하여 계속
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="credits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col items-center w-full max-w-sm"
          >
            <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-4">
              Ending Reached
            </span>
            
            <h2 className="text-2xl font-serif text-gold-bright mb-2">
              {ending.title}
            </h2>
            
            <p className="text-xs text-zinc-500 mb-8">
              {currentEnding === 'false' && '새로운 시작을 위해 돌아갑니다.'}
              {currentEnding === 'true' && '탈출에 성공했습니다.'}
              {currentEnding === 'secret' && '진실을 마주했습니다.'}
            </p>

            <div className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded mb-8">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">획득한 영혼의 흔적</span>
                <span className="text-gold">
                  +{currentEnding === 'false' ? 200 : currentEnding === 'true' ? 500 : 1000}
                </span>
              </div>
            </div>

            <GothicButton onClick={handleContinue}>
              시체더미의 방으로
            </GothicButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

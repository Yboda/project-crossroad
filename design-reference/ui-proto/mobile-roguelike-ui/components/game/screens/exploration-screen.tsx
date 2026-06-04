"use client"

import { useGameStore } from "@/lib/game-store"
import { TopHUD, FloorBanner } from "@/components/game/hud"
import { Panel, GothicButton, ChoiceCard } from "@/components/game/ui-components"
import { motion } from "framer-motion"

const ROOM_TYPES = [
  { type: 'combat', icon: '⚔️', label: '전투', desc: '적이 앞을 가로막고 있다.' },
  { type: 'event', icon: '❓', label: '이벤트', desc: '수상한 무언가가 있다.' },
  { type: 'shop', icon: '🪙', label: '상점', desc: '어둠 속에서 상인이 기다린다.' },
  { type: 'rest', icon: '🔥', label: '휴식', desc: '희미한 불빛이 보인다.' },
]

export function ExplorationScreen() {
  const { setScreen, currentRoom, updateStats, floorName } = useGameStore()
  
  // Generate random choices for this room
  const getRandomChoices = () => {
    const choices = [...ROOM_TYPES]
    const shuffled = choices.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }
  
  const choices = getRandomChoices()
  
  const handleChoice = (type: string) => {
    updateStats({ currentRoom: currentRoom + 1 })
    
    switch (type) {
      case 'combat':
        setScreen('combat')
        break
      case 'event':
        setScreen('event')
        break
      case 'shop':
        setScreen('shop')
        break
      case 'rest':
        setScreen('rest')
        break
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <TopHUD />
      <FloorBanner />
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-30"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=800&q=80)',
            filter: 'blur(1px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505]" />
      </div>

      {/* Character Silhouette Area */}
      <div className="relative z-10 flex-1 flex items-end justify-start p-8 pb-0">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-24 h-40 relative"
        >
          {/* Player silhouette - hooded figure */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-900/50 rounded-t-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-32 bg-zinc-900/80 rounded-t-full" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-12 bg-zinc-800/80 rounded-t-full" />
        </motion.div>
      </div>

      {/* Narrative & Choices Panel */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 p-6 pb-8"
      >
        {/* Narrative */}
        <Panel className="p-4 mb-6 border-l-2 border-l-gold-dim">
          <p className="text-sm leading-relaxed text-zinc-300 mb-2">
            어두운 복도 끝에서 불길한 숨소리가 들려온다. 공기 중에 피비린내가 섞여 있다.
          </p>
          <p className="text-zinc-500 text-xs">
            갈림길이 나타났다. 어디로 향할 것인가?
          </p>
        </Panel>

        {/* Choices */}
        <div className="flex flex-col gap-3">
          {choices.map((choice, index) => (
            <motion.div
              key={choice.type}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChoiceCard
                onClick={() => handleChoice(choice.type)}
                icon={choice.icon}
                variant={choice.type === 'combat' ? 'danger' : choice.type === 'rest' ? 'safe' : 'normal'}
              >
                <span className="font-serif text-gold-bright">{choice.label}</span>
                <span className="text-zinc-500 text-xs block mt-0.5">{choice.desc}</span>
              </ChoiceCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

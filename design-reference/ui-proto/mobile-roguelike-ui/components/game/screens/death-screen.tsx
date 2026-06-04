"use client"

import { useGameStore } from "@/lib/game-store"
import { GothicButton, Divider } from "@/components/game/ui-components"
import { Flame, Skull } from "lucide-react"
import { motion } from "framer-motion"

export function DeathScreen() {
  const { traces, setScreen, updateStats, selectBody, bodyName } = useGameStore()

  const tracesGained = Math.floor(Math.random() * 100) + 50

  const handleRestart = () => {
    // Reset character stats
    selectBody(bodyName)
    updateStats({ 
      gold: 100,
      level: 1,
      exp: 0,
      maxExp: 100,
      relics: [],
      currentFloor: 1,
      currentRoom: 1,
      floorName: '시체더미의 저층',
      currentEnemy: null,
      combatLogs: [],
      traces: traces + tracesGained,
    })
    setScreen('lobby')
  }

  return (
    <div className="relative w-full h-full bg-[#0a0505] flex flex-col items-center justify-center p-6 z-50 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-luminosity opacity-10"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=800&q=80)' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(153,27,27,0.15)_0%,rgba(0,0,0,1)_80%)]" />
      
      {/* Blood drip effect */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blood/20 to-transparent" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center w-full max-w-sm"
      >
        {/* Skull Icon */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Skull className="w-20 h-20 text-red-900/60 mb-6 drop-shadow-[0_0_20px_rgba(153,27,27,0.6)]" />
        </motion.div>
        
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] tracking-[0.5em] text-red-900/80 mb-2 uppercase"
        >
          Journey Ended
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-4xl font-serif text-red-800/90 mb-4 drop-shadow-[0_0_15px_rgba(153,27,27,0.3)]"
        >
          육체가 무너졌습니다
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-zinc-600 text-center mb-8 font-serif"
        >
          그러나 영혼은 남습니다.<br/>
          기억과 흔적은 사라지지 않습니다.
        </motion.p>

        <Divider className="w-full mb-8" />

        {/* Traces Gained */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="w-full flex flex-col items-center gap-2 mb-8 p-6 border border-red-900/20 bg-black/50 rounded"
        >
          <span className="text-xs text-zinc-500 mb-2">남겨진 영혼의 흔적</span>
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3, type: "spring" }}
            className="flex items-center gap-2 text-2xl text-gold"
          >
            + {tracesGained} <Flame className="w-6 h-6" />
          </motion.div>
          <span className="text-[10px] text-zinc-600 mt-2">
            총 흔적: {(traces + tracesGained).toLocaleString()}
          </span>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="w-full"
        >
          <GothicButton onClick={handleRestart} variant="danger">
            시체더미의 방으로 돌아간다
          </GothicButton>
        </motion.div>
      </motion.div>
    </div>
  )
}

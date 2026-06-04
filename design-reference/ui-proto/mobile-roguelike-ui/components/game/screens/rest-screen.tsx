"use client"

import { useGameStore } from "@/lib/game-store"
import { Panel, GothicButton, Divider } from "@/components/game/ui-components"
import { Flame, Heart, Battery } from "lucide-react"
import { motion } from "framer-motion"

export function RestScreen() {
  const { hp, maxHp, mp, maxMp, heal, restoreMp, setScreen } = useGameStore()

  const handleHeal = () => {
    const healAmount = Math.floor(maxHp * 0.3)
    heal(healAmount)
    setScreen('explore')
  }

  const handleRestoreMp = () => {
    const restoreAmount = Math.floor(maxMp * 0.5)
    restoreMp(restoreAmount)
    setScreen('explore')
  }

  const handleLeave = () => {
    setScreen('explore')
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      {/* Background with warm glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(255,140,50,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(193,163,95,0.05)_0%,transparent_40%)]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-6">
        {/* Campfire Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 rounded-full bg-gradient-to-t from-orange-900/50 via-orange-600/30 to-transparent flex items-center justify-center"
          >
            <span className="text-5xl">🔥</span>
          </motion.div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 bg-orange-500/10 rounded-full blur-xl scale-150" />
        </motion.div>

        <Panel className="w-full max-w-sm p-6 flex flex-col items-center">
          <span className="text-[10px] tracking-widest text-zinc-500 uppercase mb-2">Rest Point</span>
          <h2 className="text-xl font-serif text-gold-bright mb-2">꺼지지 않는 모닥불</h2>
          
          <p className="text-xs text-zinc-500 text-center mb-4">
            따뜻하지만 어딘가 수상한 불빛이다.<br/>
            잠시 쉬어갈 수 있을 것 같다.
          </p>
          
          <Divider className="w-full my-4" />

          {/* Current Stats */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 p-3 bg-zinc-900/50 rounded border border-zinc-800">
              <Heart className="w-4 h-4 text-blood" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">생명력</span>
                <span className="text-sm text-gold-bright">{hp} / {maxHp}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-zinc-900/50 rounded border border-zinc-800">
              <Battery className="w-4 h-4 text-mana" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">정신력</span>
                <span className="text-sm text-gold-bright">{mp} / {maxMp}</span>
              </div>
            </div>
          </div>

          {/* Choices */}
          <div className="w-full flex flex-col gap-3">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <GothicButton onClick={handleHeal} variant="primary" icon={Heart}>
                <span className="flex flex-col items-center">
                  <span>상처를 돌본다</span>
                  <span className="text-[10px] text-zinc-400">HP 30% 회복</span>
                </span>
              </GothicButton>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GothicButton onClick={handleRestoreMp} variant="secondary" icon={Battery}>
                <span className="flex flex-col items-center">
                  <span>호흡을 가다듬는다</span>
                  <span className="text-[10px] text-zinc-500">MP 50% 회복</span>
                </span>
              </GothicButton>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GothicButton onClick={handleLeave} variant="ghost">
                바로 떠난다
              </GothicButton>
            </motion.div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

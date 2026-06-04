"use client"

import { useGameStore } from "@/lib/game-store"
import { GothicButton, Divider } from "@/components/game/ui-components"
import { Flame, Hexagon, Ghost } from "lucide-react"
import { motion } from "framer-motion"

export function LobbyScreen() {
  const { traces, engravings, bodyName, setScreen } = useGameStore()
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=800&q=80)',
          filter: 'blur(1px)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-transparent to-[#050505]" />
      
      {/* Candle Glow Effect */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(193,163,95,0.08)_0%,transparent_70%)]" />

      {/* Top Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full p-6 flex justify-end gap-4 text-xs font-serif text-gold"
      >
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-zinc-800/50">
          <Flame className="w-4 h-4 opacity-80" />
          <span>{traces.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-zinc-800/50">
          <Hexagon className="w-4 h-4 opacity-80" />
          <span>{engravings} / 10</span>
        </div>
      </motion.div>

      {/* Title Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex flex-col items-center gap-4 -mt-20"
      >
        <span className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase">Corpse Chamber</span>
        <h1 className="text-4xl font-serif text-gold-bright drop-shadow-[0_0_10px_rgba(232,220,199,0.2)]">
          시체더미의 방
        </h1>
        <Divider className="w-32 mt-2" />
        
        {/* Atmospheric Text */}
        <p className="text-xs text-zinc-600 text-center max-w-[200px] mt-4 leading-relaxed">
          죽음 이후에도 깨어나는 장소.<br/>
          영혼은 남고, 육체만 바뀐다.
        </p>
      </motion.div>

      {/* Bottom Actions */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 w-full p-6 flex flex-col gap-6"
      >
        {/* Selected Body Display */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] text-zinc-500 tracking-widest">현재 깃든 그릇</span>
          <div className="flex items-center gap-3 px-6 py-3 rounded border border-zinc-800 bg-zinc-950/80 backdrop-blur">
            <Ghost className="w-5 h-5 text-zinc-600" />
            <span className="text-sm font-serif text-gold-bright">{bodyName}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <GothicButton onClick={() => setScreen('body-select')} variant="secondary">
            육체 선택
          </GothicButton>
          <GothicButton onClick={() => setScreen('engraving')} variant="secondary">
            영혼 각인
          </GothicButton>
          <GothicButton 
            onClick={() => setScreen('explore')} 
            variant="primary" 
            className="mt-2 py-4"
          >
            탐험 시작
          </GothicButton>
        </div>
      </motion.div>
    </div>
  )
}

"use client"

import { useGameStore } from "@/lib/game-store"
import { cn } from "@/lib/utils"
import { StatBar } from "./ui-components"
import { Flame, Coins, Settings, Ghost, Menu } from "lucide-react"
import { motion } from "framer-motion"

export function TopHUD() {
  const { 
    hp, maxHp, mp, maxMp, gold, traces, level, bodyName,
    currentFloor, floorName,
    openModal 
  } = useGameStore()
  
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none"
    >
      {/* Left Side - Character Info */}
      <div className="flex flex-col gap-1.5 pointer-events-auto">
        {/* Floor Info - Above Character */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-gold-dim/60" />
          <span className="text-[10px] text-zinc-500 tracking-wide">{currentFloor}F · {floorName}</span>
        </div>
        
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => openModal('status')}
        >
          <div className="w-10 h-10 rounded border border-gold-dim bg-zinc-900 flex items-center justify-center shadow-[0_0_10px_rgba(138,107,50,0.2)]">
            <Ghost className="w-5 h-5 text-gold" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gold font-serif leading-none mb-1">{bodyName}</span>
            <span className="text-[10px] text-zinc-500 leading-none">Lv.{level}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-24">
          <StatBar value={hp} max={maxHp} colorClass="bg-blood shadow-[0_0_5px_rgba(139,32,32,0.5)]" />
          <StatBar value={mp} max={maxMp} colorClass="bg-mana shadow-[0_0_5px_rgba(68,102,170,0.5)]" />
        </div>
      </div>
      
      {/* Right Side - Resources */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 text-xs text-gold">
          <span>{traces.toLocaleString()}</span>
          <Flame className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span>{gold}</span>
          <Coins className="w-3.5 h-3.5" />
        </div>
        <button 
          className="mt-1 p-1.5 rounded bg-zinc-900/50 border border-zinc-800 text-zinc-500 hover:text-zinc-300"
          onClick={() => {}}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Simple Header for non-exploration screens
interface ScreenHeaderProps {
  title: string
  onBack?: () => void
  rightContent?: React.ReactNode
}

export function ScreenHeader({ title, onBack, rightContent }: ScreenHeaderProps) {
  return (
    <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/80">
      {onBack ? (
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <div className="w-9" />
      )}
      <h1 className="text-lg font-serif text-gold-bright">{title}</h1>
      {rightContent || <div className="w-9" />}
    </div>
  )
}

// Floor Info Banner
export function FloorBanner() {
  const { floorName, currentFloor, currentRoom } = useGameStore()
  
  return (
    <div className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none z-30">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 py-1.5 bg-black/60 border border-zinc-800 rounded-full"
      >
        <span className="text-[10px] text-zinc-500 tracking-wider">
          {floorName} · 방 {currentRoom}
        </span>
      </motion.div>
    </div>
  )
}

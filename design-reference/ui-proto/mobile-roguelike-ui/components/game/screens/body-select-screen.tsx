"use client"

import { useState } from "react"
import { useGameStore, BodyType } from "@/lib/game-store"
import { ScreenHeader } from "@/components/game/hud"
import { GothicButton } from "@/components/game/ui-components"
import { Sword, Shield, Heart, Battery } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const BODIES = [
  { 
    name: '검사의 육체' as BodyType, 
    desc: '낡은 검술의 기억이 남은 육체. 물리적인 힘이 강하다.', 
    hp: 50, mp: 20, atk: 12, def: 8,
    icon: '⚔️'
  },
  { 
    name: '수도자의 육체' as BodyType, 
    desc: '고통을 참고 호흡을 가다듬는 육체. 방어와 회복에 특화.', 
    hp: 60, mp: 30, atk: 8, def: 12,
    icon: '🙏'
  },
  { 
    name: '도적의 육체' as BodyType, 
    desc: '그림자 속에서 먼저 움직이는 육체. 민첩하고 치명적.', 
    hp: 40, mp: 25, atk: 15, def: 5,
    icon: '🗡️'
  },
  { 
    name: '영매의 육체' as BodyType, 
    desc: '죽은 시간의 목소리를 듣는 육체. 영혼과 마나에 연결.', 
    hp: 35, mp: 60, atk: 6, def: 6,
    icon: '🔮'
  },
]

export function BodySelectScreen() {
  const { bodyName, selectBody, setScreen } = useGameStore()
  const [selected, setSelected] = useState<BodyType>(bodyName)

  const handleSelect = () => {
    selectBody(selected)
    setScreen('lobby')
  }

  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col">
      <ScreenHeader 
        title="육체 선택" 
        onBack={() => setScreen('lobby')} 
      />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
        {BODIES.map((body, index) => (
          <motion.div 
            key={body.name}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelected(body.name)}
            className={cn(
              "p-4 rounded border transition-all duration-300 cursor-pointer",
              selected === body.name 
                ? "border-gold-dim bg-[#1a1510] shadow-[0_0_20px_rgba(138,107,50,0.1)]" 
                : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{body.icon}</span>
                <div>
                  <h3 className={cn(
                    "text-base font-serif mb-1 transition-colors",
                    selected === body.name ? "text-gold-bright" : "text-zinc-400"
                  )}>
                    {body.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 max-w-[200px]">{body.desc}</p>
                </div>
              </div>
              {selected === body.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 rounded-full bg-gold flex items-center justify-center"
                >
                  <span className="text-[10px] text-black">✓</span>
                </motion.div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800/50">
              <StatItem icon={Heart} value={body.hp} color="text-blood" />
              <StatItem icon={Battery} value={body.mp} color="text-mana" />
              <StatItem icon={Sword} value={body.atk} color="text-zinc-500" />
              <StatItem icon={Shield} value={body.def} color="text-zinc-500" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
        <GothicButton onClick={handleSelect} disabled={!selected}>
          이 그릇을 취한다
        </GothicButton>
      </div>
    </div>
  )
}

function StatItem({ icon: Icon, value, color }: { icon: any; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-xs">
      <Icon className={cn("w-3.5 h-3.5", color)} />
      <span className="text-zinc-400">{value}</span>
    </div>
  )
}

"use client"

import { useGameStore, Relic } from "@/lib/game-store"
import { Panel, GothicButton, Divider } from "@/components/game/ui-components"
import { Flame, Coins, Sparkles, Sword, Shield, Heart } from "lucide-react"
import { motion } from "framer-motion"

const RANDOM_RELICS: Relic[] = [
  { id: 'black-thorn', name: '검은 가시', description: '공격 시 추가 피해 +2', icon: '🌿', effect: '날카로운 가지가 피를 원한다.' },
  { id: 'broken-shield', name: '낡은 방패 파편', description: '방어 시 MP +3 회복', icon: '🛡️', effect: '부서졌지만 기억은 남아있다.' },
  { id: 'mist-step', name: '안개 발걸음', description: '전투 시작 시 기습 확률 20%', icon: '👣', effect: '존재를 희미하게 만든다.' },
]

interface RewardOption {
  type: 'attack' | 'defense' | 'survival' | 'relic'
  name: string
  description: string
  icon: any
  relic?: Relic
}

export function VictoryScreen() {
  const { 
    gainGold, gainTraces, gainExp, updateStats,
    setScreen, openModal, setEnemy, clearCombatLogs,
    attack, defense, maxHp
  } = useGameStore()

  const goldReward = Math.floor(Math.random() * 20) + 10
  const traceReward = Math.floor(Math.random() * 30) + 30
  const expReward = Math.floor(Math.random() * 30) + 20
  const randomRelic = RANDOM_RELICS[Math.floor(Math.random() * RANDOM_RELICS.length)]

  const rewardOptions: RewardOption[] = [
    { type: 'attack', name: '공격 강화', description: '공격력 +2', icon: Sword },
    { type: 'defense', name: '방어 강화', description: '방어력 +2', icon: Shield },
    { type: 'survival', name: '생존 강화', description: '최대 HP +8', icon: Heart },
  ]

  const handleReward = (option: RewardOption) => {
    // Apply rewards
    gainGold(goldReward)
    gainTraces(traceReward)
    gainExp(expReward)
    
    // Apply chosen stat bonus
    if (option.type === 'attack') updateStats({ attack: attack + 2 })
    if (option.type === 'defense') updateStats({ defense: defense + 2 })
    if (option.type === 'survival') updateStats({ maxHp: maxHp + 8 })
    
    // Show relic modal
    openModal('relic', randomRelic)
    
    // Reset combat state
    setEnemy(null)
    clearCombatLogs()
    
    // Navigate to exploration after modal closes
    setTimeout(() => setScreen('explore'), 100)
  }

  return (
    <div className="relative w-full h-full bg-[#050505] flex items-center justify-center p-6 z-20">
      {/* Golden glow background */}
      <div className="absolute inset-0 bg-gradient-to-t from-gold-dim/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(193,163,95,0.1)_0%,transparent_70%)]" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Panel className="w-full max-w-sm p-6 flex flex-col items-center border-gold-dim/30">
          <span className="text-[10px] tracking-[0.4em] text-gold mb-2 uppercase">Battle Won</span>
          <h1 className="text-3xl font-serif text-gold-bright mb-2">전투 승리</h1>
          
          <Divider className="w-full my-4" />

          {/* Rewards */}
          <div className="w-full flex flex-col gap-2 mb-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded"
            >
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Flame className="w-4 h-4 text-gold" /> 영혼의 흔적
              </div>
              <span className="text-gold-bright">+ {traceReward}</span>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded"
            >
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Coins className="w-4 h-4 text-yellow-600" /> 금화
              </div>
              <span className="text-gold-bright">+ {goldReward}</span>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between p-3 bg-[#1a1510] border border-gold-dim/50 rounded shadow-[0_0_10px_rgba(138,107,50,0.1)]"
            >
              <div className="flex items-center gap-2 text-sm text-gold-bright">
                <Sparkles className="w-4 h-4 text-gold" /> 미확인 유물
              </div>
              <span className="text-gold text-xs">획득</span>
            </motion.div>
          </div>

          {/* Reward Selection */}
          <div className="w-full mb-6">
            <p className="text-xs text-zinc-500 text-center mb-3">보상을 선택하세요</p>
            <div className="grid grid-cols-3 gap-2">
              {rewardOptions.map((option, index) => (
                <motion.button
                  key={option.type}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReward(option)}
                  className="flex flex-col items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded hover:border-gold-dim transition-colors"
                >
                  <option.icon className="w-6 h-6 text-zinc-400" />
                  <span className="text-[10px] text-zinc-300">{option.name}</span>
                  <span className="text-[9px] text-gold">{option.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </Panel>
      </motion.div>
    </div>
  )
}

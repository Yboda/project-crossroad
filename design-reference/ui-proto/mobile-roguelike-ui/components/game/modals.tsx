"use client"

import { useGameStore } from "@/lib/game-store"
import { Panel, GothicButton, StatBar, RelicIcon } from "./ui-components"
import { 
  X, Sword, Shield, Heart, Battery, Flame, Coins, Ghost, Sparkles 
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Modals() {
  const { currentModal, closeModal } = useGameStore()
  
  if (!currentModal) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        {currentModal === 'levelUp' && <LevelUpModal />}
        {currentModal === 'relic' && <RelicModal />}
        {currentModal === 'status' && <StatusModal />}
      </motion.div>
    </AnimatePresence>
  )
}

function LevelUpModal() {
  const { level, closeModal, updateStats, attack, defense, maxHp } = useGameStore()
  
  const handleChoice = (type: 'attack' | 'defense' | 'hp') => {
    if (type === 'attack') updateStats({ attack: attack + 2, level: level + 1 })
    if (type === 'defense') updateStats({ defense: defense + 2, level: level + 1 })
    if (type === 'hp') updateStats({ maxHp: maxHp + 10, hp: maxHp + 10, level: level + 1 })
    closeModal()
  }
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <Panel className="w-full max-w-sm p-6 flex flex-col items-center border-gold-dim/50">
        <span className="text-[10px] tracking-[0.2em] text-gold mb-2 uppercase">Body Adaptation</span>
        <h2 className="text-2xl font-serif text-gold-bright mb-1">육체 적응 Lv.{level + 1}</h2>
        <p className="text-xs text-zinc-500 mb-8 text-center">
          그릇이 영혼의 형태에 맞춰 변형됩니다.
        </p>
        
        <div className="w-full flex flex-col gap-3">
          <GothicButton onClick={() => handleChoice('attack')} icon={Sword}>
            공격 감각 (공격력 +2)
          </GothicButton>
          <GothicButton onClick={() => handleChoice('defense')} icon={Shield}>
            방어 감각 (방어력 +2)
          </GothicButton>
          <GothicButton onClick={() => handleChoice('hp')} icon={Heart}>
            생존 감각 (최대 HP +10)
          </GothicButton>
        </div>
      </Panel>
    </motion.div>
  )
}

function RelicModal() {
  const { modalData, closeModal, addRelic } = useGameStore()
  
  const relic = modalData || {
    id: 'broken-mirror',
    name: '부러진 거울 조각',
    description: '전투 시작 시 적 전체에게 5의 피해를 줍니다.',
    icon: '🪞',
    effect: '누군가의 부서진 기억이 담겨있다.',
  }
  
  const handleAccept = () => {
    addRelic(relic)
    closeModal()
  }
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
    >
      <Panel className="w-full max-w-sm p-6 flex flex-col items-center border-gold-dim/80 shadow-[0_0_30px_rgba(138,107,50,0.15)]">
        <span className="text-[10px] tracking-[0.2em] text-zinc-500 mb-4 uppercase">
          Relic Acquired
        </span>
        
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full border-2 border-gold bg-zinc-900 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gold/10 animate-pulse" />
            <span className="text-4xl relative z-10">{relic.icon}</span>
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-gold animate-pulse" />
        </div>
        
        <h2 className="text-xl font-serif text-gold-bright mb-2">{relic.name}</h2>
        <p className="text-sm text-zinc-400 mb-2 text-center">{relic.description}</p>
        <p className="text-xs text-zinc-600 mb-6 text-center italic">
          &quot;{relic.effect}&quot;
        </p>
        
        <GothicButton onClick={handleAccept}>받아들인다</GothicButton>
      </Panel>
    </motion.div>
  )
}

function StatusModal() {
  const { 
    bodyName, level, exp, maxExp,
    hp, maxHp, mp, maxMp,
    attack, defense, gold, traces,
    relics, closeModal 
  } = useGameStore()
  
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="w-full max-w-sm"
    >
      <Panel className="h-[80vh] max-h-[600px] flex flex-col overflow-hidden border-zinc-700">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-lg font-serif text-gold">상태 정보</h2>
          <button onClick={closeModal} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 no-scrollbar">
          {/* Character Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center">
              <Ghost className="w-8 h-8 text-zinc-600" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xl font-serif text-gold-bright mb-1">{bodyName}</span>
              <span className="text-xs text-zinc-500">레벨 {level}</span>
              <div className="w-full h-1 bg-zinc-900 mt-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold-dim transition-all duration-500"
                  style={{ width: `${(exp / maxExp) * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-zinc-600 text-right mt-1">
                EXP {exp} / {maxExp}
              </span>
            </div>
          </div>
          
          {/* HP & MP */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-blood" /> 생명력
                </span>
                <span>{hp} / {maxHp}</span>
              </div>
              <StatBar value={hp} max={maxHp} colorClass="bg-blood" />
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Battery className="w-3 h-3 text-mana" /> 정신력
                </span>
                <span>{mp} / {maxMp}</span>
              </div>
              <StatBar value={mp} max={maxMp} colorClass="bg-mana" />
            </div>
          </div>
          
          {/* Combat Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex items-center gap-3">
              <Sword className="w-4 h-4 text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">공격력</span>
                <span className="text-sm text-gold-bright">{attack}</span>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex items-center gap-3">
              <Shield className="w-4 h-4 text-zinc-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">방어력</span>
                <span className="text-sm text-gold-bright">{defense}</span>
              </div>
            </div>
          </div>
          
          {/* Resources */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex items-center gap-3">
              <Coins className="w-4 h-4 text-yellow-600" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">금화</span>
                <span className="text-sm text-gold-bright">{gold}</span>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex items-center gap-3">
              <Flame className="w-4 h-4 text-gold" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500">영혼의 흔적</span>
                <span className="text-sm text-gold">{traces.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Relics */}
          <div className="flex flex-col gap-3 mt-2">
            <h3 className="text-xs text-gold border-b border-zinc-800 pb-2">
              보유한 유물 ({relics.length})
            </h3>
            
            {relics.length === 0 ? (
              <p className="text-xs text-zinc-600 text-center py-4">
                아직 획득한 유물이 없습니다.
              </p>
            ) : (
              relics.map((relic) => (
                <div key={relic.id} className="flex items-start gap-3 bg-zinc-900/30 p-2 rounded">
                  <RelicIcon icon={relic.icon} name={relic.name} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-sm text-gold-bright">{relic.name}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{relic.description}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Panel>
    </motion.div>
  )
}

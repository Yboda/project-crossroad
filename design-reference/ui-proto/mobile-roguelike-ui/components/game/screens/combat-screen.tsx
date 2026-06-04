"use client"

import { useState, useEffect } from "react"
import { useGameStore, Enemy } from "@/lib/game-store"
import { TopHUD } from "@/components/game/hud"
import { GothicButton, StatBar, IntentIcon } from "@/components/game/ui-components"
import { Sword, Shield, Flame, Skull, X, Zap, Droplets, Wind, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const ENEMIES: Enemy[] = [
  { id: 'skeleton', name: '해골 기사', type: '언데드', hp: 40, maxHp: 40, attack: 8, defense: 2, intent: 'attack', intentValue: 8 },
  { id: 'wolf', name: '동굴 늑대', type: '야수', hp: 30, maxHp: 30, attack: 10, defense: 0, intent: 'attack', intentValue: 10 },
  { id: 'imp', name: '잿불 임프', type: '악마', hp: 25, maxHp: 25, attack: 6, defense: 1, intent: 'buff' },
  { id: 'ghost', name: '사슬 망령', type: '망령', hp: 35, maxHp: 35, attack: 7, defense: 3, intent: 'special' },
]

// Skill data
interface Skill {
  id: string
  name: string
  mpCost: number
  description: string
  damage?: number
  icon: typeof Flame
}

const SKILLS: Skill[] = [
  { id: 'fireball', name: '화염구', mpCost: 8, description: '적에게 강력한 화염 피해를 입힌다.', damage: 18, icon: Flame },
  { id: 'lightning', name: '번개 일격', mpCost: 12, description: '번개를 소환하여 적을 강타한다.', damage: 25, icon: Zap },
  { id: 'heal', name: '생명의 숨결', mpCost: 10, description: 'HP를 15 회복한다.', icon: Droplets },
  { id: 'wind_slash', name: '질풍 베기', mpCost: 6, description: '빠른 바람의 검격으로 공격한다.', damage: 12, icon: Wind },
  { id: 'holy_light', name: '신성한 빛', mpCost: 15, description: '언데드에게 2배 피해. 일반 적 20 피해.', damage: 20, icon: Sparkles },
]

export function CombatScreen() {
  const { 
    hp, maxHp, mp, maxMp, attack, defense, level, bodyName,
    currentEnemy, setEnemy, damageEnemy,
    combatLogs, addCombatLog, clearCombatLogs,
    setScreen, openModal, takeDamage, useMp, heal
  } = useGameStore()
  
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [shakeEnemy, setShakeEnemy] = useState(false)
  const [shakePlayer, setShakePlayer] = useState(false)
  const [showSkillPanel, setShowSkillPanel] = useState(false)

  // Initialize enemy
  useEffect(() => {
    if (!currentEnemy) {
      const randomEnemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)]
      setEnemy({ ...randomEnemy, hp: randomEnemy.maxHp })
      clearCombatLogs()
      addCombatLog(`${randomEnemy.name}(이)가 앞을 가로막습니다.`)
    }
  }, [currentEnemy, setEnemy, clearCombatLogs, addCombatLog])

  const handleAttack = () => {
    if (!isPlayerTurn || !currentEnemy) return
    
    const damage = Math.max(1, attack - currentEnemy.defense)
    damageEnemy(damage)
    addCombatLog(`당신의 공격! (${damage} 피해)`)
    setShakeEnemy(true)
    setTimeout(() => setShakeEnemy(false), 200)
    
    // Check for victory
    if (currentEnemy.hp - damage <= 0) {
      setTimeout(() => {
        setScreen('victory')
      }, 800)
      return
    }
    
    // Enemy turn
    setIsPlayerTurn(false)
    setTimeout(() => {
      handleEnemyTurn()
    }, 1000)
  }

  const handleDefend = () => {
    if (!isPlayerTurn || !currentEnemy) return
    
    addCombatLog("방어 태세를 취했습니다. (피해 50% 감소)")
    
    setIsPlayerTurn(false)
    setTimeout(() => {
      handleEnemyTurn(true)
    }, 1000)
  }

  const handleSkillUse = (skill: Skill) => {
    if (!isPlayerTurn || !currentEnemy) return
    if (mp < skill.mpCost) {
      addCombatLog("MP가 부족합니다!")
      return
    }
    
    useMp(skill.mpCost)
    setShowSkillPanel(false)
    
    // Handle different skill effects
    if (skill.id === 'heal') {
      heal(15)
      addCombatLog(`${skill.name} 시전! HP 15 회복!`)
    } else if (skill.damage) {
      let damage = skill.damage
      // Bonus damage for holy light vs undead
      if (skill.id === 'holy_light' && currentEnemy.type === '언데드') {
        damage *= 2
        addCombatLog(`${skill.name} 시전! 언데드에게 2배 피해! (${damage} 피해)`)
      } else {
        addCombatLog(`${skill.name} 시전! (${damage} 피해)`)
      }
      damageEnemy(damage)
      setShakeEnemy(true)
      setTimeout(() => setShakeEnemy(false), 200)
      
      // Check for victory
      if (currentEnemy.hp - damage <= 0) {
        setTimeout(() => {
          setScreen('victory')
        }, 800)
        return
      }
    }
    
    // Enemy turn
    setIsPlayerTurn(false)
    setTimeout(() => {
      handleEnemyTurn()
    }, 1000)
  }

  const handleEnemyTurn = (isDefending = false) => {
    if (!currentEnemy) return
    
    const enemyDamage = Math.max(0, currentEnemy.attack - defense)
    const actualDamage = isDefending ? Math.floor(enemyDamage * 0.5) : enemyDamage
    
    takeDamage(actualDamage + defense) // Add defense back since takeDamage subtracts it
    addCombatLog(`${currentEnemy.name}의 반격! (${actualDamage} 피해)`)
    setShakePlayer(true)
    setTimeout(() => setShakePlayer(false), 200)
    
    // Check for death
    if (hp - actualDamage <= 0) {
      setTimeout(() => {
        setScreen('death')
      }, 800)
      return
    }
    
    // Update enemy intent
    const intents: Array<'attack' | 'defend' | 'buff' | 'special'> = ['attack', 'attack', 'defend', 'buff']
    const newIntent = intents[Math.floor(Math.random() * intents.length)]
    setEnemy({ ...currentEnemy, intent: newIntent, intentValue: currentEnemy.attack })
    
    setIsPlayerTurn(true)
  }

  if (!currentEnemy) return null

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      <TopHUD />
      
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-luminosity opacity-15"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=800&q=80)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
      
      {/* Combat vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(139,32,32,0.1)_100%)]" />

      <div className="relative z-10 flex-1 flex flex-col pt-24 px-4 pb-4">
        
        {/* Enemy Area */}
        <motion.div 
          animate={shakeEnemy ? { x: [0, -5, 5, -5, 0] } : {}}
          transition={{ duration: 0.2 }}
          className="self-end flex flex-col items-end gap-2 mb-auto mt-8 w-52"
        >
          <div className="flex items-center gap-3 w-full justify-end">
            <div className="flex flex-col items-end">
              <span className="text-sm font-serif text-red-400">{currentEnemy.name}</span>
              <span className="text-[10px] text-zinc-500">{currentEnemy.type}</span>
            </div>
            <div className="w-14 h-14 border border-red-900/50 bg-black flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(139,32,32,0.3)]">
              <Skull className="w-7 h-7 text-red-800" />
            </div>
          </div>
          
          <div className="w-full flex items-center gap-2">
            <IntentIcon intent={currentEnemy.intent} value={currentEnemy.intentValue} />
            <div className="flex-1">
              <StatBar 
                value={currentEnemy.hp} 
                max={currentEnemy.maxHp} 
                colorClass="bg-red-700"
                showText
              />
            </div>
          </div>
        </motion.div>

        {/* Player Area */}
        <motion.div 
          animate={shakePlayer ? { x: [0, -5, 5, -5, 0] } : {}}
          transition={{ duration: 0.2 }}
          className="self-start flex flex-col gap-2 w-48 mt-auto mb-8"
        >
          {/* Player Silhouette */}
          <div className="w-20 h-28 mb-2 relative">
            <div className="absolute bottom-0 left-0 w-16 h-24 bg-zinc-900/80 rounded-t-full" />
            <div className="absolute bottom-4 left-2 w-10 h-10 bg-zinc-800/80 rounded-full" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-serif text-gold-bright">{bodyName}</span>
              <span className="text-[10px] text-zinc-500">Lv.{level}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <StatBar value={hp} max={maxHp} colorClass="bg-blood" showText />
            <StatBar value={mp} max={maxMp} colorClass="bg-mana" showText />
          </div>
        </motion.div>

        {/* Battle Log */}
        <div className="w-full h-28 bg-black/70 border border-zinc-800 p-3 flex flex-col justify-end gap-1 overflow-hidden rounded-sm mb-4 backdrop-blur-sm">
          <AnimatePresence mode="popLayout">
            {combatLogs.map((log, i) => (
              <motion.p 
                key={`${log}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-xs ${i === combatLogs.length - 1 ? 'text-zinc-200' : 'text-zinc-500'}`}
              >
                {log}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <GothicButton 
            onClick={handleAttack} 
            variant="primary" 
            icon={Sword} 
            className="flex-1"
            disabled={!isPlayerTurn || showSkillPanel}
          >
            공격
          </GothicButton>
          <GothicButton 
            onClick={handleDefend} 
            variant="secondary" 
            icon={Shield} 
            className="flex-1"
            disabled={!isPlayerTurn || showSkillPanel}
          >
            방어
          </GothicButton>
          <GothicButton 
            onClick={() => setShowSkillPanel(true)} 
            variant="secondary" 
            icon={Flame} 
            className="flex-1" 
            disabled={!isPlayerTurn || showSkillPanel}
          >
            스킬
          </GothicButton>
        </div>
        
        {/* Skill Selection Panel */}
        <AnimatePresence>
          {showSkillPanel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-x-4 bottom-4 z-50"
            >
              <div className="bg-zinc-950/95 border border-zinc-800 rounded-lg overflow-hidden backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                  <h3 className="text-sm font-serif text-gold">스킬 선택</h3>
                  <button 
                    onClick={() => setShowSkillPanel(false)}
                    className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Skill List */}
                <div className="p-2 max-h-64 overflow-y-auto">
                  {SKILLS.map((skill) => {
                    const canUse = mp >= skill.mpCost
                    const IconComponent = skill.icon
                    
                    return (
                      <button
                        key={skill.id}
                        onClick={() => canUse && handleSkillUse(skill)}
                        disabled={!canUse}
                        className={`w-full p-3 mb-1.5 last:mb-0 rounded-md border transition-all text-left flex items-start gap-3 ${
                          canUse 
                            ? 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/70 hover:border-gold-dim/50' 
                            : 'border-zinc-800/50 bg-zinc-950/50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {/* Skill Icon */}
                        <div className={`w-10 h-10 rounded border flex items-center justify-center flex-shrink-0 ${
                          canUse 
                            ? 'border-gold-dim/50 bg-zinc-900 text-gold' 
                            : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        
                        {/* Skill Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${canUse ? 'text-zinc-200' : 'text-zinc-500'}`}>
                              {skill.name}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              canUse 
                                ? 'bg-mana/20 text-blue-400' 
                                : 'bg-zinc-800 text-zinc-500'
                            }`}>
                              MP {skill.mpCost}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            {skill.description}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                
                {/* MP Bar */}
                <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/30">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-500">현재 MP</span>
                    <span className="text-mana">{mp} / {maxMp}</span>
                  </div>
                  <StatBar value={mp} max={maxMp} colorClass="bg-mana" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

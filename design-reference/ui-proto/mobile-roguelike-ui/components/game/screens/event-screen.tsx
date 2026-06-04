"use client"

import { useState } from "react"
import { useGameStore } from "@/lib/game-store"
import { Panel, GothicButton, ChoiceCard, Divider } from "@/components/game/ui-components"
import { motion, AnimatePresence } from "framer-motion"

interface EventData {
  id: string
  name: string
  description: string
  image: string
  choices: EventChoice[]
}

interface EventChoice {
  text: string
  variant: 'normal' | 'danger' | 'safe' | 'locked'
  requirement?: string
  result: EventResult
}

interface EventResult {
  text: string
  effects: {
    hp?: number
    mp?: number
    gold?: number
    traces?: number
  }
}

const EVENTS: EventData[] = [
  {
    id: 'old-altar',
    name: '낡은 제단',
    description: '오래된 제단 위에 희미한 빛이 깜빡인다. 무언가 바칠 수 있을 것 같다.',
    image: '🏛️',
    choices: [
      { 
        text: '금화를 바친다 (50 골드)', 
        variant: 'normal',
        result: { text: '제단이 빛나며 몸에 힘이 솟는다.', effects: { gold: -50, hp: 20 } }
      },
      { 
        text: '피를 바친다 (HP 10)', 
        variant: 'danger',
        result: { text: '제단이 붉게 타오르며 영혼의 흔적이 쏟아진다.', effects: { hp: -10, traces: 100 } }
      },
      { 
        text: '그냥 지나친다', 
        variant: 'safe',
        result: { text: '아무 일도 일어나지 않았다.', effects: {} }
      },
    ]
  },
  {
    id: 'corpse-hand',
    name: '시체더미 속 손',
    description: '시체 무더기 사이로 무언가를 쥔 손이 삐져나와 있다.',
    image: '🤚',
    choices: [
      { 
        text: '손을 열어본다', 
        variant: 'danger',
        result: { text: '손이 갑자기 움직여 당신을 움켜잡는다! 하지만 금화 몇 닢이 떨어진다.', effects: { hp: -5, gold: 30 } }
      },
      { 
        text: '조심스럽게 살핀다', 
        variant: 'normal',
        result: { text: '반짝이는 무언가가 보인다.', effects: { gold: 15 } }
      },
      { 
        text: '무시하고 지나간다', 
        variant: 'safe',
        result: { text: '뒤를 돌아보지 않았다.', effects: {} }
      },
    ]
  },
  {
    id: 'reverse-well',
    name: '거꾸로 흐르는 우물',
    description: '물이 아래에서 위로 솟아오르는 기이한 우물이다. 물에서 희미한 빛이 난다.',
    image: '🌊',
    choices: [
      { 
        text: '물을 마신다', 
        variant: 'danger',
        result: { text: '차갑고 이상한 맛이다. 정신이 맑아지는 것 같다.', effects: { mp: 30, hp: -5 } }
      },
      { 
        text: '손을 담근다', 
        variant: 'normal',
        result: { text: '물이 따뜻하다. 상처가 조금 낫는다.', effects: { hp: 10 } }
      },
      { 
        text: '돌아선다', 
        variant: 'safe',
        result: { text: '불길한 느낌이 들어 떠났다.', effects: {} }
      },
    ]
  },
  {
    id: 'crying-armor',
    name: '울고 있는 갑옷',
    description: '텅 빈 갑옷이 벽에 기대어 서 있다. 투구 사이로 눈물 같은 것이 흐른다.',
    image: '⚔️',
    choices: [
      { 
        text: '위로한다', 
        variant: 'safe',
        result: { text: '갑옷이 잠시 멈추더니, 검을 내밀었다. 고마워하는 것 같다.', effects: { traces: 50 } }
      },
      { 
        text: '갑옷을 분해한다', 
        variant: 'danger',
        result: { text: '갑옷이 저항하지만 금속 조각을 얻었다.', effects: { gold: 40, hp: -8 } }
      },
      { 
        text: '조용히 지나간다', 
        variant: 'normal',
        result: { text: '갑옷의 울음소리가 등 뒤로 멀어진다.', effects: {} }
      },
    ]
  },
]

export function EventScreen() {
  const { setScreen, heal, takeDamage, restoreMp, useMp, gainGold, spendGold, gainTraces } = useGameStore()
  const [currentEvent] = useState(() => EVENTS[Math.floor(Math.random() * EVENTS.length)])
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleChoice = (choice: EventChoice) => {
    setSelectedChoice(choice)
    
    // Apply effects
    const effects = choice.result.effects
    if (effects.hp && effects.hp > 0) heal(effects.hp)
    if (effects.hp && effects.hp < 0) takeDamage(-effects.hp)
    if (effects.mp && effects.mp > 0) restoreMp(effects.mp)
    if (effects.mp && effects.mp < 0) useMp(-effects.mp)
    if (effects.gold && effects.gold > 0) gainGold(effects.gold)
    if (effects.gold && effects.gold < 0) spendGold(-effects.gold)
    if (effects.traces) gainTraces(effects.traces)
    
    setShowResult(true)
  }

  const handleContinue = () => {
    setScreen('explore')
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(138,107,50,0.05)_0%,transparent_70%)]" />

      <div className="relative z-10 flex-1 flex flex-col justify-center p-6">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="event"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Panel className="p-6 flex flex-col items-center">
                {/* Event Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full bg-zinc-900 border border-gold-dim flex items-center justify-center mb-4 text-4xl"
                >
                  {currentEvent.image}
                </motion.div>
                
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase mb-2">Event</span>
                <h2 className="text-xl font-serif text-gold-bright mb-2">{currentEvent.name}</h2>
                
                <Divider className="w-full my-4" />
                
                <p className="text-sm text-zinc-400 text-center mb-6 leading-relaxed">
                  {currentEvent.description}
                </p>

                {/* Choices */}
                <div className="w-full flex flex-col gap-3">
                  {currentEvent.choices.map((choice, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ChoiceCard
                        onClick={() => handleChoice(choice)}
                        variant={choice.variant}
                      >
                        {choice.text}
                      </ChoiceCard>
                    </motion.div>
                  ))}
                </div>
              </Panel>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Panel className="p-6 flex flex-col items-center">
                <span className="text-[10px] tracking-widest text-zinc-500 uppercase mb-4">Result</span>
                
                <p className="text-sm text-zinc-300 text-center mb-6 leading-relaxed font-serif">
                  {selectedChoice?.result.text}
                </p>

                {/* Effect Display */}
                {selectedChoice?.result.effects && Object.keys(selectedChoice.result.effects).length > 0 && (
                  <div className="w-full flex flex-col gap-2 mb-6">
                    {Object.entries(selectedChoice.result.effects).map(([key, value]) => (
                      <div 
                        key={key} 
                        className="flex justify-between items-center p-2 bg-zinc-900/50 rounded border border-zinc-800"
                      >
                        <span className="text-xs text-zinc-500 capitalize">
                          {key === 'hp' ? 'HP' : key === 'mp' ? 'MP' : key === 'gold' ? '금화' : '흔적'}
                        </span>
                        <span className={`text-sm ${value && value > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {value && value > 0 ? `+${value}` : value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <GothicButton onClick={handleContinue}>
                  계속 진행한다
                </GothicButton>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

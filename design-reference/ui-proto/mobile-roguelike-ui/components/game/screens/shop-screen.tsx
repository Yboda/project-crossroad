"use client"

import { useState } from "react"
import { useGameStore, Relic } from "@/lib/game-store"
import { Panel, GothicButton, RelicIcon } from "@/components/game/ui-components"
import { Coins, X, Heart, Battery, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ShopItem {
  id: string
  name: string
  description: string
  cost: number
  type: 'consumable' | 'relic'
  icon: string
  effect?: () => void
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'hp-potion', name: '체력 포션', description: 'HP를 30 회복합니다.', cost: 25, type: 'consumable', icon: '🧪' },
  { id: 'mp-potion', name: '마나 포션', description: 'MP를 20 회복합니다.', cost: 20, type: 'consumable', icon: '💧' },
  { id: 'relic-1', name: '망자의 반지', description: '최대 HP가 15 증가합니다.', cost: 120, type: 'relic', icon: '💍' },
  { id: 'relic-2', name: '상인의 부적', description: '상점 가격이 10% 할인됩니다.', cost: 100, type: 'relic', icon: '📿' },
  { id: 'relic-3', name: '녹슨 열쇠', description: '상점 가격이 5% 할인됩니다.', cost: 80, type: 'relic', icon: '🔑' },
  { id: 'relic-4', name: '뼈 주사위', description: '전투 보상 골드가 20% 증가합니다.', cost: 90, type: 'relic', icon: '🎲' },
]

export function ShopScreen() {
  const { gold, setScreen, spendGold, heal, restoreMp, addRelic, openModal, updateStats, maxHp } = useGameStore()
  const [mode, setMode] = useState<'choices' | 'buy'>('choices')
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const [purchasedItems, setPurchasedItems] = useState<string[]>([])

  const handlePurchase = () => {
    if (!selectedItem || gold < selectedItem.cost) return
    
    if (spendGold(selectedItem.cost)) {
      setPurchasedItems(prev => [...prev, selectedItem.id])
      
      // Apply item effect
      if (selectedItem.id === 'hp-potion') {
        heal(30)
      } else if (selectedItem.id === 'mp-potion') {
        restoreMp(20)
      } else if (selectedItem.type === 'relic') {
        const relic: Relic = {
          id: selectedItem.id,
          name: selectedItem.name,
          description: selectedItem.description,
          icon: selectedItem.icon,
          effect: selectedItem.description,
        }
        
        // Apply relic effects
        if (selectedItem.id === 'relic-1') {
          updateStats({ maxHp: maxHp + 15 })
        }
        
        openModal('relic', relic)
      }
      
      setSelectedItem(null)
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-luminosity opacity-20"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#050505]/70 to-[#050505]" />
      
      {/* Candle glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(193,163,95,0.15)_0%,transparent_50%)]" />

      <div className="relative z-10 flex-1 flex flex-col justify-between p-6">
        {/* Top UI */}
        <div className="flex justify-between items-center text-xs text-gold">
          <span className="font-serif tracking-widest uppercase">The Merchant</span>
          <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full border border-zinc-800">
            <span>{gold}</span>
            <Coins className="w-4 h-4" />
          </div>
        </div>

        {/* Merchant Silhouette */}
        <div className="flex justify-center my-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-24 h-32 relative"
          >
            <div className="absolute inset-0 bg-zinc-900/80 rounded-t-3xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-zinc-800/60 rounded-full" />
            {/* Hood */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-12 bg-zinc-800/80 rounded-t-full" />
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-4 mt-auto">
          <AnimatePresence mode="wait">
            {mode === 'choices' && (
              <motion.div
                key="choices"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Panel className="p-4 flex flex-col gap-4">
                  <p className="text-sm text-zinc-300 mb-2 italic font-serif">
                    &quot;무엇을 원하는가, 길 잃은 영혼이여. 대가만 치른다면 뭐든 주지.&quot;
                  </p>
                  <GothicButton onClick={() => setMode('buy')} variant="primary">
                    상점을 이용한다
                  </GothicButton>
                  <GothicButton onClick={() => {}} variant="secondary">
                    상인과 대화한다
                  </GothicButton>
                  <GothicButton onClick={() => setScreen('explore')} variant="ghost">
                    상점을 떠난다
                  </GothicButton>
                </Panel>
              </motion.div>
            )}

            {mode === 'buy' && (
              <motion.div
                key="buy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Panel className="flex flex-col max-h-[450px]">
                  {/* Header */}
                  <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <h3 className="font-serif text-gold-bright">상품 목록</h3>
                    <button 
                      onClick={() => { setMode('choices'); setSelectedItem(null); }} 
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Items Grid */}
                  <div className="grid grid-cols-2 gap-3 p-4 overflow-y-auto no-scrollbar">
                    {SHOP_ITEMS.map(item => {
                      const isPurchased = purchasedItems.includes(item.id)
                      const canAfford = gold >= item.cost
                      
                      return (
                        <motion.button 
                          key={item.id}
                          whileHover={{ scale: isPurchased ? 1 : 1.02 }}
                          whileTap={{ scale: isPurchased ? 1 : 0.98 }}
                          onClick={() => !isPurchased && setSelectedItem(item)}
                          disabled={isPurchased}
                          className={cn(
                            "flex flex-col items-center p-3 rounded border transition-all",
                            isPurchased 
                              ? "border-zinc-800 bg-zinc-950/50 opacity-50"
                              : selectedItem?.id === item.id 
                                ? "border-gold-dim bg-[#1a1510]" 
                                : canAfford
                                  ? "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
                                  : "border-zinc-800 bg-zinc-950 opacity-60"
                          )}
                        >
                          <span className="text-2xl mb-2">{item.icon}</span>
                          <span className="text-xs text-zinc-300 mb-1 font-serif">{item.name}</span>
                          <span className={cn(
                            "text-[10px] flex items-center gap-1",
                            isPurchased ? "text-zinc-600" : canAfford ? "text-gold" : "text-red-500"
                          )}>
                            {isPurchased ? '구매 완료' : (
                              <>
                                {item.cost} <Coins className="w-3 h-3" />
                              </>
                            )}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Selected Item Detail */}
                  <AnimatePresence>
                    {selectedItem && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="mt-auto p-4 border-t border-zinc-800 bg-zinc-950"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-3xl">{selectedItem.icon}</span>
                          <div className="flex-1">
                            <h4 className="text-sm font-serif text-gold-bright mb-1">{selectedItem.name}</h4>
                            <p className="text-[10px] text-zinc-500">{selectedItem.description}</p>
                          </div>
                        </div>
                        <GothicButton 
                          onClick={handlePurchase}
                          disabled={gold < selectedItem.cost}
                        >
                          {gold < selectedItem.cost ? '금화가 부족하다' : `${selectedItem.cost} 금화로 구매`}
                        </GothicButton>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Panel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

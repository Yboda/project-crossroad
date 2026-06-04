"use client"

import { useState } from "react"
import { useGameStore } from "@/lib/game-store"
import { ScreenHeader } from "@/components/game/hud"
import { Panel, GothicButton } from "@/components/game/ui-components"
import { Flame, Lock, Zap, Shield, Sword, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EngravingNode {
  id: string
  x: number
  y: number
  name: string
  desc: string
  cost: number
  unlocked: boolean
  requires?: string
  type: 'attack' | 'defense' | 'survival' | 'core'
}

const NODES: EngravingNode[] = [
  // Core
  { id: 'core', x: 50, y: 15, name: '영혼의 핵', desc: '육체를 빌려 존재를 유지하는 기틀. 모든 각인의 시작점.', cost: 0, unlocked: true, type: 'core' },
  
  // Attack Branch
  { id: 'atk1', x: 25, y: 35, name: '손끝의 살의', desc: '기본 공격력 +2', cost: 100, unlocked: true, type: 'attack' },
  { id: 'atk2', x: 15, y: 55, name: '깊게 베는 기억', desc: '치명타 확률 5% 증가', cost: 200, unlocked: false, requires: 'atk1', type: 'attack' },
  { id: 'atk3', x: 25, y: 75, name: '검은 가시의 공명', desc: '공격 시 5% 확률로 추가 피해', cost: 400, unlocked: false, requires: 'atk2', type: 'attack' },
  
  // Defense Branch
  { id: 'def1', x: 75, y: 35, name: '버티는 법', desc: '기본 방어력 +2', cost: 100, unlocked: false, type: 'defense' },
  { id: 'def2', x: 85, y: 55, name: '무너지지 않는 자세', desc: '피해 감소 +3', cost: 200, unlocked: false, requires: 'def1', type: 'defense' },
  { id: 'def3', x: 75, y: 75, name: '아래에서 오는 빛', desc: '방어 시 HP 2 회복', cost: 400, unlocked: false, requires: 'def2', type: 'defense' },
  
  // Survival Branch (Center)
  { id: 'sur1', x: 50, y: 45, name: '희미한 생존 본능', desc: '최대 HP +10', cost: 150, unlocked: false, type: 'survival' },
  { id: 'sur2', x: 50, y: 65, name: '멎지 않는 맥박', desc: '휴식 시 HP 회복량 +50%', cost: 300, unlocked: false, requires: 'sur1', type: 'survival' },
  { id: 'sur3', x: 50, y: 85, name: '시체더미의 심장', desc: '사망 시 1회 부활 (30% HP)', cost: 800, unlocked: false, requires: 'sur2', type: 'survival' },
]

const CONNECTIONS = [
  { from: 'core', to: 'atk1' },
  { from: 'core', to: 'def1' },
  { from: 'core', to: 'sur1' },
  { from: 'atk1', to: 'atk2' },
  { from: 'atk2', to: 'atk3' },
  { from: 'def1', to: 'def2' },
  { from: 'def2', to: 'def3' },
  { from: 'sur1', to: 'sur2' },
  { from: 'sur2', to: 'sur3' },
]

export function EngravingScreen() {
  const { traces, setScreen } = useGameStore()
  const [nodes, setNodes] = useState(NODES)
  const [selectedNode, setSelectedNode] = useState(nodes[0])

  const getNodePosition = (id: string) => {
    const node = nodes.find(n => n.id === id)
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 }
  }

  const canUnlock = (node: EngravingNode) => {
    if (node.unlocked) return false
    if (traces < node.cost) return false
    if (node.requires) {
      const requiredNode = nodes.find(n => n.id === node.requires)
      return requiredNode?.unlocked || false
    }
    return true
  }

  const handleEngrave = () => {
    if (!canUnlock(selectedNode)) return
    setNodes(prev => prev.map(n => 
      n.id === selectedNode.id ? { ...n, unlocked: true } : n
    ))
    setSelectedNode({ ...selectedNode, unlocked: true })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attack': return Sword
      case 'defense': return Shield
      case 'survival': return Heart
      default: return Zap
    }
  }

  const getTypeColor = (type: string, unlocked: boolean) => {
    if (!unlocked) return 'text-zinc-700'
    switch (type) {
      case 'attack': return 'text-red-400'
      case 'defense': return 'text-blue-400'
      case 'survival': return 'text-green-400'
      default: return 'text-gold'
    }
  }

  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col overflow-hidden">
      <ScreenHeader 
        title="영혼 각인" 
        onBack={() => setScreen('lobby')}
        rightContent={
          <div className="flex items-center gap-1.5 text-xs text-gold">
            <span>{traces.toLocaleString()}</span>
            <Flame className="w-4 h-4" />
          </div>
        }
      />

      {/* Node Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,107,50,0.1)_0%,transparent_60%)]" />
        
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {CONNECTIONS.map((conn, i) => {
            const from = getNodePosition(conn.from)
            const to = getNodePosition(conn.to)
            const fromNode = nodes.find(n => n.id === conn.from)
            const toNode = nodes.find(n => n.id === conn.to)
            const isUnlocked = fromNode?.unlocked && toNode?.unlocked
            const isAvailable = fromNode?.unlocked
            
            return (
              <line
                key={i}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={isUnlocked ? "rgba(193,163,95,0.8)" : isAvailable ? "rgba(138,107,50,0.5)" : "rgba(63,63,70,0.3)"}
                strokeWidth={isUnlocked ? "3" : "2"}
                strokeDasharray={isUnlocked ? "0" : "4 4"}
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {nodes.map(node => {
          const Icon = getTypeIcon(node.type)
          const isSelected = selectedNode.id === node.id
          
          return (
            <motion.button
              key={node.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedNode(node)}
              className={cn(
                "absolute w-14 h-14 -ml-7 -mt-7 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected && "ring-2 ring-white/20",
                node.unlocked 
                  ? "bg-zinc-900 border-gold shadow-[0_0_20px_rgba(138,107,50,0.4)]" 
                  : canUnlock(node)
                    ? "bg-zinc-900 border-gold-dim/50 hover:border-gold-dim"
                    : "bg-zinc-950 border-zinc-800"
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {node.unlocked ? (
                <Icon className={cn("w-6 h-6", getTypeColor(node.type, true))} />
              ) : (
                <Lock className="w-5 h-5 text-zinc-700" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Detail Panel */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Panel className="p-6 m-4 mt-0 rounded-lg flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-serif text-gold-bright mb-1">{selectedNode.name}</h2>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded border",
                selectedNode.unlocked 
                  ? "text-gold bg-gold-dim/10 border-gold-dim/30"
                  : "text-zinc-500 bg-zinc-900 border-zinc-800"
              )}>
                {selectedNode.unlocked ? '각인됨' : '미각인'}
              </span>
            </div>
            <Flame className={cn(
              "w-8 h-8",
              selectedNode.unlocked ? "text-gold" : "text-zinc-700"
            )} />
          </div>
          
          <p className="text-sm text-zinc-400 py-4 border-y border-zinc-800/50 min-h-[60px]">
            {selectedNode.desc}
          </p>

          {!selectedNode.unlocked && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-xs items-center">
                <span className="text-zinc-500">요구 흔적</span>
                <span className={cn(
                  "flex items-center gap-1",
                  traces >= selectedNode.cost ? "text-gold-bright" : "text-red-500"
                )}>
                  {selectedNode.cost} <Flame className="w-3 h-3" />
                </span>
              </div>
              <GothicButton 
                onClick={handleEngrave}
                disabled={!canUnlock(selectedNode)}
              >
                {canUnlock(selectedNode) ? '영혼에 각인한다' : traces < selectedNode.cost ? '흔적이 부족하다' : '이전 노드 필요'}
              </GothicButton>
            </div>
          )}
        </Panel>
      </motion.div>
    </div>
  )
}

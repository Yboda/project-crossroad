"use client"

import { create } from 'zustand'

export type BodyType = '검사의 육체' | '수도자의 육체' | '도적의 육체' | '영매의 육체'

export type ScreenType = 
  | 'lobby' 
  | 'body-select' 
  | 'engraving' 
  | 'explore' 
  | 'combat' 
  | 'victory' 
  | 'reward'
  | 'shop' 
  | 'shop-buy'
  | 'event'
  | 'rest'
  | 'death'
  | 'ending'

export type ModalType = 'status' | 'levelUp' | 'relic' | null

export interface Relic {
  id: string
  name: string
  description: string
  icon: string
  effect: string
}

export interface Enemy {
  id: string
  name: string
  type: string
  hp: number
  maxHp: number
  attack: number
  defense: number
  intent: 'attack' | 'defend' | 'buff' | 'special'
  intentValue?: number
}

export interface GameState {
  // Character Stats
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  gold: number
  traces: number
  level: number
  exp: number
  maxExp: number
  attack: number
  defense: number
  bodyName: BodyType
  engravings: number
  
  // Inventory
  relics: Relic[]
  
  // Current Combat
  currentEnemy: Enemy | null
  combatLogs: string[]
  
  // Navigation
  currentScreen: ScreenType
  currentModal: ModalType
  modalData: any
  
  // Floor Info
  currentFloor: number
  currentRoom: number
  floorName: string
}

interface GameActions {
  // Navigation
  setScreen: (screen: ScreenType) => void
  openModal: (modal: ModalType, data?: any) => void
  closeModal: () => void
  
  // Stats
  updateStats: (updates: Partial<GameState>) => void
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  useMp: (amount: number) => void
  restoreMp: (amount: number) => void
  gainGold: (amount: number) => void
  spendGold: (amount: number) => boolean
  gainTraces: (amount: number) => void
  gainExp: (amount: number) => void
  
  // Body Selection
  selectBody: (body: BodyType) => void
  
  // Combat
  setEnemy: (enemy: Enemy | null) => void
  damageEnemy: (amount: number) => void
  addCombatLog: (log: string) => void
  clearCombatLogs: () => void
  
  // Relics
  addRelic: (relic: Relic) => void
  
  // Game Flow
  startNewRun: () => void
  die: () => void
  
  // Dev Console
  playerHealth: number
  playerMaxHealth: number
  playerGold: number
  playerLevel: number
  setPlayerHealth: (health: number) => void
  setPlayerGold: (gold: number) => void
  setPlayerLevel: (level: number) => void
  resetGame: () => void
}

const BODY_STATS: Record<BodyType, { hp: number; mp: number; attack: number; defense: number }> = {
  '검사의 육체': { hp: 50, mp: 20, attack: 12, defense: 8 },
  '수도자의 육체': { hp: 60, mp: 30, attack: 8, defense: 12 },
  '도적의 육체': { hp: 40, mp: 25, attack: 15, defense: 5 },
  '영매의 육체': { hp: 35, mp: 60, attack: 6, defense: 6 },
}

const initialState: GameState = {
  hp: 50,
  maxHp: 50,
  mp: 20,
  maxMp: 20,
  gold: 100,
  traces: 1240,
  level: 1,
  exp: 0,
  maxExp: 100,
  attack: 12,
  defense: 8,
  bodyName: '검사의 육체',
  engravings: 4,
  relics: [],
  currentEnemy: null,
  combatLogs: [],
  currentScreen: 'lobby',
  currentModal: null,
  modalData: null,
  currentFloor: 1,
  currentRoom: 1,
  floorName: '시체더미의 저층',
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,
  
  // Navigation
  setScreen: (screen) => set({ currentScreen: screen }),
  openModal: (modal, data) => set({ currentModal: modal, modalData: data }),
  closeModal: () => set({ currentModal: null, modalData: null }),
  
  // Stats
  updateStats: (updates) => set((state) => ({ ...state, ...updates })),
  
  takeDamage: (amount) => set((state) => {
    const actualDamage = Math.max(0, amount - state.defense)
    const newHp = Math.max(0, state.hp - actualDamage)
    return { hp: newHp }
  }),
  
  heal: (amount) => set((state) => ({
    hp: Math.min(state.maxHp, state.hp + amount)
  })),
  
  useMp: (amount) => set((state) => ({
    mp: Math.max(0, state.mp - amount)
  })),
  
  restoreMp: (amount) => set((state) => ({
    mp: Math.min(state.maxMp, state.mp + amount)
  })),
  
  gainGold: (amount) => set((state) => ({
    gold: state.gold + amount
  })),
  
  spendGold: (amount) => {
    const state = get()
    if (state.gold >= amount) {
      set({ gold: state.gold - amount })
      return true
    }
    return false
  },
  
  gainTraces: (amount) => set((state) => ({
    traces: state.traces + amount
  })),
  
  gainExp: (amount) => set((state) => {
    let newExp = state.exp + amount
    let newLevel = state.level
    let newMaxExp = state.maxExp
    
    while (newExp >= newMaxExp) {
      newExp -= newMaxExp
      newLevel++
      newMaxExp = Math.floor(newMaxExp * 1.5)
    }
    
    if (newLevel > state.level) {
      get().openModal('levelUp')
    }
    
    return { exp: newExp, level: newLevel, maxExp: newMaxExp }
  }),
  
  // Body Selection
  selectBody: (body) => {
    const stats = BODY_STATS[body]
    set({
      bodyName: body,
      hp: stats.hp,
      maxHp: stats.hp,
      mp: stats.mp,
      maxMp: stats.mp,
      attack: stats.attack,
      defense: stats.defense,
    })
  },
  
  // Combat
  setEnemy: (enemy) => set({ currentEnemy: enemy }),
  
  damageEnemy: (amount) => set((state) => {
    if (!state.currentEnemy) return state
    const newHp = Math.max(0, state.currentEnemy.hp - amount)
    return {
      currentEnemy: { ...state.currentEnemy, hp: newHp }
    }
  }),
  
  addCombatLog: (log) => set((state) => ({
    combatLogs: [...state.combatLogs.slice(-4), log]
  })),
  
  clearCombatLogs: () => set({ combatLogs: [] }),
  
  // Relics
  addRelic: (relic) => set((state) => ({
    relics: [...state.relics, relic]
  })),
  
  // Game Flow
  startNewRun: () => {
    const state = get()
    const stats = BODY_STATS[state.bodyName]
    set({
      hp: stats.hp,
      maxHp: stats.hp,
      mp: stats.mp,
      maxMp: stats.mp,
      gold: 100,
      level: 1,
      exp: 0,
      maxExp: 100,
      relics: [],
      currentFloor: 1,
      currentRoom: 1,
      floorName: '시체더미의 저층',
      currentEnemy: null,
      combatLogs: [],
      currentScreen: 'explore',
    })
  },
  
  die: () => set((state) => ({
    currentScreen: 'death',
    traces: state.traces + Math.floor(state.gold * 0.5) + 50,
  })),
  
  // Dev Console
  playerHealth: initialState.hp,
  playerMaxHealth: initialState.maxHp,
  playerGold: initialState.gold,
  playerLevel: initialState.level,
  
  setPlayerHealth: (health) => set({ hp: health }),
  setPlayerGold: (gold) => set({ gold }),
  setPlayerLevel: (level) => set({ level }),
  
  resetGame: () => set(initialState),
}))

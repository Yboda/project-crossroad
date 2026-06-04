import React, { createContext, useContext, useState } from 'react';

export type BodyType = '검사의 육체' | '수도자의 육체' | '도적의 육체' | '영매의 ���체';

export interface GameState {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  gold: number;
  traces: number;
  level: number;
  bodyName: BodyType;
  engravings: number;
}

export interface ModalsState {
  status: boolean;
  levelUp: boolean;
  relic: boolean;
  newRelicName: string | null;
}

interface GameContextType {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  modals: ModalsState;
  setModals: React.Dispatch<React.SetStateAction<ModalsState>>;
  updateState: (updates: Partial<GameState>) => void;
  openModal: (modal: keyof ModalsState, data?: any) => void;
  closeModal: (modal: keyof ModalsState) => void;
}

const defaultState: GameState = {
  hp: 45,
  maxHp: 50,
  mp: 20,
  maxMp: 20,
  gold: 150,
  traces: 1240,
  level: 1,
  bodyName: '검사의 육체',
  engravings: 4,
};

const defaultModals: ModalsState = {
  status: false,
  levelUp: false,
  relic: false,
  newRelicName: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const [modals, setModals] = useState<ModalsState>(defaultModals);

  const updateState = (updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const openModal = (modal: keyof ModalsState, data?: any) => {
    setModals(prev => ({ 
      ...prev, 
      [modal]: true, 
      ...(modal === 'relic' && data ? { newRelicName: data } : {}) 
    }));
  };

  const closeModal = (modal: keyof ModalsState) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  };

  return (
    <GameContext.Provider value={{ state, setState, modals, setModals, updateState, openModal, closeModal }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}

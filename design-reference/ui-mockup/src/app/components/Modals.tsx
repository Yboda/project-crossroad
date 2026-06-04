import React from 'react';
import { useGame } from '../store';
import { Panel, GothicButton, StatBar } from './UI';
import { Shield, Sword, Flame, Coins, Ghost, Sparkles, X, Heart, Battery } from 'lucide-react';

export const Modals = () => {
  const { modals, closeModal, state } = useGame();

  if (!modals.status && !modals.levelUp && !modals.relic) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Level Up Modal */}
      {modals.levelUp && (
        <Panel className="w-full max-w-sm p-6 flex flex-col items-center border-[#8a6b32]/50 animate-in zoom-in-95">
          <span className="text-[10px] tracking-[0.2em] text-[#c2a67a] mb-2 uppercase">Body Adaptation</span>
          <h2 className="text-2xl font-serif text-[#e8dcc7] mb-1">육체 적응 Lv.{state.level + 1}</h2>
          <p className="text-xs text-zinc-500 mb-8 text-center">그릇이 영혼의 형태에 맞춰 변형됩니다.</p>
          
          <div className="w-full flex flex-col gap-3">
            <GothicButton onClick={() => closeModal('levelUp')} icon={Sword}>공격 감각 (공격력 +2)</GothicButton>
            <GothicButton onClick={() => closeModal('levelUp')} icon={Shield}>방어 감각 (방어력 +2)</GothicButton>
            <GothicButton onClick={() => closeModal('levelUp')} icon={Heart}>생존 감각 (최대 HP +10)</GothicButton>
          </div>
        </Panel>
      )}

      {/* Relic Acquired Modal */}
      {modals.relic && (
        <Panel className="w-full max-w-sm p-6 flex flex-col items-center border-[#8a6b32]/80 shadow-[0_0_30px_rgba(138,107,50,0.15)] animate-in slide-in-from-bottom-4">
          <span className="text-[10px] tracking-[0.2em] text-zinc-500 mb-4 uppercase">Relic Acquired</span>
          <div className="w-20 h-20 rounded-full border border-[#8a6b32] bg-zinc-900 flex items-center justify-center mb-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-[#8a6b32] opacity-10 animate-pulse" />
             <Sparkles className="w-8 h-8 text-[#c2a67a]" />
          </div>
          <h2 className="text-xl font-serif text-[#e8dcc7] mb-2">{modals.newRelicName || '부러진 거울 조각'}</h2>
          <p className="text-sm text-zinc-400 mb-6 text-center">
            전투 시작 시 적 전체에게 5의 피해를 줍니다.<br/>
            <span className="text-xs text-zinc-600 block mt-2">"누군가의 부서진 기억이 담겨있다."</span>
          </p>
          <GothicButton onClick={() => closeModal('relic')}>받아들인다</GothicButton>
        </Panel>
      )}

      {/* Character Status Modal */}
      {modals.status && (
        <Panel className="w-full max-w-sm h-[80%] flex flex-col overflow-hidden border-zinc-700 animate-in zoom-in-95">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h2 className="text-lg font-serif text-[#c2a67a]">상태 정보</h2>
            <button onClick={() => closeModal('status')} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 no-scrollbar">
            {/* Header Stats */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                <Ghost className="w-8 h-8 text-zinc-600" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xl font-serif text-[#e8dcc7] mb-1">{state.bodyName}</span>
                <span className="text-xs text-zinc-500">레벨 {state.level}</span>
                <div className="w-full h-1 bg-zinc-900 mt-2 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-[#8a6b32]" />
                </div>
                <span className="text-[9px] text-zinc-600 text-right mt-1">EXP 120 / 300</span>
              </div>
            </div>

            {/* Core Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-900"/> 생명력</span>
                  <span>{state.hp} / {state.maxHp}</span>
                </div>
                <StatBar value={state.hp} max={state.maxHp} colorClass="bg-red-900" />
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-blue-900"/> 정신력</span>
                  <span>{state.mp} / {state.maxMp}</span>
                </div>
                <StatBar value={state.mp} max={state.maxMp} colorClass="bg-blue-900" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex items-center gap-3">
                 <Sword className="w-4 h-4 text-zinc-500" />
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500">공격력</span>
                   <span className="text-sm text-[#e8dcc7]">12 <span className="text-[10px] text-green-700">+2</span></span>
                 </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded flex items-center gap-3">
                 <Shield className="w-4 h-4 text-zinc-500" />
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500">방어력</span>
                   <span className="text-sm text-[#e8dcc7]">8</span>
                 </div>
              </div>
            </div>

            {/* Relics List */}
            <div className="flex flex-col gap-3 mt-2">
              <h3 className="text-xs text-[#c2a67a] border-b border-zinc-800 pb-2">보유한 유물 (2)</h3>
              
              <div className="flex items-start gap-3 bg-zinc-900/30 p-2 rounded">
                <div className="w-8 h-8 rounded border border-[#8a6b32]/50 bg-zinc-900 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#c2a67a]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#e8dcc7]">부러진 거울 조각</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">전투 시작 시 적 전체에게 5의 피해를 줍니다.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-900/30 p-2 rounded">
                <div className="w-8 h-8 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#e8dcc7]">꺼진 양초</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">휴식 시 회복량이 10% 증가합니다.</span>
                </div>
              </div>

            </div>
          </div>
        </Panel>
      )}

    </div>
  );
};

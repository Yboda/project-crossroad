import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../store';
import { Panel, GothicButton } from '../components/UI';
import { Sword, Shield, Flame, Coins, Sparkles, Heart } from 'lucide-react';

export const VictoryScreen = () => {
  const navigate = useNavigate();
  const { openModal, updateState } = useGame();

  useEffect(() => {
    // Show relic modal after a short delay
    const t = setTimeout(() => {
       openModal('relic', '녹슨 기사의 검조각');
    }, 1500);
    return () => clearTimeout(t);
  }, [openModal]);

  return (
    <div className="relative w-full h-full bg-[#050505] flex items-center justify-center p-6 z-20">
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#8a6b32]/10 to-transparent pointer-events-none" />

      <Panel className="w-full max-w-sm p-6 flex flex-col items-center border-[#8a6b32]/30 animate-in fade-in duration-500">
        
        <span className="text-[10px] tracking-[0.4em] text-[#c2a67a] mb-2 uppercase">Battle Won</span>
        <h1 className="text-3xl font-serif text-[#e8dcc7] mb-8">전투 승리</h1>

        <div className="w-full flex flex-col gap-2 mb-8">
          <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
               <Flame className="w-4 h-4 text-[#c2a67a]" /> 영혼의 흔적
            </div>
            <span className="text-[#e8dcc7]">+ 45</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
               <Coins className="w-4 h-4 text-zinc-400" /> 금화
            </div>
            <span className="text-[#e8dcc7]">+ 12</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1a1510] border border-[#8a6b32]/50 rounded shadow-[0_0_10px_rgba(138,107,50,0.1)]">
            <div className="flex items-center gap-2 text-sm text-[#e8dcc7]">
               <Sparkles className="w-4 h-4 text-[#c2a67a]" /> 미확인 유물
            </div>
            <span className="text-[#c2a67a] text-xs">획득</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
           <GothicButton onClick={() => {
             updateState({ hp: 50, maxHp: 55, traces: 1285, gold: 162 });
             openModal('levelUp');
             setTimeout(() => navigate('/explore'), 300);
           }}>
             전진한다
           </GothicButton>
           <GothicButton onClick={() => navigate('/')} variant="ghost">
             돌아간다
           </GothicButton>
        </div>

      </Panel>
    </div>
  );
};

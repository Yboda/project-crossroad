import React from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../store';
import { GothicButton } from '../components/UI';
import { Flame, Hexagon, Ghost } from 'lucide-react';

export const LobbyScreen = () => {
  const navigate = useNavigate();
  const { state } = useGame();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=800&q=80)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />

      {/* Top Bar */}
      <div className="relative z-10 w-full p-6 flex justify-end gap-4 text-xs font-serif text-[#c2a67a]">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 opacity-80" />
          <span>{state.traces.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Hexagon className="w-4 h-4 opacity-80" />
          <span>{state.engravings} / 10</span>
        </div>
      </div>

      {/* Title Area */}
      <div className="relative z-10 flex flex-col items-center gap-4 -mt-20">
        <span className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase">Corpse Chamber</span>
        <h1 className="text-4xl font-serif text-[#e8dcc7] drop-shadow-[0_0_10px_rgba(232,220,199,0.2)]">시체더미의 방</h1>
        <div className="w-12 h-[1px] bg-[#8a6b32]/50 mt-2" />
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 w-full p-6 flex flex-col gap-6">
        
        {/* Selected Body Display */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] text-zinc-500 tracking-widest">현재 깃든 그릇</span>
          <div className="flex items-center gap-3 px-6 py-3 rounded border border-zinc-800 bg-zinc-950/80 backdrop-blur">
            <Ghost className="w-5 h-5 text-zinc-600" />
            <span className="text-sm font-serif text-[#e8dcc7]">{state.bodyName}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <GothicButton onClick={() => navigate('/body-select')} variant="secondary">육체 선택</GothicButton>
          <GothicButton onClick={() => navigate('/engraving')} variant="secondary">영혼 각인</GothicButton>
          <GothicButton onClick={() => navigate('/explore')} variant="primary" className="mt-2 py-4">탐험 시작</GothicButton>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../store';
import { GothicButton } from '../components/UI';
import { Flame, Skull } from 'lucide-react';

export const DeathScreen = () => {
  const navigate = useNavigate();
  const { state, updateState } = useGame();

  const handleRestart = () => {
    updateState({ hp: 50, mp: 20, traces: state.traces + 145, gold: 0 }); // reset some stats
    navigate('/');
  };

  return (
    <div className="relative w-full h-full bg-[#0a0505] flex flex-col items-center justify-center p-6 z-50">
      
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-luminosity opacity-10"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=800&q=80)' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(153,27,27,0.1)_0%,rgba(0,0,0,1)_80%)]" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        
        <Skull className="w-16 h-16 text-red-900/50 mb-6 drop-shadow-[0_0_15px_rgba(153,27,27,0.5)]" />
        
        <span className="text-[10px] tracking-[0.5em] text-red-900/80 mb-2 uppercase">Journey Ended</span>
        <h1 className="text-4xl font-serif text-red-800/90 mb-12 drop-shadow-[0_0_10px_rgba(153,27,27,0.2)]">육체가 무너졌습니다</h1>

        <div className="w-full flex flex-col items-center gap-2 mb-12 p-6 border border-red-900/20 bg-black/50 rounded">
          <span className="text-xs text-zinc-500 mb-2">남겨진 영혼의 흔적</span>
          <div className="flex items-center gap-2 text-xl text-[#c2a67a]">
            + 145 <Flame className="w-5 h-5" />
          </div>
        </div>

        <GothicButton onClick={handleRestart} variant="danger">
           시체더미의 방으로 돌아간다
        </GothicButton>
      </div>
    </div>
  );
};

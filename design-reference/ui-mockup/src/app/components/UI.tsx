import React from 'react';
import { Shield, Sword, Flame, Coins, Settings, Ghost, Sparkles, Map as MapIcon, ChevronRight } from 'lucide-react';
import { useGame } from '../store';

export const GothicButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  icon: Icon
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  icon?: any;
}) => {
  const baseStyle = "flex items-center justify-center gap-2 w-full py-3.5 px-4 text-center transition-all duration-300 tracking-wider disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-zinc-900 border border-[#4a3b2c] text-[#e8dcc7] hover:border-[#8a6b32] hover:text-[#f0e6d2] hover:bg-zinc-800 shadow-[0_0_15px_rgba(0,0,0,0.8)] active:scale-[0.98]",
    secondary: "bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 active:scale-[0.98]",
    ghost: "bg-transparent text-zinc-500 hover:text-[#c2a67a] active:scale-[0.98]",
    danger: "bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60 active:scale-[0.98]"
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick}>
      {Icon && <Icon className="w-4 h-4 opacity-70" />}
      {children}
    </button>
  );
};

export const Panel = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-zinc-950/90 backdrop-blur-md border border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${className}`}>
    {children}
  </div>
);

export const StatBar = ({ value, max, colorClass }: { value: number, max: number, colorClass: string }) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-500 ${colorClass}`} style={{ width: `${percentage}%` }} />
    </div>
  );
};

export const TopHUD = () => {
  const { state, openModal } = useGame();
  
  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto cursor-pointer" onClick={() => openModal('status')}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded border border-[#8a6b32] bg-zinc-900 flex items-center justify-center shadow-[0_0_10px_rgba(138,107,50,0.2)]">
            <Ghost className="w-5 h-5 text-[#c2a67a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#c2a67a] font-serif leading-none mb-1">{state.bodyName}</span>
            <span className="text-[10px] text-zinc-500 leading-none">Lv.{state.level}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-24">
          <StatBar value={state.hp} max={state.maxHp} colorClass="bg-red-800 shadow-[0_0_5px_rgba(153,27,27,0.5)]" />
          <StatBar value={state.mp} max={state.maxMp} colorClass="bg-blue-800 shadow-[0_0_5px_rgba(30,64,175,0.5)]" />
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 text-xs text-[#c2a67a]">
          <span>{state.traces.toLocaleString()}</span>
          <Flame className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span>{state.gold}</span>
          <Coins className="w-3.5 h-3.5" />
        </div>
        <button className="mt-1 p-1.5 rounded bg-zinc-900/50 border border-zinc-800 text-zinc-500 hover:text-zinc-300">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

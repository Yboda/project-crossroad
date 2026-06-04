import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { TopHUD, GothicButton, StatBar } from '../components/UI';
import { Sword, Shield, Flame, Skull } from 'lucide-react';
import { useGame } from '../store';

export const CombatScreen = () => {
  const navigate = useNavigate();
  const { state } = useGame();
  const [logs, setLogs] = useState<string[]>([
    "해골 기사가 앞을 가로막습니다.",
    "적의 낡은 검이 불길하게 빛납니다."
  ]);
  const [enemyHp, setEnemyHp] = useState(40);

  const handleAction = (type: string) => {
    if (type === 'attack') {
      setLogs(prev => [...prev.slice(-3), "당신은 검을 휘둘렀습니다! (피해 12)"]);
      setEnemyHp(prev => Math.max(0, prev - 12));
      setTimeout(() => {
        if (enemyHp - 12 <= 0) {
          navigate('/victory');
        } else {
          setLogs(prev => [...prev.slice(-3), "해골 기사가 반격합니다! (피해 5)"]);
        }
      }, 800);
    } else {
      setLogs(prev => [...prev.slice(-3), "당신은 방어 태세를 취했습니다."]);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      <TopHUD />
      
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-luminosity opacity-20"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=800&q=80)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />

      <div className="relative z-10 flex-1 flex flex-col pt-24 px-4 pb-4">
        
        {/* Enemy Area (Top Right) */}
        <div className="self-end flex flex-col items-end gap-2 mb-auto mt-8 w-48">
           <div className="flex items-center gap-3 w-full justify-end">
              <div className="flex flex-col items-end">
                 <span className="text-sm font-serif text-red-400">해골 기사</span>
                 <span className="text-[10px] text-zinc-500">언데드</span>
              </div>
              <div className="w-12 h-12 border border-red-900/50 bg-black flex items-center justify-center rounded-sm">
                 <Skull className="w-6 h-6 text-red-800" />
              </div>
           </div>
           <div className="w-full flex items-center gap-2">
              <div className="w-6 h-6 bg-red-950/50 border border-red-900 flex items-center justify-center rounded">
                 <Sword className="w-3 h-3 text-red-500" />
              </div>
              <div className="flex-1">
                <StatBar value={enemyHp} max={40} colorClass="bg-red-700" />
              </div>
           </div>
        </div>

        {/* Player Area (Bottom Left) */}
        <div className="self-start flex flex-col gap-2 w-48 mt-auto mb-8">
           <div className="flex items-center gap-3">
              <div className="flex flex-col">
                 <span className="text-sm font-serif text-[#e8dcc7]">{state.bodyName}</span>
                 <span className="text-[10px] text-zinc-500">Lv.{state.level}</span>
              </div>
           </div>
           <div className="flex flex-col gap-1.5 w-full">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] w-4 text-red-400">HP</span>
                 <div className="flex-1"><StatBar value={state.hp} max={state.maxHp} colorClass="bg-red-800" /></div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] w-4 text-blue-400">MP</span>
                 <div className="flex-1"><StatBar value={state.mp} max={state.maxMp} colorClass="bg-blue-800" /></div>
              </div>
           </div>
        </div>

        {/* Battle Log */}
        <div className="w-full h-32 bg-black/60 border border-zinc-800 p-3 flex flex-col justify-end gap-1 overflow-hidden rounded-sm mb-4 backdrop-blur-sm">
          {logs.map((log, i) => (
             <p key={i} className={`text-xs ${i === logs.length - 1 ? 'text-zinc-200' : 'text-zinc-500'}`}>
                {log}
             </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <GothicButton onClick={() => handleAction('attack')} variant="primary" icon={Sword} className="flex-1">공격</GothicButton>
          <GothicButton onClick={() => handleAction('defend')} variant="secondary" icon={Shield} className="flex-1">방어</GothicButton>
          <GothicButton onClick={() => {}} variant="secondary" icon={Flame} className="flex-1" disabled>스킬</GothicButton>
        </div>
      </div>
    </div>
  );
};

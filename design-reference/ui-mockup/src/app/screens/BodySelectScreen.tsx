import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGame, BodyType } from '../store';
import { GothicButton } from '../components/UI';
import { Sword, Shield, Battery, Heart, ChevronLeft } from 'lucide-react';

const BODIES = [
  { name: '검사의 육체', desc: '물리적인 힘이 강한 그릇.', hp: 50, mp: 20, atk: 12, def: 8 },
  { name: '수도자의 육체', desc: '방어와 회복에 특화된 그릇.', hp: 60, mp: 30, atk: 8, def: 12 },
  { name: '도적의 육체', desc: '민첩하고 치명타가 높은 그릇.', hp: 40, mp: 25, atk: 15, def: 5 },
  { name: '영매의 육체', desc: '마법과 영혼의 힘을 다루는 그릇.', hp: 35, mp: 60, atk: 6, def: 6 },
];

export const BodySelectScreen = () => {
  const navigate = useNavigate();
  const { state, updateState } = useGame();
  const [selected, setSelected] = useState<BodyType>(state.bodyName);

  const handleSelect = () => {
    const body = BODIES.find(b => b.name === selected);
    if (body) {
      updateState({ bodyName: selected, hp: body.hp, maxHp: body.hp, mp: body.mp, maxMp: body.mp });
      navigate('/');
    }
  };

  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col">
      <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
        <button onClick={() => navigate('/')} className="p-2 text-zinc-500 hover:text-zinc-300">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-serif text-[#e8dcc7]">육체 선택</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
        {BODIES.map((body) => (
          <div 
            key={body.name}
            onClick={() => setSelected(body.name as BodyType)}
            className={`p-4 rounded border transition-all duration-300 cursor-pointer ${
              selected === body.name 
                ? 'border-[#8a6b32] bg-[#1a1510]' 
                : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className={`text-base font-serif mb-1 ${selected === body.name ? 'text-[#e8dcc7]' : 'text-zinc-400'}`}>
                  {body.name}
                </h3>
                <p className="text-[10px] text-zinc-500">{body.desc}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col items-center gap-1 text-xs">
                <Heart className="w-3 h-3 text-red-900" />
                <span className="text-zinc-400">{body.hp}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-xs">
                <Battery className="w-3 h-3 text-blue-900" />
                <span className="text-zinc-400">{body.mp}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-xs">
                <Sword className="w-3 h-3 text-zinc-600" />
                <span className="text-zinc-400">{body.atk}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-xs">
                <Shield className="w-3 h-3 text-zinc-600" />
                <span className="text-zinc-400">{body.def}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
        <GothicButton onClick={handleSelect} disabled={!selected}>이 그릇을 취한다</GothicButton>
      </div>
    </div>
  );
};

import { useNavigate } from "react-router";
import { GothicButton, GothicPanel } from "../components/SharedUI";
import { Sword, Shield, Zap, Skull, ShieldAlert } from "lucide-react";
import { useState } from "react";

export function Combat() {
  const navigate = useNavigate();
  const [playerHp, setPlayerHp] = useState(120);
  const [enemyHp, setEnemyHp] = useState(300);

  const performAttack = () => {
    // Demo effect
    if (enemyHp > 50) {
      setEnemyHp(prev => prev - 45);
    } else {
      navigate("/reward");
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col bg-black">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562362898-d1a9d124fd77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')] bg-cover bg-center opacity-40 mix-blend-luminosity"
      />
      
      {/* Enemy Area (Top Right) */}
      <div className="relative z-10 w-full h-[40%] mt-10">
        <div className="absolute right-6 top-10 flex flex-col items-center">
          {/* Intent Indicator */}
          <div className="bg-black/80 border border-[#ff5555]/50 rounded-full p-2 mb-2 animate-bounce shadow-[0_0_10px_rgba(255,0,0,0.3)]">
            <Sword className="text-[#ff5555]" size={20} />
          </div>
          
          {/* Enemy Placeholder */}
          <div className="w-32 h-40 bg-[url('https://images.unsplash.com/photo-1633555690973-b736f84f3c1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400')] bg-cover bg-center rounded-lg border-2 border-gold-dim/40 relative mix-blend-luminosity contrast-150">
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          
          {/* Enemy HP */}
          <div className="w-36 mt-3 text-center">
            <div className="text-white font-serif text-sm mb-1 drop-shadow-md">해골 기사</div>
            <div className="w-full bg-black border border-gray-800 h-2 rounded-full overflow-hidden">
              <div className="bg-[#ff4444] h-full transition-all duration-300" style={{width: `${(enemyHp/300)*100}%`}} />
            </div>
            <div className="text-[10px] text-text-muted mt-1">{enemyHp} / 300</div>
          </div>
        </div>
      </div>

      {/* Player Area (Bottom Left) */}
      <div className="relative z-10 w-full h-[30%]">
        <div className="absolute left-6 bottom-4 flex flex-col items-center">
          {/* Player Placeholder (Back view) */}
          <div className="w-24 h-32 bg-gray-800 rounded-t-[40px] relative overflow-hidden shadow-[20px_20px_30px_rgba(0,0,0,0.8)] border border-white/10">
             <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-8 bg-gray-600 rounded-t-lg"></div>
             <div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-16 bg-gray-700 rounded-lg"></div>
             <div className="absolute top-12 -right-2 w-3 h-20 bg-gray-500 rounded origin-top rotate-12"></div>
          </div>
        </div>
      </div>

      {/* UI Overlay */}
      <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col">
        {/* Battle Log */}
        <div className="h-16 px-4 py-2 bg-gradient-to-t from-black to-transparent flex flex-col justify-end text-sm font-serif">
          <p className="text-text-muted opacity-60">해골 기사가 전투태세를 갖춥니다.</p>
          <p className="text-text-main text-shadow">당신의 턴입니다.</p>
        </div>

        {/* Action Panel */}
        <GothicPanel className="w-full rounded-none border-x-0 border-b-0 pb-6 bg-black/95 backdrop-blur-xl">
          {/* Player Stats */}
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-serif mb-1">
                <span className="text-[#ff8888]">HP</span>
                <span className="text-text-main">{playerHp}/150</span>
              </div>
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#ff4444] h-full" style={{width: '80%'}} />
              </div>
            </div>
            <div className="w-4"></div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-serif mb-1">
                <span className="text-[#88ccff]">MP</span>
                <span className="text-text-main">40/40</span>
              </div>
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#55aaff] h-full" style={{width: '100%'}} />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={performAttack}
              className="flex flex-col items-center justify-center py-3 bg-[#1A1A20] border border-gold-dim/40 rounded-sm hover:bg-gold-dim/20 transition-colors"
            >
              <Sword size={24} className="mb-1 text-text-main"/>
              <span className="text-sm font-serif">공격</span>
            </button>
            <button 
              onClick={() => navigate("/death")}
              className="flex flex-col items-center justify-center py-3 bg-[#1A1A20] border border-gold-dim/40 rounded-sm hover:bg-gold-dim/20 transition-colors"
            >
              <Shield size={24} className="mb-1 text-text-main"/>
              <span className="text-sm font-serif">방어</span>
            </button>
            <button 
              className="flex flex-col items-center justify-center py-3 bg-[#1A1A20] border border-[#55aaff]/40 rounded-sm hover:bg-[#55aaff]/20 transition-colors"
            >
              <Zap size={24} className="mb-1 text-[#88ccff]"/>
              <span className="text-sm font-serif text-[#88ccff]">스킬</span>
            </button>
          </div>
        </GothicPanel>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router";
import { GothicButton, GothicPanel, cn } from "../components/SharedUI";
import { Coins, X, FlaskConical, Skull, Shield, Sword } from "lucide-react";
import { useState } from "react";

const ITEMS = [
  { id: 1, name: '체력 물약', desc: 'HP를 50 회복합니다.', price: 30, icon: FlaskConical, color: '#ff5555', bg: 'bg-[#ff5555]/10' },
  { id: 2, name: '마나 물약', desc: 'MP를 30 회복합니다.', price: 25, icon: FlaskConical, color: '#55aaff', bg: 'bg-[#55aaff]/10' },
  { id: 3, name: '녹슨 검의 파편', desc: '물리 공격력 +1', price: 100, icon: Sword, color: '#aaaaaa', bg: 'bg-white/5' },
  { id: 4, name: '부서진 방패', desc: '물리 방어력 +1', price: 90, icon: Shield, color: '#aaaaaa', bg: 'bg-white/5' },
  { id: 5, name: '기괴한 두개골', desc: '전투 승리 시 영혼의 흔적 획득량 5% 증가.', price: 150, icon: Skull, color: '#C1A35F', bg: 'bg-gold-dim/10' },
];

export function ShopItem() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(ITEMS[0]);
  const currentGold = 145;

  return (
    <div className="w-full h-full relative flex flex-col bg-[#0A0A0C]">
      
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gold-dim/30 bg-black/50 backdrop-blur-sm z-10">
        <button onClick={() => navigate("/shop")} className="p-2 -ml-2 text-text-muted hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-gothic text-lg tracking-[0.2em] flex-1 text-center">얼굴 없는 상인</h2>
        <div className="bg-black border border-gold-dim/50 rounded-full px-3 py-1 flex items-center gap-1.5">
          <Coins size={14} className="text-yellow-500"/>
          <span className="text-sm text-text-main font-serif">{currentGold}</span>
        </div>
      </div>

      {/* Item Grid */}
      <div className="flex-1 p-4 grid grid-cols-3 gap-3 content-start overflow-y-auto">
        {ITEMS.map(item => (
          <div 
            key={item.id}
            onClick={() => setSelected(item)}
            className={cn(
              "aspect-square rounded-sm border flex flex-col items-center justify-center p-2 cursor-pointer transition-all relative overflow-hidden",
              selected.id === item.id ? "border-gold shadow-[0_0_10px_rgba(193,163,95,0.2)] bg-black/80" : "border-white/10 bg-black/40",
              item.bg
            )}
          >
            <item.icon size={28} style={{ color: item.color }} className="mb-2" />
            <div className="flex items-center gap-1 bg-black/60 px-2 rounded text-[10px] absolute bottom-1">
              <Coins size={10} className="text-yellow-500"/>
              <span className={currentGold >= item.price ? "text-white" : "text-[#ff5555]"}>{item.price}</span>
            </div>
            {selected.id === item.id && (
              <div className="absolute inset-0 border border-gold pointer-events-none mix-blend-overlay"></div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Item Detail Panel */}
      <div className="h-[40%] bg-gradient-to-t from-black via-black/95 to-black/80 border-t border-gold-dim/40 p-5 flex flex-col z-20">
        <div className="flex gap-4 mb-4">
          <div className={`w-16 h-16 rounded border border-white/20 flex items-center justify-center ${selected.bg}`}>
            <selected.icon size={32} style={{ color: selected.color }} />
          </div>
          <div className="flex-1">
            <h3 className="text-gold font-serif text-xl mb-1">{selected.name}</h3>
            <p className="text-sm text-text-main font-serif opacity-80">{selected.desc}</p>
          </div>
        </div>
        
        <div className="flex-1" />

        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-text-muted text-sm font-serif">요구 금화</span>
          <div className="flex items-center gap-1.5 text-lg">
            <Coins size={18} className="text-yellow-500"/>
            <span className={currentGold >= selected.price ? "text-white" : "text-[#ff5555]"}>
              {selected.price}
            </span>
          </div>
        </div>

        {currentGold >= selected.price ? (
          <GothicButton variant="primary" onClick={() => navigate("/status")}>
            구매하기
          </GothicButton>
        ) : (
          <GothicButton variant="default" className="opacity-50 pointer-events-none">
            금화 부족
          </GothicButton>
        )}
      </div>

    </div>
  );
}

import { useNavigate } from "react-router";
import { GothicPanel } from "../components/SharedUI";
import { X, Sword, Shield, Flame, Coins, Heart, Zap, ScrollText } from "lucide-react";

export function StatusModal() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full relative bg-[#050505] flex flex-col z-50">
      
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gold-dim/30 bg-black/80 sticky top-0 z-10">
        <h2 className="text-gothic text-lg tracking-[0.2em] flex-1">캐릭터 정보</h2>
        <button onClick={() => navigate("/exploration")} className="p-2 -mr-2 text-text-muted hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Main Status Card */}
        <GothicPanel className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded border border-gold-dim/50 bg-[url('https://images.unsplash.com/photo-1600081728723-c8aa2ee3236a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200')] bg-cover bg-center mix-blend-luminosity"></div>
            <div>
              <h3 className="text-xl font-serif text-white mb-1">검사의 육체</h3>
              <p className="text-xs text-text-muted font-sans bg-white/5 inline-block px-2 py-0.5 rounded">Lv.2 (Exp: 45/100)</p>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <div className="flex items-center">
              <span className="w-8 text-center text-[#ff5555]"><Heart size={14} className="mx-auto"/></span>
              <span className="w-10 text-xs text-text-muted">HP</span>
              <div className="flex-1 bg-black h-2 rounded-full mx-2 overflow-hidden border border-white/10">
                <div className="bg-[#ff4444] h-full" style={{width: '80%'}}></div>
              </div>
              <span className="text-xs w-12 text-right">120/150</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 text-center text-[#55aaff]"><Zap size={14} className="mx-auto"/></span>
              <span className="w-10 text-xs text-text-muted">MP</span>
              <div className="flex-1 bg-black h-2 rounded-full mx-2 overflow-hidden border border-white/10">
                <div className="bg-[#55aaff] h-full" style={{width: '100%'}}></div>
              </div>
              <span className="text-xs w-12 text-right">40/40</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2 border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 bg-black/40 p-2 rounded">
              <Sword size={16} className="text-text-muted"/>
              <span className="text-sm font-serif text-text-muted flex-1">공격력</span>
              <span className="text-sm font-bold">16</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 p-2 rounded">
              <Shield size={16} className="text-text-muted"/>
              <span className="text-sm font-serif text-text-muted flex-1">방어력</span>
              <span className="text-sm font-bold">10</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 p-2 rounded">
              <Coins size={16} className="text-yellow-500"/>
              <span className="text-sm font-serif text-text-muted flex-1">금화</span>
              <span className="text-sm font-bold">145</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 p-2 rounded">
              <Flame size={16} className="text-soul"/>
              <span className="text-sm font-serif text-text-muted flex-1">흔적</span>
              <span className="text-sm font-bold text-soul">3,414</span>
            </div>
          </div>
        </GothicPanel>

        {/* Relics Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <ScrollText size={18} className="text-gold"/>
            <h3 className="text-gothic text-sm tracking-widest">보유 유물</h3>
          </div>
          
          <div className="space-y-2">
            {[
              { id: 1, name: '피 묻은 반지', desc: '전투 시작 시 HP를 5 회복합니다.', icon: '💍' },
              { id: 2, name: '기괴한 두개골', desc: '전투 승리 시 흔적 획득량 5% 증가.', icon: '💀' }
            ].map(relic => (
              <div key={relic.id} className="bg-[#121215] border border-white/10 p-3 flex gap-3 items-center rounded-sm">
                <div className="w-12 h-12 bg-black border border-gold-dim/40 flex items-center justify-center text-xl shrink-0">
                  {relic.icon}
                </div>
                <div>
                  <h4 className="text-gold font-serif text-sm mb-1">{relic.name}</h4>
                  <p className="text-xs text-text-muted font-serif">{relic.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

import { useNavigate } from "react-router";
import { GothicButton, GothicPanel, cn } from "../components/SharedUI";
import { ArrowLeft, Sword, Shield, Activity, Zap } from "lucide-react";
import { useState } from "react";

const BODIES = [
  { id: 'knight', name: '검사의 육체', desc: '균형 잡힌 전투와 방어', hp: 120, mp: 40, atk: 15, def: 10, img: 'https://images.unsplash.com/photo-1600081728723-c8aa2ee3236a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 'monk', name: '수도자의 육체', desc: '생존력과 회복의 힘', hp: 150, mp: 60, atk: 8, def: 12, img: 'https://images.unsplash.com/photo-1525270659983-2187049b6bdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 'rogue', name: '도적의 육체', desc: '치명적인 일격과 회피', hp: 80, mp: 50, atk: 22, def: 4, img: 'https://images.unsplash.com/photo-1541783677340-d3d95e61e3f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { id: 'medium', name: '영매의 육체', desc: '강력한 영적 마법', hp: 70, mp: 120, atk: 5, def: 3, img: 'https://images.unsplash.com/photo-1526584720376-57b19fffff13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
];

export function BodySelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('knight');

  return (
    <div className="w-full h-full relative flex flex-col bg-dark-bg pt-12 pb-8 px-4">
      {/* Header */}
      <div className="flex items-center mb-6 relative z-10">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 text-text-muted hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gothic text-xl tracking-[0.2em] flex-1 text-center pr-8">육체 선택</h2>
      </div>

      {/* Body List */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-20 no-scrollbar z-10 relative">
        {BODIES.map(body => (
          <div 
            key={body.id}
            onClick={() => setSelected(body.id)}
            className={cn(
              "relative rounded-sm overflow-hidden border transition-all duration-300 cursor-pointer",
              selected === body.id ? "border-gold shadow-[0_0_15px_rgba(193,163,95,0.3)] bg-black/80" : "border-gold-dim/30 bg-black/40 opacity-70"
            )}
          >
            <div className="flex h-32">
              {/* Image side */}
              <div className="w-24 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale mix-blend-luminosity contrast-125"
                  style={{ backgroundImage: `url(${body.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/90" />
              </div>
              
              {/* Info side */}
              <div className="flex-1 p-3 flex flex-col justify-center">
                <h3 className={cn("font-serif text-lg mb-1 tracking-widest", selected === body.id ? "text-gold" : "text-text-main")}>
                  {body.name}
                </h3>
                <p className="text-xs text-text-muted mb-3 font-serif">{body.desc}</p>
                
                <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-text-muted">
                  <div className="flex items-center gap-1"><Activity size={10} className="text-[#ff5555]"/> HP: {body.hp}</div>
                  <div className="flex items-center gap-1"><Zap size={10} className="text-[#55aaff]"/> MP: {body.mp}</div>
                  <div className="flex items-center gap-1"><Sword size={10}/> ATK: {body.atk}</div>
                  <div className="flex items-center gap-1"><Shield size={10}/> DEF: {body.def}</div>
                </div>
              </div>
            </div>
            
            {/* Selection highlight overlay */}
            {selected === body.id && (
              <div className="absolute inset-0 border-[2px] border-gold pointer-events-none rounded-sm mix-blend-overlay"></div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Fixed Area */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
        <GothicButton variant="primary" onClick={() => navigate("/exploration")}>
          여정 시작
        </GothicButton>
      </div>
    </div>
  );
}

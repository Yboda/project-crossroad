import { useNavigate } from "react-router";
import { GothicButton } from "../components/SharedUI";
import { Sparkles } from "lucide-react";

export function RelicAcquired() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-black/90 backdrop-blur-md z-50">
      
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(193,163,95,0.15)_0%,_transparent_60%)] pointer-events-none" />
      
      <div className="w-[85%] flex flex-col items-center relative z-10">
        <p className="text-gold text-xs tracking-[0.4em] font-sans mb-8 uppercase flex items-center gap-2">
          <Sparkles size={12} /> Relic Acquired <Sparkles size={12} />
        </p>

        <div className="w-full flex items-center gap-6 p-6 gothic-panel bg-black/60 mb-8 border-gold shadow-[0_0_30px_rgba(193,163,95,0.15)]">
          {/* Large Icon */}
          <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-gray-800 to-black border-2 border-gold flex items-center justify-center text-4xl shadow-inner relative">
            <div className="absolute inset-0 bg-gold/10 mix-blend-overlay"></div>
            👑
          </div>
          
          {/* Text */}
          <div className="flex-1">
            <h2 className="text-2xl font-serif text-gold mb-2 drop-shadow-md">잊혀진 왕관</h2>
            <p className="text-sm text-text-main font-serif leading-relaxed opacity-90">
              최대 HP가 10 증가하고, 상점 아이템 가격이 10% 하락합니다.
            </p>
          </div>
        </div>

        <GothicButton variant="primary" onClick={() => navigate("/exploration")} className="w-48">
          가방에 넣기
        </GothicButton>
      </div>

    </div>
  );
}

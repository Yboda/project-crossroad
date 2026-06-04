import { useNavigate } from "react-router";
import { GothicButton, GothicPanel } from "../components/SharedUI";
import { Shield, Sword, Heart, Coins, Flame } from "lucide-react";

export function Exploration() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full relative flex flex-col bg-black">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559833656-6c2256504176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')] bg-cover bg-center opacity-40 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />

      {/* Top HUD */}
      <div className="relative z-10 w-full p-2 flex gap-2" onClick={() => navigate("/status")}>
        <div className="bg-black/60 border border-gold-dim/30 rounded px-3 py-2 flex flex-col justify-center min-w-[120px] backdrop-blur-sm cursor-pointer">
          <div className="text-gold font-serif text-[11px] mb-1">검사의 육체 Lv.1</div>
          <div className="w-full bg-black h-1.5 rounded-full mb-1 overflow-hidden">
            <div className="bg-[#ff4444] h-full w-[80%]" />
          </div>
          <div className="flex justify-between text-[10px] font-sans">
            <span className="text-[#ff8888]">120/150</span>
            <span className="text-[#88ccff]">40/40</span>
          </div>
        </div>
        
        <div className="flex-1 flex justify-end items-start gap-2">
          <div className="flex flex-col gap-1">
            <div className="bg-black/60 border border-gold-dim/30 rounded px-2 py-1 flex items-center gap-1">
              <Coins size={12} className="text-yellow-500"/>
              <span className="text-xs text-text-main font-serif">145</span>
            </div>
            <div className="bg-black/60 border border-gold-dim/30 rounded px-2 py-1 flex items-center gap-1">
              <Flame size={12} className="text-soul"/>
              <span className="text-xs text-text-main font-serif">45</span>
            </div>
          </div>
        </div>
      </div>

      {/* Relics Preview */}
      <div className="relative z-10 w-full px-3 py-1 flex gap-1" onClick={() => navigate("/status")}>
        <div className="w-6 h-6 bg-black/80 border border-gold-dim/50 rounded flex items-center justify-center text-[10px] cursor-pointer">💍</div>
        <div className="w-6 h-6 bg-black/80 border border-gold-dim/50 rounded flex items-center justify-center text-[10px] cursor-pointer">💀</div>
      </div>

      {/* Center Action Area / Character Placeholder */}
      <div className="flex-1 relative">
        {/* Placeholder for character sprite from back */}
        <div className="absolute bottom-10 left-[40%] transform -translate-x-1/2">
          <div className="w-24 h-40 bg-black/50 border border-white/10 rounded-t-[40px] relative overflow-hidden blur-[1px]">
             {/* Simple shape representing knight from back */}
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-10 bg-gray-600 rounded-t-lg"></div>
             <div className="absolute top-14 left-1/2 -translate-x-1/2 w-14 h-20 bg-gray-700 rounded-lg"></div>
             <div className="absolute top-16 -right-2 w-4 h-24 bg-gray-500 rounded origin-top rotate-12"></div>
          </div>
        </div>
      </div>

      {/* Bottom Story / Choice Panel */}
      <div className="relative z-20 w-full p-4 bg-gradient-to-t from-[#050505] via-[#0A0A0C] to-transparent">
        <GothicPanel className="mb-4 bg-black/90 border-t-gold border-x-0 border-b-0 rounded-none shadow-[0_-10px_20px_rgba(0,0,0,0.8)]">
          <p className="text-text-main font-serif text-[15px] leading-relaxed mb-4 min-h-[60px]">
            길고 어두운 회랑 끝에 도달했다.<br/>
            오래된 피비린내가 공기를 채우고 있으며, 두 개의 문이 당신을 기다린다.
          </p>
          <div className="flex flex-col gap-2">
            <GothicButton onClick={() => navigate("/combat")}>
              철문의 방으로 들어간다 (전투)
            </GothicButton>
            <GothicButton onClick={() => navigate("/shop")} variant="default">
              흐릿한 불빛이 새는 곳으로 간다 (미지)
            </GothicButton>
          </div>
        </GothicPanel>
      </div>
    </div>
  );
}

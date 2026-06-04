import { useNavigate } from "react-router";
import { GothicButton, GothicPanel } from "../components/SharedUI";
import { Sword, Coins, Flame } from "lucide-react";

export function Reward() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full relative flex flex-col bg-black/90">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-dim/10 via-black to-black pointer-events-none" />

      {/* Header Log */}
      <div className="pt-16 px-6 relative z-10 text-center">
        <h2 className="text-gothic text-2xl tracking-[0.2em] mb-4">전투 승리</h2>
        <div className="space-y-1 font-serif text-sm text-text-muted">
          <p>해골 기사가 쓰러졌습니다.</p>
          <p>전투에서 승리했습니다.</p>
        </div>
      </div>

      {/* Rewards List */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 relative z-10">
        
        {/* Stat Reward */}
        <GothicPanel className="w-full py-4 px-5 flex items-center justify-between border-l-4 border-l-[#ff5555]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff5555]/10 flex items-center justify-center border border-[#ff5555]/30">
              <Sword size={20} className="text-[#ff5555]" />
            </div>
            <div>
              <h3 className="font-serif text-lg">전투 경험</h3>
              <p className="text-xs text-text-muted">영구 스탯 획득</p>
            </div>
          </div>
          <span className="font-bold text-lg text-text-main">+1 공격력</span>
        </GothicPanel>

        {/* Currency Rewards */}
        <GothicPanel className="w-full py-4 px-5 flex items-center justify-between border-l-4 border-l-yellow-500/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
              <Coins size={20} className="text-yellow-500" />
            </div>
            <h3 className="font-serif text-lg">오래된 금화</h3>
          </div>
          <span className="font-bold text-lg text-yellow-500">+45</span>
        </GothicPanel>

        <GothicPanel className="w-full py-4 px-5 flex items-center justify-between border-l-4 border-l-soul">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-soul/10 flex items-center justify-center border border-soul/30">
              <Flame size={20} className="text-soul" />
            </div>
            <h3 className="font-serif text-lg text-soul">영혼의 흔적</h3>
          </div>
          <span className="font-bold text-lg text-soul">+12</span>
        </GothicPanel>

      </div>

      <div className="p-6 relative z-10 mb-8">
        <GothicButton variant="primary" onClick={() => navigate("/level-up")}>
          보상 거두기
        </GothicButton>
      </div>
    </div>
  );
}

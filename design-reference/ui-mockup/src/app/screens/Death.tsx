import { useNavigate } from "react-router";
import { GothicButton } from "../components/SharedUI";
import { Flame } from "lucide-react";

export function Death() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-[#050505] z-50">
      
      {/* Background */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541783677340-d3d95e61e3f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')] bg-cover bg-center opacity-30 mix-blend-luminosity contrast-150"
      />
      <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      <div className="relative z-10 text-center w-full px-8 mt-20">
        <h1 className="text-red-800 font-serif text-5xl tracking-[0.3em] drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] mb-6 ml-2">
          사망
        </h1>
        
        <p className="text-text-muted font-serif text-sm leading-relaxed mb-12 italic">
          육체는 다시 고깃덩어리로 돌아갔고,<br/>
          당신의 영혼은 시체더미의 방으로 추방되었습니다.
        </p>

        <div className="border-t border-b border-white/10 py-6 mb-12 flex flex-col gap-4 bg-black/40 backdrop-blur-sm">
          <div className="flex justify-between items-center text-sm font-serif">
            <span className="text-text-muted">도달한 층</span>
            <span className="text-white">지하 3층</span>
          </div>
          <div className="flex justify-between items-center text-sm font-serif">
            <span className="text-text-muted">처치한 적</span>
            <span className="text-white">14</span>
          </div>
          <div className="flex justify-between items-center text-sm font-serif pt-2 border-t border-white/5">
            <span className="text-soul flex items-center gap-1"><Flame size={14}/> 회수한 영혼의 흔적</span>
            <span className="text-soul text-lg">+142</span>
          </div>
        </div>

        <GothicButton variant="primary" onClick={() => navigate("/")}>
          시체더미의 방으로 귀환
        </GothicButton>
      </div>

    </div>
  );
}

import { useNavigate } from "react-router";
import { GothicButton, GothicPanel } from "../components/SharedUI";
import { Flame, Skull } from "lucide-react";

export function Lobby() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full relative flex flex-col justify-between pt-16 pb-8 px-5 bg-radial-candle">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1715837602242-8e3fb8c06124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5kbGUlMjBsaWdodCUyMGRhcmslMjByb29tfGVufDF8fHx8MTc4MDU1MTg5M3ww&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none" 
      />
      
      {/* Top Header */}
      <div className="relative z-10 text-center space-y-1">
        <h1 className="text-gothic text-3xl tracking-[0.2em]">시체더미의 방</h1>
        <p className="text-text-muted text-sm font-serif tracking-widest">거짓된 안식처</p>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-6">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 text-soul">
            <Flame size={18} className="animate-pulse" />
            <span className="font-serif tracking-wider">영혼의 흔적</span>
          </div>
          <span className="font-serif text-xl">3,402</span>
        </div>

        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 text-gold">
            <Skull size={18} />
            <span className="font-serif tracking-wider">영혼 각인</span>
          </div>
          <span className="font-serif text-xl">12 / 64</span>
        </div>

        <GothicPanel className="mt-8 flex flex-col items-center gap-3 py-6">
          <div className="w-16 h-16 rounded-full bg-black/80 border border-text-muted/30 flex items-center justify-center overflow-hidden">
            <div className="text-text-muted/50 font-serif text-sm">Empty</div>
          </div>
          <p className="text-text-muted font-serif tracking-widest">선택된 육체가 없습니다</p>
        </GothicPanel>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 flex flex-col gap-3">
        <GothicButton variant="primary" onClick={() => navigate("/body-select")}>육체 선택</GothicButton>
        <GothicButton onClick={() => navigate("/engraving")}>영혼 각인</GothicButton>
      </div>
    </div>
  );
}

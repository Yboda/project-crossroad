import { useNavigate } from "react-router";
import { GothicButton, GothicPanel } from "../components/SharedUI";
import { Coins } from "lucide-react";

export function ShopMain() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full relative flex flex-col bg-black">
      {/* Background with Merchant Image */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1525270659983-2187049b6bdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')] bg-cover bg-top opacity-60 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#0A0A0C]" />

      {/* Top Gold Display */}
      <div className="relative z-10 w-full p-4 flex justify-end">
        <div className="bg-black/60 border border-gold-dim/30 rounded-full px-4 py-1.5 flex items-center gap-2 backdrop-blur-sm shadow-md">
          <Coins size={16} className="text-yellow-500"/>
          <span className="text-sm text-text-main font-serif">145</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1" />

      {/* Dialogue and Options Area */}
      <div className="relative z-20 w-full p-4 bg-gradient-to-t from-[#050505] via-[#0A0A0C] to-transparent">
        <GothicPanel className="mb-4 bg-black/90 border-t-gold border-x-0 border-b-0 rounded-none shadow-[0_-10px_20px_rgba(0,0,0,0.8)]">
          
          {/* NPC Dialogue */}
          <div className="mb-6">
            <h3 className="text-text-muted text-xs font-sans tracking-widest mb-2">얼굴 없는 상인</h3>
            <p className="text-text-main font-serif text-[15px] leading-relaxed italic">
              "금화의 무게는 영혼의 무게와 같지...<br/>
              무엇을 찾으러 왔는가, 길 잃은 자여."
            </p>
          </div>

          {/* Choices */}
          <div className="flex flex-col gap-2">
            <GothicButton onClick={() => navigate("/shop-item")}>
              상점을 이용한다
            </GothicButton>
            <GothicButton variant="default">
              상인과 대화한다
            </GothicButton>
            <GothicButton variant="default" onClick={() => navigate("/exploration")}>
              상점을 떠난다
            </GothicButton>
          </div>

        </GothicPanel>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router';
import { TopHUD, GothicButton } from '../components/UI';

export const ExplorationScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <TopHUD />
      
      {/* Background Image Area */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=800&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 pb-8 gap-6">
        
        {/* Narrative Panel */}
        <div className="bg-zinc-950/80 backdrop-blur border-l-2 border-[#8a6b32] p-4 text-sm leading-relaxed text-zinc-300">
          <p className="mb-2">어두운 복도 끝에서 불길한 숨소리가 들려온다. 공기 중에 피비린내가 섞여 있다.</p>
          <p className="text-zinc-500">오래된 문 앞에는 누군가 떨어뜨린 은화 몇 닢이 흩어져 있다.</p>
        </div>

        {/* Choices */}
        <div className="flex flex-col gap-3">
          <GothicButton onClick={() => navigate('/combat')} variant="primary">
             문을 열고 진입한다
          </GothicButton>
          <GothicButton onClick={() => navigate('/shop')} variant="secondary">
             상인을 찾는다
          </GothicButton>
          <GothicButton onClick={() => navigate('/victory')} variant="ghost">
             [디버그] 승리 처리
          </GothicButton>
        </div>
      </div>
    </div>
  );
};

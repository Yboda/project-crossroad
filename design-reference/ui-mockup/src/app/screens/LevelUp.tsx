import { useNavigate } from "react-router";
import { GothicButton, GothicPanel } from "../components/SharedUI";
import { Sword, Shield, Heart } from "lucide-react";
import { useState } from "react";

export function LevelUp() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  const choices = [
    { id: 1, title: '공격 감각', desc: '육체가 파괴의 흐름을 기억합니다.', buff: '물리 공격력 +3', icon: Sword, color: '#ff5555' },
    { id: 2, title: '방어 감각', desc: '고통에 익숙해진 가죽이 단단해집니다.', buff: '물리 방어력 +2', icon: Shield, color: '#aaaaaa' },
    { id: 3, title: '생존 감각', desc: '심장이 더 강하게 박동합니다.', buff: '최대 HP +15', icon: Heart, color: '#ff8888' },
  ];

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
      
      <div className="w-[85%] max-w-sm flex flex-col items-center">
        <div className="text-center mb-8">
          <p className="text-soul text-xs tracking-[0.3em] font-sans mb-1 uppercase">Body Adaptation</p>
          <h2 className="text-gothic text-3xl tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">육체 적응 Lv.2</h2>
          <p className="text-text-muted font-serif text-sm mt-3">영혼이 육체와 동화되며 새로운 감각을 일깨웁니다.</p>
        </div>

        <div className="w-full flex flex-col gap-3 mb-8">
          {choices.map(choice => (
            <div 
              key={choice.id}
              onClick={() => setSelected(choice.id)}
              className={`w-full relative border transition-all duration-300 cursor-pointer overflow-hidden p-4 rounded-sm bg-black/80 ${selected === choice.id ? 'border-gold shadow-[0_0_15px_rgba(193,163,95,0.2)]' : 'border-white/10 opacity-70'}`}
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-full" style={{ color: choice.color }}>
                  <choice.icon size={24} />
                </div>
                <div>
                  <h3 className={`font-serif text-lg mb-1 ${selected === choice.id ? 'text-gold' : 'text-text-main'}`}>{choice.title}</h3>
                  <p className="text-xs text-text-muted mb-2 font-serif">{choice.desc}</p>
                  <p className="text-sm font-bold" style={{ color: choice.color }}>{choice.buff}</p>
                </div>
              </div>
              {selected === choice.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        <GothicButton 
          variant={selected ? "primary" : "default"} 
          className={!selected ? "opacity-50" : ""}
          onClick={() => { if(selected) navigate("/relic") }}
        >
          선택 완료
        </GothicButton>
      </div>

    </div>
  );
}

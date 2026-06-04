import { useNavigate } from "react-router";
import { GothicButton, GothicPanel, cn } from "../components/SharedUI";
import { ArrowLeft, Zap } from "lucide-react";
import { useState } from "react";

const NODES = [
  { id: 1, cx: 195, cy: 600, type: 'core', state: 'unlocked', name: '영혼의 눈', desc: '어둠 속에서 숨겨진 길을 봅니다.', cost: 0, req: '' },
  { id: 2, cx: 140, cy: 500, type: 'atk', state: 'affordable', name: '파괴의 갈망', desc: '기본 공격력 +2', cost: 150, req: '영혼의 눈' },
  { id: 3, cx: 250, cy: 500, type: 'def', state: 'locked', name: '침묵의 장막', desc: '기본 방어력 +1', cost: 150, req: '영혼의 눈' },
  { id: 4, cx: 90, cy: 400, type: 'atk', state: 'locked', name: '선혈의 칼날', desc: '치명타 확률 5% 증가', cost: 300, req: '파괴의 갈망' },
  { id: 5, cx: 195, cy: 400, type: 'surv', state: 'unaffordable', name: '불굴의 의지', desc: '최대 HP +10', cost: 400, req: '파괴의 갈망, 침묵의 장막' },
  { id: 6, cx: 300, cy: 400, type: 'def', state: 'locked', name: '강철의 뼈', desc: '피해 감소 2%', cost: 300, req: '침묵의 장막' },
  { id: 7, cx: 195, cy: 280, type: 'core', state: 'locked', name: '육체 초월', desc: '모든 스탯 +1', cost: 1000, req: '불굴의 의지' },
];

const CONNECTIONS = [
  [1, 2], [1, 3], [2, 4], [2, 5], [3, 5], [3, 6], [5, 7]
];

export function SoulEngraving() {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(NODES[1]);
  const traces = 3402;

  // Render a hexagon
  const renderHex = (x: number, y: number, state: string, id: number) => {
    let fill = "rgba(10, 10, 12, 0.9)";
    let stroke = "rgba(139, 109, 59, 0.3)";
    let glow = false;

    if (state === 'unlocked') { stroke = "#C1A35F"; fill = "rgba(193, 163, 95, 0.2)"; }
    else if (state === 'affordable') { stroke = "#7FD4FF"; fill = "rgba(127, 212, 255, 0.1)"; glow = true; }
    else if (state === 'unaffordable') { stroke = "#555"; }

    const isSelected = selectedNode.id === id;

    return (
      <g key={id} onClick={() => setSelectedNode(NODES.find(n => n.id === id)!)} className="cursor-pointer">
        <polygon 
          points={`${x},${y-20} ${x+18},${y-10} ${x+18},${y+10} ${x},${y+20} ${x-18},${y+10} ${x-18},${y-10}`}
          fill={fill}
          stroke={isSelected ? "#FFF" : stroke}
          strokeWidth={isSelected ? 2 : 1}
          style={{ filter: glow ? "drop-shadow(0 0 8px rgba(127, 212, 255, 0.6))" : "none" }}
          className="transition-all duration-300"
        />
        {state === 'unlocked' && <circle cx={x} cy={y} r={3} fill="#C1A35F" />}
      </g>
    );
  };

  return (
    <div className="w-full h-full relative flex flex-col bg-[#0A0A0E]">
      {/* BG elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1A1A2E]/40 via-[#0A0A0E] to-[#0A0A0E] pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center p-4 relative z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate("/")} className="p-2 -ml-2 text-text-muted hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gothic text-xl tracking-[0.2em] flex-1 text-center pr-8">영혼 각인</h2>
      </div>

      {/* Currency */}
      <div className="absolute top-16 right-4 z-10 flex items-center gap-1.5 text-soul bg-black/60 px-3 py-1.5 rounded-full border border-soul/30">
        <Zap size={14} />
        <span className="font-serif text-sm">{traces}</span>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden">
        <svg className="w-full h-full absolute inset-0">
          {/* Connections */}
          {CONNECTIONS.map(([start, end], i) => {
            const s = NODES.find(n => n.id === start)!;
            const e = NODES.find(n => n.id === end)!;
            const isUnlockedPath = s.state === 'unlocked' && e.state === 'unlocked';
            return (
              <line 
                key={i} 
                x1={s.cx} y1={s.cy} x2={e.cx} y2={e.cy} 
                stroke={isUnlockedPath ? "#C1A35F" : "rgba(255,255,255,0.1)"} 
                strokeWidth={isUnlockedPath ? 2 : 1}
              />
            );
          })}
          
          {/* Nodes */}
          {NODES.map(node => renderHex(node.cx, node.cy, node.state, node.id))}
        </svg>
      </div>

      {/* Detail Panel */}
      <div className="relative z-20 h-[35%] bg-gradient-to-t from-black via-[#0A0A0E] to-transparent flex flex-col justify-end p-4 pb-6">
        <GothicPanel className="w-full border-t border-gold/40 flex flex-col h-full bg-black/80">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl text-gold font-serif tracking-widest">{selectedNode.name}</h3>
              <p className="text-xs text-text-muted uppercase tracking-wider">{selectedNode.type} ROUTE</p>
            </div>
            {selectedNode.cost > 0 && (
              <div className={cn("text-lg font-serif", traces >= selectedNode.cost ? "text-soul" : "text-text-muted")}>
                {selectedNode.cost} 흔적
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-text-main text-sm mb-4 leading-relaxed font-serif">{selectedNode.desc}</p>
            {selectedNode.state === 'locked' && selectedNode.req && (
              <p className="text-xs text-[#ff6b6b] mt-auto">요구 조건: {selectedNode.req}</p>
            )}
          </div>

          <div className="mt-4">
            {selectedNode.state === 'unlocked' ? (
              <GothicButton variant="ghost" className="opacity-50 cursor-not-allowed">각인 완료</GothicButton>
            ) : selectedNode.state === 'affordable' ? (
              <GothicButton variant="primary">각인하기</GothicButton>
            ) : (
              <GothicButton variant="default" className="opacity-50 cursor-not-allowed">조건 미달</GothicButton>
            )}
          </div>
        </GothicPanel>
      </div>
    </div>
  );
}

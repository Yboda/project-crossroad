import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../store';
import { GothicButton, Panel } from '../components/UI';
import { ChevronLeft, Flame, Lock } from 'lucide-react';

const NODES = [
  { id: 'core', x: 50, y: 30, name: '영혼의 핵', desc: '육체를 빌려 존재를 유지하는 기틀.', cost: 0, unlocked: true },
  { id: 'atk1', x: 25, y: 50, name: '공격의 흔적 I', desc: '기본 공격력 1 증가.', cost: 100, unlocked: true },
  { id: 'def1', x: 75, y: 50, name: '방어의 흔적 I', desc: '기본 방어력 1 증가.', cost: 100, unlocked: false },
  { id: 'atk2', x: 15, y: 70, name: '치명적인 감각', desc: '치명타 확률 5% 증가.', cost: 300, unlocked: false, requires: 'atk1' },
  { id: 'def2', x: 85, y: 70, name: '단단한 피부', desc: '피해 감소 2 증가.', cost: 300, unlocked: false, requires: 'def1' },
];

export const EngravingScreen = () => {
  const navigate = useNavigate();
  const { state } = useGame();
  const [selectedNode, setSelectedNode] = useState(NODES[0]);

  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col">
      <div className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate('/')} className="p-2 text-zinc-500 hover:text-zinc-300">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-serif text-[#e8dcc7]">영혼 각인</h1>
        <div className="flex items-center gap-1.5 text-xs text-[#c2a67a]">
          <span>{state.traces.toLocaleString()}</span>
          <Flame className="w-4 h-4" />
        </div>
      </div>

      {/* Node Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="50%" y1="30%" x2="25%" y2="50%" stroke="rgba(138,107,50,0.5)" strokeWidth="2" />
          <line x1="50%" y1="30%" x2="75%" y2="50%" stroke="rgba(63,63,70,0.5)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="25%" y1="50%" x2="15%" y2="70%" stroke="rgba(63,63,70,0.5)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="75%" y1="50%" x2="85%" y2="70%" stroke="rgba(63,63,70,0.5)" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* Nodes */}
        {NODES.map(node => (
          <button
            key={node.id}
            onClick={() => setSelectedNode(node)}
            className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center transition-all ${
              node.id === selectedNode.id ? 'ring-2 ring-white/20 scale-110' : ''
            } ${
              node.unlocked 
                ? 'bg-zinc-900 border-[#8a6b32] shadow-[0_0_15px_rgba(138,107,50,0.3)]' 
                : 'bg-zinc-950 border-zinc-800'
            }`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {node.unlocked ? <Flame className="w-5 h-5 text-[#c2a67a]" /> : <Lock className="w-4 h-4 text-zinc-700" />}
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      <Panel className="p-6 m-4 mt-0 rounded-lg flex flex-col gap-4 animate-in slide-in-from-bottom-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-serif text-[#e8dcc7] mb-1">{selectedNode.name}</h2>
            <span className="text-xs text-[#c2a67a] bg-[#8a6b32]/10 px-2 py-0.5 rounded border border-[#8a6b32]/30">
              {selectedNode.unlocked ? '각인됨' : '미각인'}
            </span>
          </div>
          <Flame className={`w-8 h-8 ${selectedNode.unlocked ? 'text-[#c2a67a]' : 'text-zinc-700'}`} />
        </div>
        
        <p className="text-sm text-zinc-400 py-4 border-y border-zinc-800/50 min-h-[80px]">
          {selectedNode.desc}
        </p>

        {!selectedNode.unlocked && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-xs items-center">
              <span className="text-zinc-500">요구 흔적</span>
              <span className={`flex items-center gap-1 ${state.traces >= selectedNode.cost ? 'text-[#e8dcc7]' : 'text-red-500'}`}>
                {selectedNode.cost} <Flame className="w-3 h-3" />
              </span>
            </div>
            <GothicButton disabled={state.traces < selectedNode.cost}>영혼에 각인한다</GothicButton>
          </div>
        )}
      </Panel>
    </div>
  );
};

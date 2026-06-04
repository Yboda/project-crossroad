import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../store';
import { Panel, GothicButton } from '../components/UI';
import { Coins, Heart, Sparkles, X } from 'lucide-react';

const ITEMS = [
  { id: 1, name: '붉은 물약', desc: 'HP를 30 회복합니다.', cost: 25, icon: Heart, type: 'consumable' },
  { id: 2, name: '희미한 영혼석', desc: '영혼의 흔적을 50 얻습니다.', cost: 40, icon: Sparkles, type: 'consumable' },
  { id: 3, name: '망자의 반지', desc: '최대 HP가 10 증가합니다.', cost: 120, icon: Sparkles, type: 'relic' },
  { id: 4, name: '상인의 부적', desc: '상점 가격이 10% 할인됩니다.', cost: 150, icon: Coins, type: 'relic' },
];

export const ShopScreen = () => {
  const navigate = useNavigate();
  const { state } = useGame();
  const [mode, setMode] = useState<'choices' | 'buy'>('choices');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      
      {/* Merchant Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-luminosity opacity-30"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]" />

      <div className="relative z-10 flex-1 flex flex-col justify-between p-6">
        
        {/* Top UI */}
        <div className="flex justify-between items-center text-xs text-[#c2a67a]">
          <span className="font-serif tracking-widest uppercase">The Merchant</span>
          <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full border border-zinc-800">
             <span>{state.gold}</span>
             <Coins className="w-4 h-4" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-4 mt-auto">
          
          {mode === 'choices' && (
            <Panel className="p-4 flex flex-col gap-4">
              <p className="text-sm text-zinc-300 mb-2 italic">
                "무엇을 원하는가, 길 잃은 영혼이여. 대가만 치른다면 뭐든 주지."
              </p>
              <GothicButton onClick={() => setMode('buy')} variant="primary">상점을 이용한다</GothicButton>
              <GothicButton onClick={() => {}} variant="secondary">상인과 대화한다</GothicButton>
              <GothicButton onClick={() => navigate('/explore')} variant="ghost">상점을 떠난다</GothicButton>
            </Panel>
          )}

          {mode === 'buy' && (
            <Panel className="flex flex-col h-[400px]">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h3 className="font-serif text-[#e8dcc7]">상품 목록</h3>
                <button onClick={() => { setMode('choices'); setSelectedItem(null); }} className="text-zinc-500 hover:text-zinc-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 p-4 overflow-y-auto no-scrollbar">
                {ITEMS.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`flex flex-col items-center p-3 rounded border transition-all ${
                      selectedItem?.id === item.id ? 'border-[#8a6b32] bg-[#1a1510]' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                    }`}
                  >
                    <item.icon className={`w-8 h-8 mb-2 ${item.type === 'relic' ? 'text-[#c2a67a]' : 'text-red-800'}`} />
                    <span className="text-xs text-zinc-300 mb-1 font-serif">{item.name}</span>
                    <span className="text-[10px] text-[#c2a67a] flex items-center gap-1">
                      {item.cost} <Coins className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>

              {selectedItem && (
                <div className="mt-auto p-4 border-t border-zinc-800 bg-zinc-950">
                  <h4 className="text-sm font-serif text-[#e8dcc7] mb-1">{selectedItem.name}</h4>
                  <p className="text-[10px] text-zinc-500 mb-3">{selectedItem.desc}</p>
                  <GothicButton disabled={state.gold < selectedItem.cost}>
                    {state.gold < selectedItem.cost ? '금화가 부족하다' : '구매한다'}
                  </GothicButton>
                </div>
              )}
            </Panel>
          )}

        </div>
      </div>
    </div>
  );
};

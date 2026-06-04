'use client';

import { useState } from 'react';
import { ChevronUp, RotateCcw, Zap } from 'lucide-react';
import { useGameStore } from '@/lib/game-store';

export function DevConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    currentScreen,
    setScreen,
    playerHealth,
    playerMaxHealth,
    playerGold,
    playerLevel,
    setPlayerHealth,
    setPlayerGold,
    setPlayerLevel,
    resetGame,
  } = useGameStore();

  const screens = [
    'lobby',
    'body-select',
    'engraving',
    'exploration',
    'event',
    'combat',
    'rest',
    'shop',
    'victory',
    'death',
    'ending',
  ];

  return (
    <>
      {/* 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-purple-900 to-red-900 border-2 border-yellow-600 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg"
        title="개발자 콘솔"
      >
        <Zap className="w-6 h-6 text-yellow-300" />
      </button>

      {/* 콘솔 패널 */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-slate-900 border-2 border-yellow-600 rounded-lg p-4 shadow-2xl max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-yellow-400 font-bold text-lg">🛠️ 개발 콘솔</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-yellow-400 hover:text-red-400 transition-colors"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>

          {/* 화면 선택 */}
          <div className="mb-4">
            <label className="block text-yellow-300 text-sm font-semibold mb-2">
              현재 화면: <span className="text-cyan-300">{currentScreen}</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {screens.map((screen) => (
                <button
                  key={screen}
                  onClick={() => setScreen(screen as any)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                    currentScreen === screen
                      ? 'bg-yellow-500 text-black'
                      : 'bg-slate-700 text-yellow-300 hover:bg-slate-600'
                  }`}
                >
                  {screen}
                </button>
              ))}
            </div>
          </div>

          {/* 상태 제어 */}
          {showAdvanced && (
            <div className="space-y-3 mb-4 border-t border-yellow-600 pt-4">
              <div>
                <label className="block text-yellow-300 text-xs font-semibold mb-1">
                  체력: {playerHealth}/{playerMaxHealth}
                </label>
                <input
                  type="range"
                  min="0"
                  max={playerMaxHealth}
                  value={playerHealth}
                  onChange={(e) => setPlayerHealth(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-yellow-300 text-xs font-semibold mb-1">
                  금화: {playerGold}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlayerGold(Math.max(0, playerGold - 100))}
                    className="flex-1 px-2 py-1 bg-red-700 hover:bg-red-600 text-yellow-300 text-xs rounded transition-colors"
                  >
                    -100
                  </button>
                  <button
                    onClick={() => setPlayerGold(playerGold + 100)}
                    className="flex-1 px-2 py-1 bg-green-700 hover:bg-green-600 text-yellow-300 text-xs rounded transition-colors"
                  >
                    +100
                  </button>
                  <button
                    onClick={() => setPlayerGold(0)}
                    className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-yellow-300 text-xs rounded transition-colors"
                  >
                    0
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-yellow-300 text-xs font-semibold mb-1">
                  레벨: {playerLevel}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlayerLevel(Math.max(1, playerLevel - 1))}
                    className="flex-1 px-2 py-1 bg-red-700 hover:bg-red-600 text-yellow-300 text-xs rounded transition-colors"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => setPlayerLevel(playerLevel + 1)}
                    className="flex-1 px-2 py-1 bg-green-700 hover:bg-green-600 text-yellow-300 text-xs rounded transition-colors"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 토글 & 리셋 */}
          <div className="flex gap-2 border-t border-yellow-600 pt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-yellow-300 text-xs font-semibold rounded transition-colors"
            >
              {showAdvanced ? '상태 숨김' : '상태 조정'}
            </button>
            <button
              onClick={() => {
                resetGame();
                setScreen('lobby');
              }}
              className="flex-1 px-3 py-2 bg-red-700 hover:bg-red-600 text-yellow-300 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              리셋
            </button>
          </div>

          {/* 정보 */}
          <div className="mt-4 text-xs text-yellow-200 bg-slate-800 p-2 rounded border border-slate-700">
            💡 개발 콘솔 팁:<br/>
            • 화면 버튼으로 즉시 전환<br/>
            • 상태 조정으로 다양한 시나리오 테스트<br/>
            • 리셋으로 게임 초기화
          </div>
        </div>
      )}
    </>
  );
}

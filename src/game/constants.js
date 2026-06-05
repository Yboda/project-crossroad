export const GAME_WIDTH = 390
export const GAME_HEIGHT = 844

/** Retina 대응 — 내부 렌더 해상도 배율 (1~2) */
export function getGameResolution() {
  if (typeof window === 'undefined') return 1
  return Math.min(Math.max(window.devicePixelRatio || 1, 1), 2)
}

export const COLORS = {
  cream: 0xf7efe0,
  gold: 0xd8a657,
  ink: 0x080b12,
  panel: 0x131824,
  panelLight: 0x20283a,
}

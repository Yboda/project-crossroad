import basicBackgroundUrl from '../../assets/backgrounds/basic.jpg'
import lobbyBackgroundUrl from '../../assets/backgrounds/loby1.jpg'

/**
 * Phaser 배경 텍스처 정의.
 * - key: Phaser texture key (층/방/화면 데이터에서 참조)
 * - url: import된 이미지
 * - explorationTone: 탐험·전투 등 게임 캔버스 위에 깔 때 색감 조정 (로비는 미적용)
 *
 * 나중에 방/이벤트별 이미지를 넣을 때:
 * 1. assets에 이미지 추가
 * 2. BACKGROUND_TEXTURES에 항목 추가
 * 3. floors.js / roomTypes.js 의 backgroundKey만 해당 key로 변경
 */
export const BACKGROUND_TEXTURES = {
  'background-lobby': {
    url: lobbyBackgroundUrl,
  },
  'background-basic': {
    url: basicBackgroundUrl,
    explorationTone: {
      tint: 0x9e9e9e,
      dimAlpha: 0.48,
    },
  },
}

/** 탐험 기본 배경 (임시: 전체 공용) */
export const DEFAULT_EXPLORATION_BACKGROUND = 'background-basic'

/** 예전 절차적 배경 키 → 당분간 basic.jpg 로 통일 */
export const LEGACY_BACKGROUND_KEYS = {
  'background-forest': DEFAULT_EXPLORATION_BACKGROUND,
  'background-ruins': DEFAULT_EXPLORATION_BACKGROUND,
  'background-mist': DEFAULT_EXPLORATION_BACKGROUND,
  'background-camp': DEFAULT_EXPLORATION_BACKGROUND,
}

export function resolveBackgroundKey(key) {
  if (!key) {
    return DEFAULT_EXPLORATION_BACKGROUND
  }
  return LEGACY_BACKGROUND_KEYS[key] ?? key
}

export function getBackgroundDefinition(key) {
  const resolved = resolveBackgroundKey(key)
  return BACKGROUND_TEXTURES[resolved] ?? BACKGROUND_TEXTURES[DEFAULT_EXPLORATION_BACKGROUND]
}

export function getBackgroundTextureKeysToPreload() {
  return Object.keys(BACKGROUND_TEXTURES)
}

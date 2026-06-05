import { GAME_HEIGHT, GAME_WIDTH } from '../constants'
import basicBackgroundUrl from '../../assets/backgrounds/basic.jpg'
import lobbyBackgroundUrl from '../../assets/backgrounds/lobby-1.png'
import boss1FrontBackgroundUrl from '../../assets/backgrounds/1f-front-of-boss-room.png'
import merchant1fBackgroundUrl from '../../assets/backgrounds/1f-merchant.png'
import corpsePit1fBackgroundUrl from '../../assets/backgrounds/1f-corpse-pit.png'
import insideCorpsePit1fBackgroundUrl from '../../assets/backgrounds/1f-inside-the-corpse-pit.png'

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
      tint: 0xb8b8b8,
      dimAlpha: 0.26,
    },
  },
  'background-boss-1f-front': {
    url: boss1FrontBackgroundUrl,
    explorationTone: {
      tint: 0xc8c0b8,
      dimAlpha: 0.2,
    },
  },
  'background-1f-merchant': {
    url: merchant1fBackgroundUrl,
    explorationTone: {
      tint: 0xb8b4ac,
      dimAlpha: 0.22,
    },
  },
  'background-1f-corpse-pit': {
    url: corpsePit1fBackgroundUrl,
    explorationTone: {
      tint: 0xa8a4a0,
      dimAlpha: 0.24,
    },
  },
  'background-1f-inside-corpse-pit': {
    url: insideCorpsePit1fBackgroundUrl,
    explorationTone: {
      tint: 0x9c9894,
      dimAlpha: 0.28,
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

export function getBackgroundImageUrl(key) {
  return getBackgroundDefinition(key).url
}

export function getBackgroundTextureKeysToPreload() {
  return Object.keys(BACKGROUND_TEXTURES)
}

/** CSS background-size: cover — 비율 유지, 짧은 변이 화면에 맞도록 확대 */
export function getBackgroundCoverDisplaySize(sourceWidth, sourceHeight, zoom = 1) {
  const safeWidth = Math.max(1, sourceWidth)
  const safeHeight = Math.max(1, sourceHeight)
  const coverScale = Math.max(GAME_WIDTH / safeWidth, GAME_HEIGHT / safeHeight) * zoom

  return {
    width: safeWidth * coverScale,
    height: safeHeight * coverScale,
  }
}

function getBackgroundSourceSize(image) {
  const frame = image.frame
  return {
    width: frame.cutWidth || frame.width || 1,
    height: frame.cutHeight || frame.height || 1,
  }
}

export function applyBackgroundCover(image, zoom = 1) {
  if (!image?.frame) {
    return
  }

  const source = getBackgroundSourceSize(image)
  const { width, height } = getBackgroundCoverDisplaySize(source.width, source.height, zoom)
  image.setScale(1)
  image.setDisplaySize(Math.ceil(width), Math.ceil(height))
  image.setOrigin(0.5, 0.5)
  image.setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2)
}

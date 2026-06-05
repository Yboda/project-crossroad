import { GAME_HEIGHT, GAME_WIDTH } from '../constants'
import path1fBackgroundUrl from '../../assets/backgrounds/test3.png'
import deathBackgroundUrl from '../../assets/backgrounds/death.jpg'
import lobbyBackgroundUrl from '../../assets/backgrounds/lobby-1.png'
import boss1FrontBackgroundUrl from '../../assets/backgrounds/1f-front-of-boss-room.png'
import merchant1fBackgroundUrl from '../../assets/backgrounds/1f-merchant.jpg'
import corpsePit1fBackgroundUrl from '../../assets/backgrounds/1f-corpse-pit.png'
import insideCorpsePit1fBackgroundUrl from '../../assets/backgrounds/1f-inside-the-corpse-pit.png'

/**
 * Phaser 배경 텍스처 정의.
 * - key: Phaser texture key (층/방/화면 데이터에서 참조)
 * - url: import된 이미지
 * - explorationTone: 탐험·전투 캔버스 위 색감 조정 (로비는 미적용)
 *   - tint: 기본 미사용. 필요한 방만 개별 지정
 *   - dimAlpha: 검은 딤 오버레이 강도
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
  'background-1f-path': {
    url: path1fBackgroundUrl,
    explorationTone: {
      dimAlpha: 0.26,
    },
    enemyPortraitTone: {
      brightness: 0.92,
      contrast: 1.05,
      saturate: 0.75,
      sepia: 0.12,
      vignetteInner: 0.38,
      vignetteMid: 0.14,
      fadeStart: 96,
      fadeEnd: 100,
    },
  },
  'background-death': {
    url: deathBackgroundUrl,
  },
  'background-boss-1f-front': {
    url: boss1FrontBackgroundUrl,
    explorationTone: {
      dimAlpha: 0.2,
    },
    enemyPortraitTone: {
      brightness: 0.94,
      contrast: 1.04,
      saturate: 0.8,
      sepia: 0.08,
      vignetteInner: 0.32,
      vignetteMid: 0.11,
      fadeStart: 74,
      fadeEnd: 98,
    },
  },
  'background-1f-merchant': {
    url: merchant1fBackgroundUrl,
    explorationTone: {
      dimAlpha: 0.22,
    },
    enemyPortraitTone: {
      brightness: 0.93,
      contrast: 1.05,
      saturate: 0.78,
      sepia: 0.1,
      vignetteInner: 0.35,
      vignetteMid: 0.12,
      fadeStart: 96,
      fadeEnd: 99.5,
    },
  },
  'background-1f-corpse-pit': {
    url: corpsePit1fBackgroundUrl,
    explorationTone: {
      dimAlpha: 0.24,
    },
    enemyPortraitTone: {
      brightness: 0.9,
      contrast: 1.06,
      saturate: 0.72,
      sepia: 0.14,
      vignetteInner: 0.4,
      vignetteMid: 0.15,
      fadeStart: 95,
      fadeEnd: 99.5,
    },
  },
  'background-1f-inside-corpse-pit': {
    url: insideCorpsePit1fBackgroundUrl,
    explorationTone: {
      dimAlpha: 0.28,
    },
    enemyPortraitTone: {
      brightness: 0.87,
      contrast: 1.07,
      saturate: 0.68,
      sepia: 0.16,
      vignetteInner: 0.44,
      vignetteMid: 0.17,
      fadeStart: 94,
      fadeEnd: 99,
    },
  },
}

/** 탐험 기본 배경 */
export const DEFAULT_EXPLORATION_BACKGROUND = 'background-1f-path'

const DEFAULT_ENEMY_PORTRAIT_TONE = {
  brightness: 0.92,
  contrast: 1.05,
  saturate: 0.75,
  sepia: 0.12,
  vignetteInner: 0.38,
  vignetteMid: 0.14,
  fadeStart: 96,
  fadeEnd: 100,
}

/** 예전 배경 키 호환 */
export const LEGACY_BACKGROUND_KEYS = {
  'background-basic': DEFAULT_EXPLORATION_BACKGROUND,
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

/** DEV 미리보기용 기본 틴트 — explorationTone.tint 미지정 방에도 적용 */
export const DEFAULT_BACKGROUND_TINT = 0xb8b8b8

/**
 * @returns {number | null} Phaser tint. null이면 틴트 없음
 * - 프로덕션: explorationTone.tint 지정된 방만
 * - DEV + devTintPreviewEnabled: 모든 방 (미지정 시 DEFAULT_BACKGROUND_TINT)
 */
export function resolveBackgroundTintForScene(backgroundKey, devTintPreviewEnabled = false) {
  const tone = getBackgroundDefinition(backgroundKey).explorationTone
  const configuredTint = tone?.tint ?? null

  if (import.meta.env.DEV && devTintPreviewEnabled) {
    return configuredTint ?? DEFAULT_BACKGROUND_TINT
  }

  return configuredTint
}

/** 전투 몬스터 일러스트 CSS filter — explorationTone과 짝을 맞춘 프리셋 */
export function getEnemyPortraitTone(key) {
  const definition = getBackgroundDefinition(key)
  return definition.enemyPortraitTone ?? DEFAULT_ENEMY_PORTRAIT_TONE
}

export function getEnemyPortraitToneStyle(key) {
  const tone = getEnemyPortraitTone(key)
  return {
    '--enemy-filter-brightness': String(tone.brightness),
    '--enemy-filter-contrast': String(tone.contrast),
    '--enemy-filter-saturate': String(tone.saturate),
    '--enemy-filter-sepia': String(tone.sepia),
    '--enemy-vignette-inner': String(tone.vignetteInner),
    '--enemy-vignette-mid': String(tone.vignetteMid),
    '--enemy-fade-start': `${tone.fadeStart}%`,
    '--enemy-fade-end': `${tone.fadeEnd}%`,
  }
}

export function getEnemyPortraitBackgroundClass(key) {
  const resolved = resolveBackgroundKey(key)
  const slug = resolved.replace(/^background-/, '')
  return `combat-enemy-bg--${slug}`
}

export function getBackgroundTextureKeysToPreload() {
  return Object.keys(BACKGROUND_TEXTURES)
}

/** CSS background-size: cover — 비율 유지, 짧은 변이 화면에 맞도록 확대 */
export function getBackgroundCoverScale(sourceWidth, sourceHeight, zoom = 1) {
  const safeWidth = Math.max(1, sourceWidth)
  const safeHeight = Math.max(1, sourceHeight)
  return Math.max(GAME_WIDTH / safeWidth, GAME_HEIGHT / safeHeight) * zoom
}

export function getBackgroundCoverDisplaySize(sourceWidth, sourceHeight, zoom = 1) {
  const coverScale = getBackgroundCoverScale(sourceWidth, sourceHeight, zoom)
  return {
    width: sourceWidth * coverScale,
    height: sourceHeight * coverScale,
    scale: coverScale,
  }
}

function getBackgroundSourceSize(image) {
  const frame = image.frame
  const source = image.texture?.source?.[image.frame.sourceIndex]
  const width = source?.width || frame.cutWidth || frame.width || 1
  const height = source?.height || frame.cutHeight || frame.height || 1
  return {
    width: Math.max(1, width),
    height: Math.max(1, height),
  }
}

/**
 * 배경을 cover로 맞춘다 — 가로·세로 동일 배율(setScale)만 사용해 늘어남 방지.
 */
export function applyBackgroundCover(image, zoom = 1) {
  if (!image?.frame) {
    return
  }

  const source = getBackgroundSourceSize(image)
  const coverScale = getBackgroundCoverScale(source.width, source.height, zoom)

  image.setOrigin(0.5, 0.5)
  image.setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2)
  image.setScale(coverScale)
}

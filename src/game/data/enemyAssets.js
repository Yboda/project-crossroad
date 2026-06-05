import ashImpPng from '../../assets/enemies/ash-imp.png'
import boneRatPng from '../../assets/enemies/bone-rat.png'
import darkKnightPng from '../../assets/enemies/dark-knight.png'
import soulHoundPng from '../../assets/enemies/soul-hound.png'
import timeManagerPng from '../../assets/enemies/time-manager.png'
import wolfPng from '../../assets/enemies/wolf.png'

/** 적 id → 이미지 URL (Vite import). 이미지 없는 적은 뼈쥐를 임시 기본값으로 쓴다. */
export const ENEMY_IMAGE_SOURCES = {
  'starving-wolf': wolfPng,
  'ash-imp': ashImpPng,
  'bone-rat': boneRatPng,
  'soul-hound': soulHoundPng,
  'dark-knight': darkKnightPng,
  'time-manager': timeManagerPng,
}

const DEFAULT_ENEMY_IMAGE = boneRatPng

export function getEnemyImageSrc(enemyId) {
  if (!enemyId) return DEFAULT_ENEMY_IMAGE
  return ENEMY_IMAGE_SOURCES[enemyId] ?? DEFAULT_ENEMY_IMAGE
}

/** 적 id별 일러스트 색 보정 — 배경 톤 위에 덮어쓴다 */
export const ENEMY_PORTRAIT_TONE_OVERRIDES = {
  'soul-hound': {
    brightness: 0.84,
    contrast: 1.04,
    saturate: 0.52,
    sepia: 0.2,
  },
}

export function getEnemyPortraitToneOverrideStyle(enemyId) {
  const tone = ENEMY_PORTRAIT_TONE_OVERRIDES[enemyId]
  if (!tone) return {}

  return {
    '--enemy-filter-brightness': String(tone.brightness),
    '--enemy-filter-contrast': String(tone.contrast),
    '--enemy-filter-saturate': String(tone.saturate),
    '--enemy-filter-sepia': String(tone.sepia),
  }
}

/**
 * 적 id별 전투 초상 위치·크기 보정
 * - offsetY: 음수면 위, 양수면 아래
 * - offsetX: 음수면 왼쪽, 양수면 오른쪽
 * - width: 기본 292px 대신 개별 너비 (가로로 긴 적 등)
 */
export const ENEMY_PORTRAIT_LAYOUT_OVERRIDES = {
  'dark-knight': {
    offsetY: -80,
    offsetX: 0,
  },
  'time-manager': {
    offsetY: -80,
    offsetX: 0,
  },
}

export function getEnemyPortraitLayoutOffset(enemyId) {
  const layout = ENEMY_PORTRAIT_LAYOUT_OVERRIDES[enemyId]
  return {
    offsetY: layout?.offsetY ?? 0,
    offsetX: layout?.offsetX ?? 0,
    width: layout?.width ?? null,
  }
}

/** 초상+HP+의도 영역 전체 이동 (React) */
export function getEnemyFigureLayoutStyle(enemyId) {
  const { offsetY, offsetX } = getEnemyPortraitLayoutOffset(enemyId)
  if (!offsetY && !offsetX) return {}

  return {
    '--enemy-figure-offset-y': `${offsetY}px`,
    '--enemy-figure-offset-x': `${offsetX}px`,
  }
}

/** 초상 일러스트만 (너비·색 보정) */
export function getEnemyPortraitOverrideStyle(enemyId) {
  const { width } = getEnemyPortraitLayoutOffset(enemyId)
  const style = { ...getEnemyPortraitToneOverrideStyle(enemyId) }

  if (width != null) {
    style['--enemy-portrait-width'] = `${width}px`
  }

  return style
}

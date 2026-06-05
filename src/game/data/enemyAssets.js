import ashImpPng from '../../assets/enemies/ash-imp.png'
import boneRatPng from '../../assets/enemies/bone-rat.png'
import wolfPng from '../../assets/enemies/wolf.png'

/** 적 id → 이미지 URL (Vite import). 이미지 없는 적은 뼈쥐를 임시 기본값으로 쓴다. */
export const ENEMY_IMAGE_SOURCES = {
  'starving-wolf': wolfPng,
  'ash-imp': ashImpPng,
  'bone-rat': boneRatPng,
}

const DEFAULT_ENEMY_IMAGE = boneRatPng

export function getEnemyImageSrc(enemyId) {
  if (!enemyId) return DEFAULT_ENEMY_IMAGE
  return ENEMY_IMAGE_SOURCES[enemyId] ?? DEFAULT_ENEMY_IMAGE
}

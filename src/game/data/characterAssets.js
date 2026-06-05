import mediumPng from '../../assets/characters/medium.png'
import monkPng from '../../assets/characters/monk.png'
import swordsmanPng from '../../assets/characters/swordsman.png'
import thiefPng from '../../assets/characters/thief.png'

/** 육체 classId → 이미지 URL (Vite import). 파일명은 bodyClasses id와 동일하게 맞춘다. */
export const CHARACTER_IMAGE_SOURCES = {
  swordsman: swordsmanPng,
  monk: monkPng,
  thief: thiefPng,
  medium: mediumPng,
}

export function getCharacterImageSrc(classId) {
  if (!classId) return null
  return CHARACTER_IMAGE_SOURCES[classId] ?? null
}

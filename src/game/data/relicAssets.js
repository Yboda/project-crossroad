import ashenCrownPng from '../../assets/relics/ashen-crown.png'
import blackThornPng from '../../assets/relics/black-thorn.png'
import boneDicePng from '../../assets/relics/bone-dice.png'
import brokenClockPng from '../../assets/relics/broken-clock.png'
import glassEyePng from '../../assets/relics/glass-eye.png'
import hardBreadPng from '../../assets/relics/hard-bread.png'
import merchantMarkPng from '../../assets/relics/merchant-mark.png'
import namelessPrayerPng from '../../assets/relics/nameless-prayer.png'
import oldArmorPng from '../../assets/relics/old-armor.png'
import oldShieldFragmentPng from '../../assets/relics/broken-shield-fragment.png'
import oldShieldPng from '../../assets/relics/old-shield.png'
import rustedKeyPng from '../../assets/relics/rusted-key.png'
import sealedMemoryPng from '../../assets/relics/sealed-memory.png'
import warmEmberPng from '../../assets/relics/warm-ember.png'
import wardensMarkPng from '../../assets/relics/wardens-mark.png'

/** 유물 id → 이미지 URL (Vite import). 파일명은 유물 id와 동일하게 맞춘다. */
export const RELIC_IMAGE_SOURCES = {
  'ashen-crown': ashenCrownPng,
  'black-thorn': blackThornPng,
  'bone-dice': boneDicePng,
  'broken-clock': brokenClockPng,
  'glass-eye': glassEyePng,
  'hard-bread': hardBreadPng,
  'merchant-mark': merchantMarkPng,
  'nameless-prayer': namelessPrayerPng,
  'old-armor': oldArmorPng,
  'broken-shield-fragment': oldShieldFragmentPng,
  'old-shield': oldShieldPng,
  'rusted-key': rustedKeyPng,
  'sealed-name': sealedMemoryPng,
  'warm-ember': warmEmberPng,
  'wardens-mark': wardensMarkPng,
}

export function getRelicImageSrc(relicId) {
  if (!relicId) return null
  return RELIC_IMAGE_SOURCES[relicId] ?? null
}

export function relicHasImage(relicId) {
  return Boolean(RELIC_IMAGE_SOURCES[relicId])
}

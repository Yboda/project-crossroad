import { relics } from '../data/relics'

export function getRelicById(id) {
  return relics.find((relic) => relic.id === id) ?? relics[0]
}

export function hasRelic(player, id) {
  return player.relics.includes(id)
}

export function getAttackBonus(player, enemy) {
  let bonus = 0
  if (hasRelic(player, 'black-thorn') || hasRelic(player, 'butcher-knife')) {
    bonus += 1
  }
  if (enemy?.isBoss && hasRelic(player, 'ashen-crown')) {
    bonus += 2
  }
  if (enemy?.isBoss && hasRelic(player, 'warden-gavel')) {
    bonus += 1
  }
  return bonus
}

export function applyDefendRelics(player) {
  if (hasRelic(player, 'old-shield-fragment') || hasRelic(player, 'mirror-fragment')) {
    player.mp = Math.min(player.maxMp, player.mp + 1)
    const source = hasRelic(player, 'mirror-fragment') ? '감옥 거울 조각' : '낡은 방패 파편'
    return `${source}이 반응해 MP를 1 회복했다.`
  }
  return ''
}

export function getShopPriceMultiplier(player) {
  if (hasRelic(player, 'merchant-mark')) {
    return 0.7
  }
  if (hasRelic(player, 'rusted-key')) {
    return 0.85
  }
  return 1
}

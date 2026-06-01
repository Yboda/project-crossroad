import { relics } from '../data/relics'

export function getRelicById(id) {
  return relics.find((relic) => relic.id === id) ?? relics[0]
}

export function hasRelic(player, id) {
  return player.relics.includes(id)
}

export function getAttackBonus(player, enemy) {
  let bonus = 0
  if (hasRelic(player, 'black-thorn')) {
    bonus += 1
  }
  if (enemy?.isBoss && hasRelic(player, 'ashen-crown')) {
    bonus += 2
  }
  return bonus
}

export function applyDefendRelics(player) {
  if (hasRelic(player, 'old-shield-fragment')) {
    player.mp = Math.min(player.maxMp, player.mp + 1)
    return '낡은 방패 파편이 반응해 MP가 1 회복됐다.'
  }
  return ''
}

export function getShopPriceMultiplier(player) {
  return hasRelic(player, 'rusted-key') ? 0.85 : 1
}

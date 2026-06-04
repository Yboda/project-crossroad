import { events } from '../data/events'
import { getRelicById, hasRelic } from './relicSystem'

export function getEventById(id) {
  return events.find((event) => event.id === id) ?? events[0]
}

export function createEventNarrative(eventId, player) {
  const event = getEventById(eventId)
  return {
    id: `event-${event.id}`,
    layout: 'exploration',
    story: event.story,
    prompt: '당신은,',
    options: event.options.map((option) => ({
      id: `event-${event.id}-${option.id}`,
      label: option.label,
      detail: option.detail,
      type: 'event-choice',
      eventId: event.id,
      result: option.result,
      locked: option.lockedByRelic ? !player.relics.includes(option.lockedByRelic) : false,
    })),
  }
}

export function applyEventResult(player, runState, result = {}) {
  const messages = []
  if (result.hp) {
    player.hp = clamp(player.hp + result.hp, 1, player.maxHp)
    messages.push(result.hp > 0 ? `HP를 ${result.hp} 회복했다.` : `HP를 ${Math.abs(result.hp)} 잃었다.`)
  }
  if (result.mp) {
    player.mp = clamp(player.mp + result.mp, 0, player.maxMp)
    messages.push(`MP를 ${result.mp} 회복했다.`)
  }
  if (result.attack) {
    player.attack += result.attack
    messages.push(`공격력이 ${result.attack} 올랐다.`)
  }
  if (result.defense) {
    player.defense += result.defense
    messages.push(`방어력이 ${result.defense} 올랐다.`)
  }
  if (result.gold) {
    runState.gold = Math.max(0, runState.gold + result.gold)
    messages.push(result.gold > 0 ? `골드 ${result.gold}을 얻었다.` : `골드 ${Math.abs(result.gold)}을 잃었다.`)
  }
  if (result.memoryShards) {
    runState.memoryShards += result.memoryShards
    messages.push(`영혼의 흔적 ${result.memoryShards}개를 얻었다.`)
  }
  if (result.coreShards) {
    runState.coreShards += result.coreShards
    messages.push(`핵의 파편 ${result.coreShards}개를 얻었다.`)
  }
  if (result.relic && !player.relics.includes(result.relic)) {
    player.relics.push(result.relic)
    messages.push(`${getRelicById(result.relic).name} 유물을 얻었다.`)
  }
  if (result.stealth) {
    runState.hasStealthApproach = true
    messages.push('다음 전투에서 기습할 기회를 잡았다.')
  }

  return messages.length ? messages : ['아무 일도 일어나지 않았다.']
}

export function applyRest(player, restType) {
  const messages = []

  if (restType === 'hp') {
    const hpBefore = player.hp
    const heal = Math.ceil(player.maxHp * 0.35)
    player.hp = Math.min(player.maxHp, player.hp + heal)
    const hpRecovered = player.hp - hpBefore
    if (hpRecovered > 0) {
      messages.push(`HP를 ${hpRecovered} 회복했다.`)
    }

    if (hasRelic(player, 'hard-bread')) {
      const breadBefore = player.hp
      player.hp = Math.min(player.maxHp, player.hp + 8)
      const breadHeal = player.hp - breadBefore
      if (breadHeal > 0) {
        messages.push(`딱딱한 빵을 먹어 HP를 ${breadHeal} 더 회복했다.`)
      }
    }

    if (hasRelic(player, 'warm-ember')) {
      const mpBefore = player.mp
      player.mp = Math.min(player.maxMp, player.mp + 3)
      const mpRecovered = player.mp - mpBefore
      if (mpRecovered > 0) {
        messages.push(`잿불의 온기로 MP를 ${mpRecovered} 회복했다.`)
      }
    }

    if (hasRelic(player, 'corpse-sack')) {
      const sackBefore = player.hp
      player.hp = Math.min(player.maxHp, player.hp + 5)
      const sackHeal = player.hp - sackBefore
      if (sackHeal > 0) {
        messages.push(`시체 자루의 여분으로 HP를 ${sackHeal} 더 회복했다.`)
      }
    }
  }

  if (restType === 'mp') {
    const mpBefore = player.mp
    player.mp = player.maxMp
    const mpRecovered = player.mp - mpBefore
    if (mpRecovered > 0) {
      messages.push(`MP를 ${mpRecovered} 회복했다.`)
    } else {
      messages.push('이미 기력이 가득했다.')
    }

    if (hasRelic(player, 'hard-bread')) {
      const breadBefore = player.hp
      player.hp = Math.min(player.maxHp, player.hp + 8)
      const breadHeal = player.hp - breadBefore
      if (breadHeal > 0) {
        messages.push(`딱딱한 빵을 먹어 HP를 ${breadHeal} 회복했다.`)
      }
    }

    if (hasRelic(player, 'corpse-sack')) {
      const sackBefore = player.hp
      player.hp = Math.min(player.maxHp, player.hp + 5)
      const sackHeal = player.hp - sackBefore
      if (sackHeal > 0) {
        messages.push(`시체 자루의 여분으로 HP를 ${sackHeal} 회복했다.`)
      }
    }
  }

  return messages.length ? messages : ['휴식했지만 달라진 것은 없었다.']
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

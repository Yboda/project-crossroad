import { events } from '../data/events'
import { getRelicById } from './relicSystem'

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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

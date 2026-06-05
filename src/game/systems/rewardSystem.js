import { getBossRelicPool } from '../data/bossRelics'
import { rewardTable } from '../data/rewards'
import { sortStatChoiceOptions } from '../utils/sortStatChoices'
import { getRelicById } from './relicSystem'
import { addRunReward } from './runState'

/** 스탯 보상 적용 후 탐험 스토리에 붙는 결과 문구 */
export function formatStatGainMessage(type, value) {
  if (type === 'attack') {
    return `공격력이 ${value} 올랐다.`
  }
  if (type === 'defense') {
    return `방어력이 ${value} 올랐다.`
  }
  if (type === 'maxHp') {
    return `최대 HP가 ${value} 올랐다.`
  }
  if (type === 'maxMp') {
    return `최대 MP가 ${value} 올랐다.`
  }
  return ''
}

const STAT_REWARD_TYPES = new Set(['attack', 'defense', 'maxHp', 'maxMp'])
const STAT_GAIN_ORDER = ['attack', 'defense', 'maxHp', 'maxMp']

export function getStatGainFromReward(reward) {
  if (!reward || !STAT_REWARD_TYPES.has(reward.type)) {
    return null
  }
  return { type: reward.type, value: reward.value }
}

/** 같은 스탯 보상을 합산해 스토리용 문구 배열로 만든다 (예: 공격 +1, +1 → 「공격력이 2 올랐다.」) */
export function formatMergedStatGainLines(gains = []) {
  const totals = new Map()

  for (const gain of gains) {
    if (!gain || !STAT_REWARD_TYPES.has(gain.type)) {
      continue
    }
    totals.set(gain.type, (totals.get(gain.type) ?? 0) + gain.value)
  }

  return STAT_GAIN_ORDER.filter((type) => totals.has(type)).map((type) =>
    formatStatGainMessage(type, totals.get(type)),
  )
}

export function getRewardStatGainLine(reward) {
  const gain = getStatGainFromReward(reward)
  return gain ? formatStatGainMessage(gain.type, gain.value) : null
}

export function createRewardOptions(player, enemy, pendingRelicIds = []) {
  const excludeRelicIds = pendingRelicIds.filter(Boolean)
  const isBoss = Boolean(enemy?.isBoss)

  return sortStatChoiceOptions(
    rewardTable
      .filter((reward) => reward.type !== 'relic' || !player.relics.includes(reward.value))
      .filter((reward) => !isBoss || reward.type !== 'relic')
      .filter(
        (reward) =>
          !(reward.type === 'relic' && excludeRelicIds.includes(reward.value)),
      )
      .slice(0, 3)
      .map((reward) => ({
        id: `reward-${reward.type}-${reward.value}`,
        label: reward.label,
        detail: reward.detail,
        type: 'reward',
        reward,
      })),
  )
}

export function rollBossPendingRelic(bossId, player) {
  const pool = getBossRelicPool(bossId).filter((relicId) => !player.relics.includes(relicId))
  if (!pool.length) {
    return null
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

export function applyReward(player, runState, reward) {
  if (reward.type === 'maxHp') {
    player.maxHp += reward.value
    player.hp = Math.min(player.maxHp, player.hp + reward.value)
    return '호흡을 고르며 육체의 지구력을 끌어올렸다.'
  }

  if (reward.type === 'maxMp') {
    player.maxMp += reward.value
    player.mp = Math.min(player.maxMp, player.mp + reward.value)
    return '잔향을 따라 호흡을 맞추며 기력을 채웠다.'
  }

  if (reward.type === 'attack') {
    player.attack += reward.value
    return '공격 패턴을 하나씩 복기했다. 다음 공격이 더 정확해질 것이다.'
  }

  if (reward.type === 'defense') {
    player.defense += reward.value
    return '맞아 본 순간을 되짚으며 방어 자세를 연마했다.'
  }

  if (reward.type === 'relic') {
    const relic = getRelicById(reward.value)
    player.relics.push(reward.value)
    return `${relic.name}을 집어 들고 기운을 맞췄다.`
  }

  return addRunReward(runState, reward)
}

export function rollVictoryPendingRelic(player) {
  const pool = rewardTable.filter(
    (entry) => entry.type === 'relic' && !player.relics.includes(entry.value),
  )
  if (!pool.length || Math.random() > 0.4) {
    return null
  }
  return pool[Math.floor(Math.random() * pool.length)].value
}

export function parseVictoryLoot(log = []) {
  const loot = { gold: 0, exp: 0, memoryShards: 0, coreShards: 0 }

  for (const line of log) {
    const goldMatch = line.match(/골드 (\d+)/)
    if (goldMatch) loot.gold += Number(goldMatch[1])

    const expMatch = line.match(/경험치 \+(\d+)/)
    if (expMatch) loot.exp = Number(expMatch[1])

    const shardMatch = line.match(/영혼의 흔적 (\d+)/)
    if (shardMatch) loot.memoryShards += Number(shardMatch[1])

    const coreMatch = line.match(/핵의 파편 (\d+)/)
    if (coreMatch) loot.coreShards += Number(coreMatch[1])
  }

  return loot
}

export function applyEnemyDrop(runState, enemy) {
  const rewards = enemy.rewards ?? {}
  const gold = rollRange(rewards.gold)
  const memoryShards = rollRange(rewards.memoryShards)
  const coreShards = rollRange(rewards.coreShards)
  runState.gold += gold
  runState.memoryShards += memoryShards
  runState.coreShards += coreShards

  return [
    gold > 0 ? `골드 ${gold}을 얻었다.` : null,
    memoryShards > 0 ? `영혼의 흔적 ${memoryShards}개를 얻었다.` : null,
    coreShards > 0 ? `핵의 파편 ${coreShards}개를 얻었다.` : null,
  ].filter(Boolean)
}

function rollRange(range = [0, 0]) {
  const [min, max] = range
  return min + Math.floor(Math.random() * (max - min + 1))
}

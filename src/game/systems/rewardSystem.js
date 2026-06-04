import { rewardTable } from '../data/rewards'
import { sortStatChoiceOptions } from '../utils/sortStatChoices'
import { getRelicById } from './relicSystem'
import { addRunReward } from './runState'

export function createRewardOptions(player, enemy) {
  const options = sortStatChoiceOptions(
    rewardTable
      .filter((reward) => reward.type !== 'relic' || !player.relics.includes(reward.value))
      .slice(0, 3)
      .map((reward) => ({
        id: `reward-${reward.type}-${reward.value}`,
        label: reward.label,
        detail: reward.detail,
        type: 'reward',
        reward,
      })),
  )

  if (enemy?.isBoss) {
    return [
      {
        id: 'reward-boss-memory',
        label: '보스의 영혼 흔적',
        detail: '영혼의 흔적 6개와 많은 골드를 얻는다.',
        type: 'reward',
        reward: { type: 'boss-cache', value: 6 },
      },
      ...options,
    ]
  }

  return options
}

export function applyReward(player, runState, reward) {
  if (reward.type === 'maxHp') {
    player.maxHp += reward.value
    player.hp = Math.min(player.maxHp, player.hp + reward.value)
    return `최대 체력이 ${reward.value} 올랐다.`
  }

  if (reward.type === 'maxMp') {
    player.maxMp += reward.value
    player.mp = Math.min(player.maxMp, player.mp + reward.value)
    return `최대 MP가 ${reward.value} 올랐다.`
  }

  if (reward.type === 'attack' || reward.type === 'defense') {
    player[reward.type] += reward.value
    return `${reward.type === 'attack' ? '공격력' : '방어력'}이 ${reward.value} 올랐다.`
  }

  if (reward.type === 'relic') {
    const relic = getRelicById(reward.value)
    player.relics.push(reward.value)
    return `${relic.name} 유물을 획득했다.`
  }

  if (reward.type === 'boss-cache') {
    runState.gold += 35
    runState.memoryShards += reward.value
    return `보스의 잔향에서 골드 35와 영혼의 흔적 ${reward.value}개를 얻었다.`
  }

  return addRunReward(runState, reward)
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

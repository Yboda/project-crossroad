export function getExpToNextLevel(level) {
  return 10 + level * 8
}

export function createExperienceState() {
  return {
    level: 1,
    exp: 0,
    expToNext: getExpToNextLevel(1),
  }
}

export function resetExperience(runState) {
  Object.assign(runState, createExperienceState())
}

export function getBattleExpReward(enemy) {
  if (enemy?.isBoss) {
    return 28 + Math.floor(Math.random() * 8)
  }
  return 10 + Math.floor(Math.random() * 5)
}

export function grantBattleExp(runState, enemy) {
  const gained = getBattleExpReward(enemy)
  runState.exp += gained

  const levelUps = []
  while (runState.exp >= runState.expToNext) {
    runState.exp -= runState.expToNext
    runState.level += 1
    runState.expToNext = getExpToNextLevel(runState.level)
    levelUps.push(runState.level)
  }

  return {
    gained,
    levelUps,
    leveledUp: levelUps.length > 0,
    newLevel: runState.level,
  }
}

export function createLevelUpRewardOptions() {
  return [
    {
      id: 'level-attack',
      label: '공격 감각',
      detail: '공격력 +1',
      type: 'level-up-reward',
      reward: { type: 'attack', value: 1 },
    },
    {
      id: 'level-defense',
      label: '방어 감각',
      detail: '방어력 +1',
      type: 'level-up-reward',
      reward: { type: 'defense', value: 1 },
    },
    {
      id: 'level-hp',
      label: '생존 감각',
      detail: '최대 HP +4',
      type: 'level-up-reward',
      reward: { type: 'maxHp', value: 4 },
    },
  ]
}

export function applyLevelUpReward(player, reward) {
  if (reward.type === 'maxHp') {
    player.maxHp += reward.value
    player.hp = Math.min(player.maxHp, player.hp + reward.value)
    return `최대 HP가 ${reward.value} 올랐다.`
  }

  if (reward.type === 'attack' || reward.type === 'defense') {
    player[reward.type] += reward.value
    return `${reward.type === 'attack' ? '공격력' : '방어력'}이 ${reward.value} 올랐다.`
  }

  if (reward.type === 'maxMp') {
    player.maxMp += reward.value
    player.mp = Math.min(player.maxMp, player.mp + reward.value)
    return `최대 MP가 ${reward.value} 올랐다.`
  }

  return '육체가 조금 더 익숙해졌다.'
}

export function getLevelText(level) {
  return `Lv.${level}`
}

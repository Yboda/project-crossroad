import { applyDefendRelics, getAttackBonus, getEffectiveDefense } from './relicSystem'

export function createPlayerState(character) {
  return {
    hp: character.hp,
    maxHp: character.maxHp,
    attack: character.attack,
    defense: character.defense,
    mp: character.mp,
    maxMp: character.maxMp,
    block: 0,
    relics: [],
  }
}

export function getBattleActions(player, enemy) {
  const attackRawDamage = player.attack + getAttackBonus(player, enemy)
  const attackDamage = Math.max(0, attackRawDamage - enemy.block)
  const blockSuffix = enemy.block > 0 ? ` / 적 방어도 ${enemy.block} 상쇄 후 ${attackDamage}` : ''

  return [
    {
      id: 'attack',
      label: '공격한다.',
      detail: `피해 ${attackRawDamage}${blockSuffix} / MP +1`,
      type: 'battle-action',
    },
    {
      id: 'defend',
      label: '방어 자세를 취한다.',
      detail: `방어도 ${getEffectiveDefense(player)} 획득`,
      type: 'battle-action',
    },
    {
      id: 'open-skills',
      label: '스킬을 사용한다.',
      detail: `MP ${player.mp}/${player.maxMp}`,
      type: 'open-skills',
    },
  ]
}

export function getSkillPreview(skillId, player, enemy = { block: 0 }) {
  const enemyBlock = enemy?.block ?? 0

  if (skillId === 'heavy') {
    const rawDamage = player.attack + 8
    const finalDamage = Math.max(0, rawDamage - enemyBlock)
    return { kind: 'damage', rawDamage, finalDamage, enemyBlock }
  }

  if (skillId === 'mana-guard') {
    return { kind: 'block', block: getEffectiveDefense(player) + 4 }
  }

  return null
}

export function formatSkillPreviewStat(preview) {
  if (!preview) return ''

  if (preview.kind === 'damage') {
    if (preview.enemyBlock > 0) {
      return `피해 ${preview.rawDamage} · 방어도 ${preview.enemyBlock} 상쇄 후 ${preview.finalDamage}`
    }
    return `피해 ${preview.finalDamage}`
  }

  if (preview.kind === 'block') {
    return `방어도 ${preview.block} 획득`
  }

  return ''
}

export function getSkillActions(player, enemy) {
  const heavyRawDamage = player.attack + 8
  const heavyDamage = Math.max(0, heavyRawDamage - enemy.block)
  const blockText = enemy.block > 0 ? ` / 적 방어도 ${enemy.block} 상쇄 후 ${heavyDamage}` : ''

  return [
    {
      id: 'heavy',
      label: '강타',
      detail: player.mp >= 3 ? `MP 3 소모 / 피해 ${heavyRawDamage}${blockText}` : 'MP 3 필요',
      type: 'skill-action',
      locked: player.mp < 3,
    },
    {
      id: 'mana-guard',
      label: '마력 방패',
      detail: player.mp >= 2 ? `MP 2 소모 / 방어도 ${getEffectiveDefense(player) + 4} 획득` : 'MP 2 필요',
      type: 'skill-action',
      locked: player.mp < 2,
    },
    {
      id: 'cancel-skills',
      label: '취소한다.',
      detail: '스킬 선택을 닫는다.',
      type: 'close-skills',
    },
  ]
}

export function getEnemyIntent(enemy) {
  const pattern = enemy?.pattern ?? []
  if (!pattern.length) {
    return { type: 'attack', value: enemy?.attack ?? 0, label: '공격', description: '공격 준비' }
  }

  const intent = pattern[enemy.turn % pattern.length]
  if (!intent) {
    return { type: 'attack', value: enemy?.attack ?? 0, label: '공격', description: '공격 준비' }
  }

  if (intent.type === 'attack') {
    return {
      ...intent,
      value: intent.value + Math.floor(enemy.attack / 3),
      description: `${intent.label}: 피해 ${intent.value + Math.floor(enemy.attack / 3)}`,
    }
  }

  if (intent.type === 'block') {
    return {
      ...intent,
      description: `${intent.label}: 방어도 ${intent.value}`,
    }
  }

  return {
    ...intent,
    description: `${intent.label}: 공격력 +${intent.value}`,
  }
}

export function applyPlayerAction(player, enemy, actionId) {
  player.block = 0

  if (actionId === 'attack') {
    const rawDamage = player.attack + getAttackBonus(player, enemy)
    const damage = Math.max(0, rawDamage - enemy.block)
    enemy.block = 0
    enemy.hp = Math.max(0, enemy.hp - damage)
    player.mp = Math.min(player.maxMp, player.mp + 1)
    return {
      message: `당신은 ${enemy.name}에게 ${damage}의 피해를 입혔다. MP가 1 회복됐다.`,
      target: 'enemy',
      floatText: `-${damage}`,
      floatType: 'damage',
    }
  }

  if (actionId === 'defend') {
    enemy.block = 0
    const defenseGain = getEffectiveDefense(player)
    player.block += defenseGain
    const relicMessage = applyDefendRelics(player)
    return {
      message: [`당신은 자세를 낮추고 방어도 ${defenseGain}을 얻었다.`, relicMessage].filter(Boolean).join(' '),
      target: 'player',
      floatText: `+${defenseGain}`,
      floatType: 'block',
    }
  }

  if (actionId === 'heavy') {
    const rawDamage = player.attack + 8
    const damage = Math.max(0, rawDamage - enemy.block)
    enemy.block = 0
    enemy.hp = Math.max(0, enemy.hp - damage)
    player.mp = Math.max(0, player.mp - 3)
    return {
      message: `당신은 MP를 집중해 ${damage}의 큰 피해를 입혔다.`,
      target: 'enemy',
      floatText: `-${damage}`,
      floatType: 'damage',
    }
  }

  if (actionId === 'mana-guard') {
    const block = getEffectiveDefense(player) + 4
    enemy.block = 0
    player.mp = Math.max(0, player.mp - 2)
    player.block += block
    return {
      message: `당신은 마력으로 몸을 감싸 방어도 ${block}을 얻었다.`,
      target: 'player',
      floatText: `+${block}`,
      floatType: 'block',
    }
  }

  enemy.block = 0
  return {
    message: '당신은 망설였다.',
    target: 'player',
    floatText: '...',
    floatType: 'neutral',
  }
}

export function applyEnemyIntent(player, enemy) {
  const intent = getEnemyIntent(enemy)
  enemy.turn += 1

  if (intent.type === 'attack') {
    const damage = Math.max(0, intent.value - player.block)
    player.hp = Math.max(0, player.hp - damage)
    player.block = 0
    return {
      message: `${enemy.name}의 ${intent.label}. 당신은 ${damage}의 피해를 받았다.`,
      target: 'player',
      floatText: `-${damage}`,
      floatType: 'damage',
    }
  }

  if (intent.type === 'block') {
    enemy.block += intent.value
    player.block = 0
    return {
      message: `${enemy.name}가 몸을 웅크리고 방어도 ${intent.value}을 얻었다.`,
      target: 'enemy',
      floatText: `+${intent.value}`,
      floatType: 'block',
    }
  }

  enemy.attack += intent.value
  player.block = 0
  return {
    message: `${enemy.name}의 힘이 강해졌다. 공격력이 ${intent.value} 올랐다.`,
    target: 'enemy',
    floatText: `+${intent.value}`,
    floatType: 'buff',
  }
}

export function createRewardOptions(player) {
  const hasThornRelic = player.relics.includes('black-thorn')

  return [
    {
      id: 'reward-attack',
      label: '공격력 +1',
      detail: '승리의 여유를 공격 패턴 복기에 쓴다.',
      type: 'reward',
      reward: { type: 'attack', value: 1 },
    },
    {
      id: hasThornRelic ? 'reward-defense' : 'reward-thorn',
      label: hasThornRelic ? '방어력 +1' : '유물: 검은 가시',
      detail: hasThornRelic
        ? '맞아 본 순간을 되짚으며 방어 자세를 연마한다.'
        : '전장에 남은 기운 속에서 유물을 찾아 연결한다.',
      type: 'reward',
      reward: hasThornRelic
        ? { type: 'defense', value: 1 }
        : { type: 'relic', value: 'black-thorn' },
    },
    {
      id: 'reward-max-hp',
      label: '최대 HP +5',
      detail: '호흡을 고르며 육체의 지구력을 끌어올린다.',
      type: 'reward',
      reward: { type: 'maxHp', value: 5 },
    },
  ]
}

export function applyReward(player, reward) {
  if (reward.type === 'maxHp') {
    player.maxHp += reward.value
    player.hp = Math.min(player.maxHp, player.hp + reward.value)
    return '호흡을 고르며 육체의 지구력을 끌어올렸다.'
  }

  if (reward.type === 'attack') {
    player.attack += reward.value
    return '공격 패턴을 하나씩 복기했다. 다음 공격이 더 정확해질 것이다.'
  }

  if (reward.type === 'defense') {
    player.defense += reward.value
    return '맞아 본 순간을 되짚으며 방어 자세를 연마했다.'
  }

  player.relics.push(reward.value)
  return '유물을 집어 들고 기운을 맞췄다.'
}

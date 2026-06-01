import { soulNodes } from '../data/soulNodes'

export function createDefaultPersistentState() {
  return {
    memoryShards: 0,
    unlockedSoulNodes: [],
    unlockedMemories: [],
    endingsSeen: [],
    discovered: {
      enemies: [],
      events: [],
      relics: [],
    },
  }
}

export function applySoulBonuses(player, persistentState) {
  for (const nodeId of persistentState.unlockedSoulNodes) {
    const node = soulNodes.find(({ id }) => id === nodeId)
    if (!node?.bonus) {
      continue
    }

    for (const [stat, value] of Object.entries(node.bonus)) {
      if (typeof value === 'number') {
        player[stat] = (player[stat] ?? 0) + value
      } else {
        player[stat] = value
      }
    }
  }

  player.hp = Math.min(player.maxHp, player.hp ?? player.maxHp)
  player.mp = Math.min(player.maxMp, player.mp ?? player.maxMp)
  return player
}

export function canUnlockSoulNode(node, persistentState) {
  const requirements = node.requires ?? []
  return (
    persistentState.memoryShards >= node.cost &&
    !persistentState.unlockedSoulNodes.includes(node.id) &&
    requirements.every((id) => persistentState.unlockedSoulNodes.includes(id))
  )
}

export function unlockSoulNode(nodeId, persistentState) {
  const node = soulNodes.find(({ id }) => id === nodeId)
  if (!node || !canUnlockSoulNode(node, persistentState)) {
    return { ok: false, message: '각인을 새길 수 없다.' }
  }

  persistentState.memoryShards -= node.cost
  persistentState.unlockedSoulNodes.push(node.id)
  persistentState.unlockedMemories.push(`soul-${node.id}`)

  return { ok: true, message: node.memoryText }
}

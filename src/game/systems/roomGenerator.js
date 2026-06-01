import { getFloorByIndex, isFinalFloor } from '../data/floors'
import { roomTypes } from '../data/roomTypes'

export function createRoomOptions(runStateOrDepth, count = 3) {
  if (typeof runStateOrDepth === 'number') {
    return createLegacyRoomOptions(runStateOrDepth, count)
  }

  const runState = runStateOrDepth
  const floor = getFloorByIndex(runState.floorIndex)

  if (runState.floorDepth === floor.depthToBoss) {
    return [createRoomInstance('boss', floor, runState, 0)]
  }

  if (runState.floorDepth > floor.depthToBoss && isFinalFloor(runState.floorIndex)) {
    const type = 'ending'
    return [createRoomInstance(type, floor, runState, 0)]
  }

  const selectedTypes = []
  const recentTypes = runState.roomHistory.slice(-2)

  while (selectedTypes.length < count) {
    const type = pickWeightedRoomType(floor.roomWeights, [...recentTypes, ...selectedTypes])
    selectedTypes.push(type)
  }

  return selectedTypes.map((type, index) => createRoomInstance(type, floor, runState, index))
}

function createLegacyRoomOptions(depth, count) {
  const typeList = Object.keys(roomTypes)
  const offset = depth % typeList.length
  return Array.from({ length: count }, (_, index) => {
    const type = typeList[(offset + index) % typeList.length]
    return createRoomInstance(type, getFloorByIndex(0), { floorDepth: depth, totalDepth: depth, floorIndex: 0 }, index)
  })
}

function pickWeightedRoomType(weights, avoidTypes) {
  const entries = Object.entries(weights).map(([type, weight]) => [
    type,
    avoidTypes.includes(type) ? Math.max(1, Math.floor(weight * 0.35)) : weight,
  ])
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = Math.random() * total

  for (const [type, weight] of entries) {
    roll -= weight
    if (roll <= 0) {
      return type
    }
  }

  return entries[0][0]
}

function createRoomInstance(type, floor, runState, index) {
  const template = roomTypes[type] ?? roomTypes.battle
  const eventId = type === 'event' || type === 'mystery'
    ? floor.eventPool[(runState.totalDepth + index) % floor.eventPool.length]
    : null

  return {
    ...template,
    id: type,
    type,
    floorId: floor.id,
    floorNumber: floor.floorNumber,
    enemyPool: floor.enemyPool,
    bossId: floor.bossId,
    eventId,
    instanceId: `${floor.id}-${type}-${runState.totalDepth}-${index}`,
    label: type === 'boss' ? `${floor.name}의 문지기` : template.label,
    risk: type === 'battle' && (runState.totalDepth + index) % 3 === 0 ? '위험도 높음' : template.risk,
  }
}

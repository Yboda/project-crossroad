import { createBodyCandidates } from './bodyGenerator'
import { createExperienceState, resetExperience } from './experienceSystem'
import { applySoulBonuses, createDefaultPersistentState } from './soulEngravingSystem'

export function createInitialRunState(persistentState = createDefaultPersistentState()) {
  const bodies = createBodyCandidates(persistentState)
  const previewBody = bodies[0]
  const player = applySoulBonuses(
    { ...previewBody.stats, block: 0, relics: [], skills: [...previewBody.skills] },
    persistentState,
  )

  return {
    floorIndex: 0,
    floorDepth: 0,
    totalDepth: 1,
    roomHistory: [],
    visitedEvents: [],
    defeatedBosses: [],
    gold: 35,
    memoryShards: 0,
    coreShards: 0,
    hasStealthApproach: false,
    currentBody: null,
    bodyCandidates: bodies,
    player,
    ...createExperienceState(),
  }
}

export function selectRunBody(runState, body, persistentState) {
  runState.currentBody = body
  runState.player = applySoulBonuses({ ...body.stats, block: 0, relics: [], skills: [...body.skills] }, persistentState)
  resetExperience(runState)
}

export function advanceRunDepth(runState) {
  runState.floorDepth += 1
  runState.totalDepth += 1
}

export function moveToNextFloor(runState) {
  runState.floorIndex += 1
  runState.floorDepth = 0
}

export function recordRoomVisit(runState, room) {
  runState.roomHistory.push(room.type ?? room.id)
  if (runState.roomHistory.length > 8) {
    runState.roomHistory.shift()
  }
}

export function addRunReward(runState, reward) {
  if (reward.type === 'gold') {
    runState.gold += reward.value
    return `전리품을 골라 챙겼다. 골드 ${reward.value}.`
  }

  if (reward.type === 'memoryShards') {
    runState.memoryShards += reward.value
    return `적의 잔향을 걷어 담았다. 영혼의 흔적 ${reward.value}개.`
  }

  if (reward.type === 'coreShards') {
    runState.coreShards += reward.value
    return `깊은 잔향을 걷어 담았다. 핵의 파편 ${reward.value}개.`
  }

  return ''
}

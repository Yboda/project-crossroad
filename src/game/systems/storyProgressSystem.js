import { memories } from '../data/memories'

export function unlockMemory(memoryId, persistentState) {
  const memory = memories.find(({ id }) => id === memoryId)
  if (!memory || persistentState.unlockedMemories.includes(memoryId)) {
    return null
  }

  persistentState.unlockedMemories.push(memoryId)
  return memory
}

export function checkCoreRouteUnlocked(persistentState, runState) {
  const hasCoreClueNode = persistentState.unlockedSoulNodes.includes('core-route-1')
  const hasEnoughMemories = ['boss-corpse-butcher', 'boss-mirror-jailer', 'fake-ending'].every((id) =>
    persistentState.unlockedMemories.includes(id),
  )
  const hasRelicSubstitute = runState.player.relics.includes('sealed-name')
  return (hasCoreClueNode && hasEnoughMemories) || (hasRelicSubstitute && runState.coreShards > 0)
}

export function createFakeEndingNarrative(runState) {
  return {
    id: `fake-ending-${runState.totalDepth}`,
    title: '가짜 햇살',
    story: [
      '문을 여는 순간 따스한 햇살이 얼굴을 감싼다.',
      '그러나 그림자가 생기지 않는다. 빛은 당신을 비추는 것이 아니라, 당신의 기억을 태우고 있었다.',
      '다음 순간, 당신은 다시 시체더미의 방으로 떨어진다.',
    ],
    prompt: '당신은,',
    options: [{ id: 'settle-fake-ending', label: '기억이 사라지기 전에 붙잡는다.', detail: '영혼에 남은 흔적을 붙잡고 시체더미로 돌아간다.', type: 'run-end', reason: 'fake-ending' }],
  }
}

export function createTrueEndingNarrative() {
  return {
    id: 'true-ending',
    title: '미궁의 핵',
    story: [
      '아래에서 올라오던 빛의 정체는 바깥의 태양이 아니었다. 그것은 네 영혼의 마지막 조각이었다.',
      '조각을 흡수하자 미궁의 기억이 함께 밀려든다. 이곳을 빠져나가면 미궁도 사라지고, 미궁이 된 너 또한 사라진다.',
      '너는 다시 스스로를 나눈다. 이번에는 잊기 위해서가 아니라, 누군가가 언젠가 다른 선택을 하도록 남기기 위해서.',
    ],
    prompt: '당신은,',
    options: [{ id: 'settle-true-ending', label: '눈을 감는다.', detail: '진엔딩을 기록한다.', type: 'run-end', reason: 'true-ending' }],
  }
}

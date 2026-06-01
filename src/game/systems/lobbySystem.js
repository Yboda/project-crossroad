import { soulNodes } from '../data/soulNodes'
import { canUnlockSoulNode } from './soulEngravingSystem'

export function createLobbyNarrative(runState, persistentState) {
  return {
    id: `lobby-${persistentState.memoryShards}-${persistentState.unlockedSoulNodes.length}`,
    layout: 'lobby-main',
    title: '시체더미의 방',
    story: [
      '당신은 다시 시체가 산더미처럼 쌓인 최초의 방에서 눈을 뜬다.',
      `보유 영혼의 흔적: ${persistentState.memoryShards}`,
      runState.currentBody
        ? `선택한 육체: ${runState.currentBody.name} - ${runState.currentBody.description}`
        : '아직 붙잡은 육체가 없다. 영혼 상태로는 이 방을 빠져나갈 수 없다.',
    ],
    stats: {
      memoryShards: persistentState.memoryShards,
      unlockedSoulNodes: persistentState.unlockedSoulNodes.length,
      selectedBodyName: runState.currentBody?.name ?? '미선택',
    },
    prompt: '로비 메뉴',
    options: [
      {
        id: 'open-body-select',
        label: runState.currentBody ? '육체를 다시 고른다.' : '육체를 고른다.',
        detail: '이번 여정에 사용할 육체를 선택한다.',
        type: 'open-body-select',
        variant: 'primary',
      },
      {
        id: 'open-soul-nodes',
        label: '영혼 각인을 살핀다.',
        detail: '모든 육체에 공통 적용되는 영구 능력을 해금한다.',
        type: 'open-soul-nodes',
      },
    ],
  }
}

export function createBodySelectNarrative(runState) {
  return {
    id: `body-select-${runState.currentBody?.id ?? 'none'}`,
    layout: 'body-select',
    title: '육체 선택',
    story: [
      '시체더미 위로 아직 쓸 수 있는 육체들이 떠오른다.',
      '영혼 각인은 특정 육체가 아니라 당신의 영혼에 새겨지므로, 어떤 육체를 골라도 공통 보너스가 적용된다.',
    ],
    selectedBodyId: runState.currentBody?.id ?? null,
    prompt: '이번 여정에 사용할 육체를 선택하세요.',
    options: [
      ...runState.bodyCandidates.map((body) => ({
        id: `body-${body.id}`,
        label: body.name,
        detail: `HP ${body.stats.maxHp} / 공격 ${body.stats.attack} / 방어 ${body.stats.defense} / MP ${body.stats.maxMp}`,
        type: 'select-body',
        body,
      })),
      {
        id: 'start-selected-run',
        label: '미궁으로 나아간다.',
        detail: runState.currentBody ? `${runState.currentBody.name}으로 시작한다.` : '육체를 선택하면 활성화된다.',
        type: 'continue-run',
        locked: !runState.currentBody,
        variant: 'primary',
      },
      { id: 'back-to-lobby', label: '로비로 돌아간다.', detail: '시체더미의 방으로 돌아간다.', type: 'back-to-lobby' },
    ],
  }
}

export function createSoulNodeNarrative(persistentState) {
  return {
    id: `soul-nodes-${persistentState.memoryShards}`,
    layout: 'soul-nodes',
    title: '영혼 각인',
    story: [
      '영혼의 흔적은 능력치가 아니라, 잊어버린 자신을 영혼에 다시 새기는 재료다.',
      '각인은 육체별 성장이 아니라 모든 여정과 모든 육체에 공통으로 적용되는 영구 성장이다.',
      `보유 영혼의 흔적: ${persistentState.memoryShards}`,
    ],
    prompt: '새길 각인을 선택하세요.',
    options: [
      ...soulNodes.map((node) => ({
        id: `unlock-node-${node.id}`,
        label: node.label,
        detail: persistentState.unlockedSoulNodes.includes(node.id)
          ? '이미 해금됨'
          : `비용 ${node.cost} / ${describeBonus(node.bonus)}`,
        type: 'unlock-soul-node',
        nodeId: node.id,
        locked: !canUnlockSoulNode(node, persistentState),
      })),
      { id: 'back-to-lobby', label: '돌아간다.', detail: '시체더미의 방으로 돌아간다.', type: 'back-to-lobby' },
    ],
  }
}

function describeBonus(bonus) {
  return Object.entries(bonus)
    .map(([key, value]) => `${key} ${typeof value === 'number' ? `+${value}` : '해금'}`)
    .join(', ')
}

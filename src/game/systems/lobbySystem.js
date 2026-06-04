import { soulNodes } from '../data/soulNodes'
import { canUnlockSoulNode } from './soulEngravingSystem'

export function createLobbyNarrative(runState, persistentState) {
  return {
    id: `lobby-${persistentState.memoryShards}-${persistentState.unlockedSoulNodes.length}`,
    layout: 'lobby-main',
    title: '시체더미의 방',
    story: [
      // '당신은 시체가 산더미처럼 쌓인 방에서 눈을 떴다.',
      // '고개를 들면, 까마득한 천장 위로 끝없는 어둠이 입을 벌리고 있다.',
      // '당신은 희미한 기억의 흔적을 되짚어 본다.',
      '당신은 차가운 석조 바닥에 몸이 내리꽂히는 감각과 함께 눈을 떴다.',
      '흐릿한 시야 너머로 산더미처럼 쌓인 시체들이 보인다.',
      '순식간에, 이 곳을 탈출해야한다는 두려움이 텅 빈 머릿속을 가득 채운다.',
      '그리고 당신 앞에는 아직 쓸 수 있는 육체들이 보인다.', 
      // `보유 영혼의 흔적: ${persistentState.memoryShards}`,
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
      },
      {
        id: 'open-soul-nodes',
        label: '영혼의 흔적을 새긴다.',
        detail: '영혼의 능력을 해금한다.',
        type: 'open-soul-nodes',
      },
      {
        id: 'start-run',
        label: '탐험을 시작한다.',
        detail: runState.currentBody ? `${runState.currentBody.name}으로 미궁에 들어선다.` : '육체를 먼저 선택해야 합니다.',
        type: 'continue-run',
        locked: !runState.currentBody,
        variant: 'primary',
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
      '시체더미 위로 아직 쓸 수 있는 육체들이 눈에 띈다.',
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
        id: 'confirm-body-select',
        label: '이 그릇을 취한다.',
        detail: runState.currentBody ? `${runState.currentBody.name}을(를) 선택한다.` : '육체를 선택하면 활성화된다.',
        type: 'back-to-lobby',
        locked: !runState.currentBody,
        variant: 'primary',
      },
      { id: 'back-to-lobby', label: '돌아가기', detail: '시체더미의 방으로 돌아간다.', type: 'back-to-lobby' },
    ],
  }
}

function getUnmetRequirementLabels(node, persistentState) {
  return (node.requires ?? [])
    .filter((requiredId) => !persistentState.unlockedSoulNodes.includes(requiredId))
    .map((requiredId) => getNodeLabel(requiredId))
}

export function createSoulNodeNarrative(persistentState) {
  return {
    id: `soul-nodes-${persistentState.memoryShards}`,
    layout: 'soul-nodes',
    title: '영혼 각인',
    memoryShards: persistentState.memoryShards,
    story: [
      // '영혼의 흔적은 능력치가 아니라, 잊어버린 자신을 영혼에 다시 새기는 재료다.',
      // '각인은 육체별 성장이 아니라 모든 여정과 모든 육체에 공통으로 적용되는 영구 성장이다.',
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
        summary: describeBonus(node.bonus),
        abilityDescription: describeAbility(node.bonus),
        iconType: getNodeIconType(node.bonus),
        cost: node.cost,
        memoryText: node.memoryText,
        unlocked: persistentState.unlockedSoulNodes.includes(node.id),
        requirements: node.requires ?? [],
        requirementLabels: (node.requires ?? []).map((requiredId) => getNodeLabel(requiredId)),
        unmetRequirementLabels: getUnmetRequirementLabels(node, persistentState),
        canAfford: persistentState.memoryShards >= node.cost,
        route: node.route,
        position: node.position,
        type: 'unlock-soul-node',
        nodeId: node.id,
        locked: !canUnlockSoulNode(node, persistentState),
      })),
      { id: 'back-to-lobby', label: '돌아간다.', detail: '시체더미의 방으로 돌아간다.', type: 'back-to-lobby' },
    ],
  }
}

function describeBonus(bonus) {
  const labels = {
    maxHp: '최대 HP',
    hp: 'HP',
    attack: '공격력',
    defense: '방어력',
    maxMp: '최대 MP',
    mp: 'MP',
    rareRewardBonus: '특수능력 해제',
    unlockCoreClue: '특수능력 해제',
  }

  return Object.entries(bonus)
    .map(([key, value]) => {
      if (key === 'rareRewardBonus' || key === 'unlockCoreClue') {
        return labels[key]
      }

      return `${labels[key] ?? key} ${typeof value === 'number' ? `+${value}` : '해제'}`
    })
    .join(', ')
}

function getNodeIconType(bonus) {
  if (bonus.attack) return 'attack'
  if (bonus.defense) return 'defense'
  if (bonus.maxHp || bonus.hp) return 'hp'
  if (bonus.maxMp || bonus.mp) return 'mp'
  return 'special'
}

function getNodeLabel(nodeId) {
  return soulNodes.find(({ id }) => id === nodeId)?.label ?? nodeId
}

function describeAbility(bonus) {
  if (bonus.attack) return `모든 공격 피해가 ${bonus.attack} 증가한다.`
  if (bonus.defense) return `방어 행동으로 얻는 방어도가 ${bonus.defense} 증가한다.`
  if (bonus.maxHp) return `새 육체를 붙잡을 때 최대 HP가 ${bonus.maxHp} 증가한다.`
  if (bonus.hp) return `여정 시작 시 HP를 ${bonus.hp}만큼 더 붙잡는다.`
  if (bonus.rareRewardBonus) return '더 희귀한 보상을 마주칠 가능성이 열린다.'
  if (bonus.unlockCoreClue) return '미궁의 핵으로 향하는 단서를 감지할 수 있게 된다.'
  if (bonus.maxMp) return `새 육체를 붙잡을 때 최대 MP가 ${bonus.maxMp} 증가한다.`
  return '영혼에 잠든 특수 능력을 해제한다.'
}

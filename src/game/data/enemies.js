export const enemyTemplates = {
  'starving-wolf': {
    id: 'starving-wolf',
    name: '굶주린 늑대',
    textureKey: 'enemy-wolf',
    maxHp: 24,
    attack: 6,
    pattern: [
      { type: 'attack', value: 6, label: '물어뜯기' },
      { type: 'attack', value: 8, label: '달려들기' },
      { type: 'block', value: 5, label: '몸 낮추기' },
    ],
    rewards: { gold: [8, 14], memoryShards: [0, 1] },
  },
  'ash-imp': {
    id: 'ash-imp',
    name: '잿불 임프',
    textureKey: 'enemy-imp',
    maxHp: 20,
    attack: 5,
    pattern: [
      { type: 'attack', value: 5, label: '불씨 던지기' },
      { type: 'buff', value: 2, label: '불길 키우기' },
      { type: 'attack', value: 7, label: '타오르는 손톱' },
    ],
    rewards: { gold: [7, 13], memoryShards: [0, 1] },
  },
  'bone-rat': {
    id: 'bone-rat',
    name: '뼈쥐',
    textureKey: 'enemy-rat',
    maxHp: 18,
    attack: 4,
    pattern: [
      { type: 'attack', value: 4, label: '발목 물기' },
      { type: 'block', value: 4, label: '뼈 웅크리기' },
      { type: 'attack', value: 6, label: '뼈 파편' },
    ],
    rewards: { gold: [6, 12], memoryShards: [0, 1] },
  },
  'hollow-guard': {
    id: 'hollow-guard',
    name: '공허한 간수',
    textureKey: 'enemy-guard',
    maxHp: 34,
    attack: 8,
    pattern: [
      { type: 'attack', value: 8, label: '녹슨 할버드' },
      { type: 'block', value: 8, label: '철문 자세' },
      { type: 'attack', value: 10, label: '압박' },
    ],
    rewards: { gold: [12, 18], memoryShards: [1, 2] },
  },
  'ghost-of-regret': {
    id: 'ghost-of-regret',
    name: '후회의 망령',
    textureKey: 'enemy-regret',
    maxHp: 28,
    attack: 7,
    pattern: [
      { type: 'buff', value: 2, label: '원한 증폭' },
      { type: 'attack', value: 8, label: '저주의 주문' },
      { type: 'attack', value: 10, label: '죽음 영창' },
    ],
    rewards: { gold: [11, 17], memoryShards: [1, 2] },
  },
  'chain-wraith': {
    id: 'chain-wraith',
    name: '사슬 망령',
    textureKey: 'enemy-wraith',
    maxHp: 30,
    attack: 8,
    pattern: [
      { type: 'attack', value: 7, label: '사슬 휘감기' },
      { type: 'buff', value: 2, label: '원한 증폭' },
      { type: 'block', value: 7, label: '쇠사슬 장막' },
    ],
    rewards: { gold: [10, 18], memoryShards: [1, 2] },
  },
  'dark-knight': {
    id: 'dark-knight',
    name: '검은 기사',
    textureKey: 'enemy-knight',
    maxHp: 42,
    attack: 10,
    pattern: [
      { type: 'block', value: 10, label: '무광의 방패' },
      { type: 'attack', value: 11, label: '어두운 검격' },
      { type: 'attack', value: 13, label: '처형 자세' },
    ],
    rewards: { gold: [18, 26], memoryShards: [2, 3] },
  },
  'time-leech': {
    id: 'time-leech',
    name: '시간 거머리',
    textureKey: 'enemy-leech',
    maxHp: 36,
    attack: 9,
    pattern: [
      { type: 'attack', value: 9, label: '시간 흡혈' },
      { type: 'buff', value: 3, label: '죽은 초식' },
      { type: 'attack', value: 12, label: '기억 빨아들이기' },
    ],
    rewards: { gold: [16, 24], memoryShards: [2, 3] },
  },
  'soul-hound': {
    id: 'soul-hound',
    name: '영혼 사냥개',
    textureKey: 'enemy-hound',
    maxHp: 38,
    attack: 10,
    pattern: [
      { type: 'attack', value: 10, label: '영혼 돌진' },
      { type: 'attack', value: 12, label: '목덜미 물기' },
      { type: 'block', value: 9, label: '균열 속 숨기' },
    ],
    rewards: { gold: [17, 25], memoryShards: [2, 3] },
  },
  'pit-mummy': {
    id: 'pit-mummy',
    name: '구덩이의 미라',
    textureKey: 'enemy-guard',
    maxHp: 34,
    attack: 7,
    pattern: [
      { type: 'attack', value: 7, label: '붕대 채찍' },
      { type: 'block', value: 6, label: '눌러앉기' },
      { type: 'attack', value: 9, label: '사지 늘이기' },
    ],
    rewards: { gold: [0, 0], memoryShards: [0, 0] },
  },
}

export const bossTemplates = {
  'corpse-butcher': {
    id: 'corpse-butcher',
    name: '시체더미 도살자',
    textureKey: 'enemy-guard',
    maxHp: 54,
    attack: 9,
    pattern: [
      { type: 'attack', value: 10, label: '무더기 내려찍기' },
      { type: 'block', value: 10, label: '시체 방패' },
      { type: 'buff', value: 3, label: '도살자의 숨' },
    ],
    rewards: { gold: [28, 36], memoryShards: [3, 5] },
    memoryId: 'boss-corpse-butcher',
  },
  'mirror-jailer': {
    id: 'mirror-jailer',
    name: '거울 감옥의 간수',
    textureKey: 'enemy-wraith',
    maxHp: 68,
    attack: 12,
    pattern: [
      { type: 'block', value: 12, label: '반사 감옥' },
      { type: 'attack', value: 13, label: '깨진 얼굴' },
      { type: 'buff', value: 3, label: '형벌 기록' },
    ],
    rewards: { gold: [36, 48], memoryShards: [5, 7] },
    memoryId: 'boss-mirror-jailer',
  },
  'surface-warden': {
    id: 'surface-warden',
    name: '지상문 앞의 문지기',
    textureKey: 'enemy-knight',
    maxHp: 84,
    attack: 14,
    pattern: [
      { type: 'attack', value: 15, label: '막아서는 검' },
      { type: 'block', value: 14, label: '닫힌 문' },
      { type: 'buff', value: 4, label: '루프의 기억' },
    ],
    rewards: { gold: [50, 70], memoryShards: [8, 10], coreShards: [1, 1] },
    memoryId: 'surface-warden',
  },
}

export function createEnemy(depthOrContext) {
  const context = typeof depthOrContext === 'number' ? { totalDepth: depthOrContext } : depthOrContext
  const pool = context.enemyPool ?? Object.keys(enemyTemplates)
  const enemyId = context.enemyId ?? pool[Math.floor(Math.random() * pool.length)]
  const template = enemyTemplates[enemyId] ?? enemyTemplates['starving-wolf']
  const hpBonus = Math.floor((context.totalDepth ?? 1) * 1.5) + (context.difficulty?.hp ?? 0)

  return {
    ...template,
    hp: template.maxHp + hpBonus,
    maxHp: template.maxHp + hpBonus,
    attack: template.attack + Math.floor((context.totalDepth ?? 1) / 3) + (context.difficulty?.attack ?? 0),
    block: 0,
    turn: 0,
    isBoss: false,
  }
}

export function createBossEnemy(context) {
  const template = bossTemplates[context.bossId] ?? bossTemplates['corpse-butcher']
  return {
    ...template,
    hp: template.maxHp + (context.difficulty?.hp ?? 0),
    maxHp: template.maxHp + (context.difficulty?.hp ?? 0),
    attack: template.attack + (context.difficulty?.attack ?? 0),
    block: 0,
    turn: 0,
    isBoss: true,
  }
}

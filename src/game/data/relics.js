/**
 * 유물 카탈로그
 * - description: 게임 효과 (기능 설명)
 * - flavorLine: 획득 모달 대사 (기능 설명 금지, 선택)
 * - icon: 획득 모달 이모지 (선택, iconImage 없을 때)
 * - iconImage: relicAssets.js 키 (PNG 아이콘)
 * - shopSellable: true면 상점 유물 풀에 포함
 * - persistentOwned: true면 한 번 획득 시 영구 보유 목록에 남김 (향후 메타 확장용)
 */
export const relics = [
  {
    id: 'black-thorn',
    name: '검은 가시',
    description: '공격할 때마다 추가 피해 +1',
    flavorLine: '가시는 주인을 가리지 않는다.',
    iconImage: 'black-thorn',
    hooks: ['onAttack'],
  },
  {
    id: 'broken-shield-fragment',
    name: '깨진 방패 파편',
    description: '방어할 때 MP를 1 회복한다.',
    flavorLine: '손 쓸 방법이 없어보이지만 희미한 마력이 느껴진다.',
    iconImage: 'broken-shield-fragment',
    hooks: ['onDefend'],
  },
  {
    id: 'old-shield',
    name: '오래된 방패',
    description: '방어도 +1',
    flavorLine: '군데군데 금이 가 있지만, 고칠 수도 있을 것 같아 보인다.',
    iconImage: 'old-shield',
    hooks: ['stat'],
  },
  {
    id: 'old-armor',
    name: '오래된 갑옷',
    description: '방어도 +1',
    flavorLine: '빈 갑옷 안의 숨소리는 아직 멈추지 않았다.',
    iconImage: 'old-armor',
    hooks: ['stat'],
  },
  // {
  //   id: 'mist-step',
  //   name: '안개 발걸음',
  //   description: '전투 시작 시 기습할 확률이 오른다.',
  //   flavorLine: '발소리보다 먼저 어둠이 온다.',
  //   icon: '🌫️',
  //   hooks: ['onBattleStart'],
  // },
  {
    id: 'wardens-mark',
    name: '문지기의 표식',
    description: '문지기 관련 선택지를 해금한다.',
    flavorLine: '문 앞에서만 진실이 말을 건넨다.',
    iconImage: 'wardens-mark',
    hooks: ['storyFlag'],
  },
  {
    id: 'broken-clock',
    name: '깨진 시계',
    description: '적의 첫 턴을 늦출 가능성이 생긴다.',
    flavorLine: '시간은 멈추지 않았다. 다만 네 쪽에서만 늦을 뿐이다.',
    iconImage: 'broken-clock',
    shopSellable: true,
    hooks: ['onBattleStart'],
  },
  {
    id: 'bone-dice',
    name: '뼈 주사위',
    description: '전투 보상 골드가 조금 증가한다.',
    flavorLine: '주사위는 거짓말을 하지 않는다.',
    iconImage: 'bone-dice',
    shopSellable: true,
    hooks: ['onReward'],
  },
  {
    id: 'warm-ember',
    name: '온기 남은 잿불',
    description: '휴식 시 MP도 회복한다.',
    flavorLine: '이 온기는 아직 누군가의 것이다.',
    iconImage: 'warm-ember',
    hooks: ['onRest'],
    persistentOwned: true,
  },
  {
    id: 'glass-eye',
    name: '유리 눈',
    description: '이벤트 선택지의 위험을 더 잘 감지한다.',
    iconImage: 'glass-eye',
    hooks: ['onEvent'],
  },
  {
    id: 'rusted-key',
    name: '녹슨 열쇠',
    description: '어디에 맞는지 알 수 없는 녹슨 열쇠다.',
    iconImage: 'rusted-key',
    hooks: ['onEvent'],
  },
  {
    id: 'merchant-mark',
    name: '상인의 표식',
    description: '상점 가격이 30% 할인됩니다.',
    flavorLine: '다음에 올 때 나에게 보여주라고.',
    iconImage: 'merchant-mark',
    shopSellable: true,
    hooks: ['onShop'],
  },
  {
    id: 'hard-bread',
    name: '딱딱한 빵',
    description: '휴식 시 HP를 8 회복한다.',
    flavorLine: '... 먹어도 되는거야?',
    iconImage: 'hard-bread',
    shopSellable: true,
    hooks: ['onRest'],
  },
  {
    id: 'broken-cross',
    name: '깨진 십자가',
    description: '죽음 후 영혼의 흔적 1개를 더 남긴다.',
    flavorLine: '잘못된 믿음은 깨지기 마련이다.',
    icon: '✝️',
    hooks: ['onRunEnd'],
  },
  {
    id: 'nameless-prayer',
    name: '이름 없는 기도문',
    description: '죽음 뒤 남는 영혼의 흔적이 증가한다.',
    flavorLine: '기도의 끝에는 이름이 없다.',
    iconImage: 'nameless-prayer',
    hooks: ['onRunEnd'],
  },
  {
    id: 'red-thread',
    name: '붉은 실',
    description: '최대 HP가 3 증가한다.',
    hooks: ['stat'],
  },
  {
    id: 'blue-thread',
    name: '푸른 실',
    description: '최대 MP가 1 증가한다.',
    flavorLine: '실이 끊어지기 전까지는 붙잡을 수 있다.',
    icon: '🧵',
    hooks: ['stat'],
  },
  {
    id: 'ashen-crown',
    name: '재의 왕관',
    description: '보스에게 주는 피해가 증가한다.',
    flavorLine: '왕관은 재가 되어도 무게를 잃지 않는다.',
    iconImage: 'ashen-crown',
    hooks: ['onAttack'],
  },
  {
    id: 'corpse-map',
    name: '시체의 지도',
    description: '같은 방 타입 반복 확률을 낮춘다.',
    hooks: ['onRoomGen'],
  },
  {
    id: 'mummy-linen',
    name: '미라의 붕대',
    description: '방어할 때 HP를 1 회복한다.',
    flavorLine: '잠든 자의 온기가 아직 남아 있다.',
    icon: '🩹',
    hooks: ['onDefend'],
  },
  {
    id: 'sealed-name',
    name: '봉인된 이름의 기억',
    description: '중심부 루트의 기억 조건 일부를 대신한다.',
    flavorLine: '이름을 아는 것과 이름을 부르는 것은 다르다.',
    iconImage: 'sealed-name',
    hooks: ['storyFlag'],
  },
  {
    id: 'butcher-knife',
    name: '도살자의 칼날',
    description: '공격할 때마다 추가 피해 +1',
    flavorLine: '칼날은 주인을 기억한다.',
    icon: '🔪',
    bossDrop: 'corpse-butcher',
    hooks: ['onAttack'],
  },
  {
    id: 'corpse-sack',
    name: '시체 자루',
    description: '휴식 시 HP를 5 더 회복한다.',
    flavorLine: '무거운 자루, 가벼운 숨.',
    icon: '🎒',
    bossDrop: 'corpse-butcher',
    hooks: ['onRest'],
  },
  {
    id: 'mirror-fragment',
    name: '거울 조각',
    description: '방어할 때 MP를 1 회복한다.',
    flavorLine: '거울은 맞은 방향을 기억한다.',
    icon: '🪞',
    bossDrop: 'mirror-jailer',
    hooks: ['onDefend'],
  },
  {
    id: 'jailer-whisper',
    name: '간수의 속삭임',
    description: '전투 시작 시 기습할 확률이 오른다.',
    flavorLine: '발소리보다 먼저 쇠사슬이 울린다.',
    icon: '⛓️',
    bossDrop: 'mirror-jailer',
    hooks: ['onBattleStart'],
  },
  {
    id: 'warden-gavel',
    name: '문지기의 철퇴',
    description: '보스에게 주는 피해가 +1',
    flavorLine: '문 앞에서만 무게가 실린다.',
    icon: '🔨',
    bossDrop: 'surface-warden',
    hooks: ['onAttack'],
  },
  {
    id: 'loop-fragment',
    name: '루프의 파편',
    description: '적 첫 턴을 늦출 확률이 생긴다.',
    flavorLine: '같은 순간이 조금 늦게 돌아온다.',
    icon: '⌛',
    bossDrop: 'surface-warden',
    hooks: ['onBattleStart'],
  },
]

/** 영구 보유 예시 ID (메타/디스커버리 연동용, 비어 있어도 됨) */
export const persistentOwnedRelicIds = relics.filter((r) => r.persistentOwned).map((r) => r.id)

export function getRelicById(id) {
  return relics.find((relic) => relic.id === id) ?? relics[0]
}

export function getShopSellableRelics() {
  return relics.filter((relic) => relic.shopSellable)
}

export function hasRelicFlavorLine(relic) {
  return Boolean(relic?.flavorLine?.trim())
}

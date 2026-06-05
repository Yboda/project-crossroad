/**
 * 층별 상인 정의.
 * 상점 방(room.type === 'shop')은 층마다 이 데이터를 사용한다.
 */
export const floorMerchants = {
  'corpse-pit': {
    id: 'merchant-1f',
    title: '얼굴 없는 상인',
    label: '얼굴 없는 상인',
    backgroundKey: 'background-1f-merchant',
    entryStory: [
      '낡은 천과 녹슨 상자 사이, 얼굴 없는 상인이 당신을 기다리고 있다. 후드 아래에는 얼굴 대신 빈 공기만 있다.',
      '지금 당신의 골드는 {gold}이다. 상자 안 물건들은 말없이 가격을 기다린다.',
    ],
    talkDetail: '그는 시체더미의 상술꾼처럼 보인다.',
    talkResponse: [
      '"여기서 사는 것은 물건이 아니라 시간이야."',
      '상인은 더 말하지 않고 빈 얼굴을 숙인다.',
    ],
    shopScreenStory: ['후드 아래의 빈 얼굴이 고개를 기울인다. 녹슨 손잡이의 상자들이 당신을 기다린다.'],
    potionIds: ['potion', 'ether'],
    relicPool: ['broken-clock', 'bone-dice', 'merchant-mark', 'hard-bread'],
    relicCount: 4,
  },
  'echo-prison': {
    id: 'merchant-2f',
    title: '메아리의 상인',
    label: '메아리의 상인',
    backgroundKey: 'background-basic',
    entryStory: [
      '감옥 벽 사이 좁은 틈에 상인이 앉아 있다. 후드 속에서는 누군가의 메아리만 되살아난다.',
      '지금 당신의 골드는 {gold}이다. 쇠사슬 소리와 함께 가격표가 흔들린다.',
    ],
    talkDetail: '그의 목소리는 벽 너머에서 두 번 울린다.',
    talkResponse: [
      '"감옥은 가둔다고 생각하지. 사실은 되풀이를 판매하지."',
      '상인은 말을 끊고, 메아리만 남긴 채 고개를 숙인다.',
    ],
    shopScreenStory: ['좁은 틈 너머 상인이 손짓한다. 물건들은 메아리처럼 조용히 당신을 부른다.'],
    potionIds: ['potion', 'ether'],
    relicPool: ['broken-clock', 'merchant-mark', 'hard-bread', 'bone-dice'],
    relicCount: 4,
  },
  'false-sky': {
    id: 'merchant-3f',
    title: '문지기의 상인',
    label: '문지기의 상인',
    backgroundKey: 'background-basic',
    entryStory: [
      '하늘문 아래 서 있는 상인은 그림자가 없다. 후드 속 얼굴도, 발밑 그림자도 비어 있다.',
      '지금 당신의 골드는 {gold}이다. 문지기의 표식이 새겨진 물건들이 가격을 기다린다.',
    ],
    talkDetail: '그는 문 앞에서만 물건을 판다고 말하지 않는다.',
    talkResponse: [
      '"오르는 자에게 필요한 것은 무기가 아니라 증거야."',
      '상인은 더 이상 말하지 않고, 빈 얼굴을 하늘문 쪽으로 돌린다.',
    ],
    shopScreenStory: ['그림자 없는 상인이 물건을 가리킨다. 각 유물에는 문지기의 흔적이 남아 있다.'],
    potionIds: ['potion', 'ether'],
    relicPool: ['merchant-mark', 'broken-clock', 'hard-bread', 'bone-dice'],
    relicCount: 4,
  },
}

export function getFloorMerchant(floorId) {
  return floorMerchants[floorId] ?? floorMerchants['corpse-pit']
}

export function formatMerchantStory(lines, context = {}) {
  return lines.map((line) =>
    String(line).replace(/\{gold\}/g, String(context.gold ?? 0)),
  )
}

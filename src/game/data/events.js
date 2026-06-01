export const events = [
  {
    id: 'old-altar',
    title: '낡은 제단',
    story: ['허물어진 돌기둥 사이, 검은 촛불이 꺼지지 않고 타오른다.'],
    options: [
      { id: 'pray', label: '기도한다.', detail: 'HP를 잃고 영혼의 흔적을 얻는다.', result: { hp: -5, memoryShards: 2 } },
      { id: 'take-ember', label: '촛불을 챙긴다.', detail: '유물을 얻는다.', result: { relic: 'warm-ember' } },
      { id: 'leave', label: '건드리지 않는다.', detail: '그냥 지나간다.', result: {} },
    ],
  },
  {
    id: 'hand-in-corpses',
    title: '시체더미 속 손',
    story: ['쌓인 시체 사이에서 아직 따뜻한 손 하나가 당신의 발목을 붙든다.'],
    options: [
      { id: 'pull', label: '손을 끌어올린다.', detail: '피해를 받고 골드를 얻는다.', result: { hp: -4, gold: 18 } },
      { id: 'listen', label: '그 손의 기억을 듣는다.', detail: '영혼의 흔적을 얻는다.', result: { memoryShards: 2 } },
      { id: 'cut', label: '손을 끊고 지나간다.', detail: '전투 기습 가능성이 생긴다.', result: { stealth: true } },
    ],
  },
  {
    id: 'backward-well',
    title: '거꾸로 흐르는 우물',
    story: ['우물 속 물방울이 아래에서 위로 떨어진다. 수면에는 모르는 얼굴이 비친다.'],
    options: [
      { id: 'drink', label: '물을 마신다.', detail: 'HP와 MP를 회복한다.', result: { hp: 8, mp: 2 } },
      { id: 'drop-gold', label: '골드를 던진다.', detail: '골드 10 소모, 영혼의 흔적 획득.', result: { gold: -10, memoryShards: 3 } },
      { id: 'ignore', label: '눈을 돌린다.', detail: '아무 일도 일어나지 않는다.', result: {} },
    ],
  },
  {
    id: 'faceless-merchant',
    title: '얼굴 없는 상인',
    story: ['상인은 얼굴 없는 후드를 숙이고, 당신이 아직 사지 않은 물건의 가격을 말한다.'],
    options: [
      { id: 'buy-map', label: '시체의 지도를 산다.', detail: '골드 22 소모.', result: { gold: -22, relic: 'corpse-map' } },
      { id: 'ask', label: '그의 정체를 묻는다.', detail: '문지기의 표식이 필요하다.', lockedByRelic: 'wardens-mark', result: { memoryShards: 4 } },
      { id: 'leave', label: '떠난다.', detail: '상인의 시선을 등진다.', result: {} },
    ],
  },
  {
    id: 'memory-door',
    title: '기억을 묻는 문',
    story: ['문에는 손잡이가 없다. 대신 "너는 누구였나"라는 문장만 새겨져 있다.'],
    options: [
      { id: 'answer', label: '이름을 말한다.', detail: '봉인된 이름 필요.', lockedByRelic: 'sealed-name', result: { coreShards: 1 } },
      { id: 'bleed', label: '피로 답한다.', detail: 'HP를 잃고 영혼의 흔적을 얻는다.', result: { hp: -7, memoryShards: 4 } },
      { id: 'pass', label: '문을 피해 간다.', detail: '아무 일도 일어나지 않는다.', result: {} },
    ],
  },
  {
    id: 'endless-campfire',
    title: '꺼지지 않는 모닥불',
    story: ['모닥불 주변에는 여러 명이 앉아 있었던 자국이 있다. 모두 당신의 체온과 닮아 있다.'],
    options: [
      { id: 'rest', label: '잠시 쉰다.', detail: 'HP를 회복한다.', result: { hp: 10 } },
      { id: 'stare', label: '불꽃을 바라본다.', detail: 'MP를 회복한다.', result: { mp: 3 } },
      { id: 'scatter', label: '불씨를 흩는다.', detail: '골드를 얻는다.', result: { gold: 12 } },
    ],
  },
  {
    id: 'broken-mirror',
    title: '부서진 거울',
    story: ['거울 조각마다 다른 방향으로 도망치는 당신이 비친다.'],
    options: [
      { id: 'touch', label: '거울을 만진다.', detail: '유리를 삼킨 기억을 얻는다.', result: { relic: 'glass-eye' } },
      { id: 'break', label: '완전히 부순다.', detail: '피해를 받고 골드를 얻는다.', result: { hp: -3, gold: 16 } },
      { id: 'avoid', label: '비친 얼굴을 외면한다.', detail: '지나간다.', result: {} },
    ],
  },
  {
    id: 'crying-armor',
    title: '울고 있는 갑옷',
    story: ['빈 갑옷 안에서 아이의 울음소리가 난다. 가까이 가자 울음이 멎는다.'],
    options: [
      { id: 'comfort', label: '갑옷에 손을 얹는다.', detail: '방어력이 오른다.', result: { defense: 1 } },
      { id: 'rob', label: '갑옷 조각을 떼어낸다.', detail: '유물을 얻지만 HP를 잃는다.', result: { hp: -5, relic: 'old-shield-fragment' } },
      { id: 'leave', label: '그냥 둔다.', detail: '무언가가 당신을 배웅한다.', result: { mp: 1 } },
    ],
  },
  {
    id: 'mist-corridor',
    title: '안개 낀 통로',
    story: ['안개 속에서 발소리가 한 박자 늦게 따라온다.'],
    options: [
      { id: 'hide', label: '숨죽여 걷는다.', detail: '다음 전투에서 기습한다.', result: { stealth: true } },
      { id: 'run', label: '뛰어간다.', detail: '피해를 받고 골드를 발견한다.', result: { hp: -4, gold: 20 } },
      { id: 'listen', label: '발소리를 기다린다.', detail: '영혼의 흔적을 얻는다.', result: { memoryShards: 2 } },
    ],
  },
  {
    id: 'wardens-mark',
    title: '문지기의 낡은 표식',
    story: ['벽에는 칼끝으로 새긴 표식이 있다. "문은 출구가 아니다."'],
    options: [
      { id: 'take', label: '표식을 떼어낸다.', detail: '문지기의 표식 유물을 얻는다.', result: { relic: 'wardens-mark' } },
      { id: 'memorize', label: '문장을 외운다.', detail: '영혼의 흔적을 얻는다.', result: { memoryShards: 3 } },
      { id: 'deny', label: '믿지 않는다.', detail: '가짜 출구를 향한 충동이 강해진다.', result: { gold: 8 } },
    ],
  },
]

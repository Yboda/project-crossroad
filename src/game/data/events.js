export const events = [
  {
    id: 'old-altar',
    title: '낡은 제단',
    story: [
      '허물어진 돌기둥 사이, 검은 촛불이 꺼지지 않고 타오른다. 공기는 오래된 재 냄새로 무겁다.',
      '제단 위에는 아무도 남기지 않은 제물 자국만 남아 있다. 손을 뻗으면 대가 없는 선물은 없을 것이다.',
    ],
    options: [
      { id: 'pray', label: '기도한다.', detail: 'HP를 잃고 영혼의 흔적을 얻는다.', result: { hp: -5, memoryShards: 2 } },
      { id: 'take-ember', label: '촛불을 챙긴다.', detail: '유물을 얻는다.', result: { relic: 'warm-ember' } },
      { id: 'leave', label: '건드리지 않는다.', detail: '그냥 지나간다.', result: {} },
    ],
  },
  {
    id: 'hand-in-corpses',
    title: '시체더미 속 손',
    story: [
      '쌓인 시체 사이에서 아직 따뜻한 손 하나가 당신의 발목을 붙든다. 심장 박동이 느리게 전해진다.',
      '끌어올리면 무언가를 얻을지, 끊고 지나가면 기억만 남을지—선택은 당신의 손에 달려 있다.',
    ],
    options: [
      { id: 'pull', label: '손을 끌어올린다.', detail: '피해를 받고 골드를 얻는다.', result: { hp: -4, gold: 18 } },
      { id: 'listen', label: '그 손의 기억을 듣는다.', detail: '영혼의 흔적을 얻는다.', result: { memoryShards: 2 } },
      { id: 'cut', label: '손을 끊고 지나간다.', detail: '전투 기습 가능성이 생긴다.', result: { stealth: true } },
    ],
  },
  {
    id: 'backward-well',
    title: '거꾸로 흐르는 우물',
    story: [
      '우물 속 물방울이 아래에서 위로 떨어진다. 수면에는 모르는 얼굴이 희미하게 비친다.',
      '마시면 회복할지, 골드를 던지면 다른 대가를 받을지—우물은 답을 강요하지 않는다.',
    ],
    options: [
      { id: 'drink', label: '물을 마신다.', detail: 'HP와 MP를 회복한다.', result: { hp: 8, mp: 2 } },
      { id: 'drop-gold', label: '골드를 던진다.', detail: '골드 10 소모, 영혼의 흔적 획득.', result: { gold: -10, memoryShards: 3 } },
      { id: 'ignore', label: '눈을 돌린다.', detail: '아무 일도 일어나지 않는다.', result: {} },
    ],
  },
  {
    id: 'faceless-merchant',
    title: '얼굴 없는 상인',
    story: [
      '상인은 얼굴 없는 후드를 숙이고, 당신이 아직 사지 않은 물건의 가격을 말한다.',
      '그의 목소리에는 감정이 없다. 다만, 모든 문장 끝에 작은 웃음소리가 붙는다.',
    ],
    options: [
      { id: 'buy-map', label: '시체의 지도를 산다.', detail: '골드 22 소모.', result: { gold: -22, relic: 'corpse-map' } },
      { id: 'ask', label: '그의 정체를 묻는다.', detail: '문지기의 표식이 필요하다.', lockedByRelic: 'wardens-mark', result: { memoryShards: 4 } },
      { id: 'leave', label: '떠난다.', detail: '상인의 시선을 등진다.', result: {} },
    ],
  },
  {
    id: 'memory-door',
    title: '기억을 묻는 문',
    story: [
      '문에는 손잡이가 없다. 대신 "너는 누구였나"라는 문장만 새겨져 있다.',
      '문장 아래에는 수많은 손톱 자국이 겹쳐 있다. 누군가는 답을 남기려 했고, 누군가는 포기했다.',
    ],
    options: [
      { id: 'answer', label: '이름을 말한다.', detail: '봉인된 이름 필요.', lockedByRelic: 'sealed-name', result: { coreShards: 1 } },
      { id: 'bleed', label: '피로 답한다.', detail: 'HP를 잃고 영혼의 흔적을 얻는다.', result: { hp: -7, memoryShards: 4 } },
      { id: 'pass', label: '문을 피해 간다.', detail: '아무 일도 일어나지 않는다.', result: {} },
    ],
  },
  {
    id: 'endless-campfire',
    title: '꺼지지 않는 모닥불',
    story: [
      '모닥불 주변에는 여러 명이 앉아 있었던 자국이 있다. 모두 당신의 체온과 닮아 있다.',
      '불꽃은 꺼지지 않는다. 마치 누군가가 영원히 돌아오기를 기다리는 것처럼.',
    ],
    options: [
      { id: 'rest', label: '잠시 쉰다.', detail: 'HP를 회복한다.', result: { hp: 10 } },
      { id: 'stare', label: '불꽃을 바라본다.', detail: 'MP를 회복한다.', result: { mp: 3 } },
      { id: 'scatter', label: '불씨를 흩는다.', detail: '골드를 얻는다.', result: { gold: 12 } },
    ],
  },
  {
    id: 'broken-mirror',
    title: '부서진 거울',
    story: [
      '거울 조각마다 다른 방향으로 도망치는 당신이 비친다. 어느 조각도 같은 얼굴을 보여주지 않는다.',
      '거울을 만지면 기억을 얻을지, 부수면 대가를 치를지—모든 선택은 반사된다.',
    ],
    options: [
      { id: 'touch', label: '거울을 만진다.', detail: '유리를 삼킨 기억을 얻는다.', result: { relic: 'glass-eye' } },
      { id: 'break', label: '완전히 부순다.', detail: '피해를 받고 골드를 얻는다.', result: { hp: -3, gold: 16 } },
      { id: 'avoid', label: '비친 얼굴을 외면한다.', detail: '지나간다.', result: {} },
    ],
  },
  {
    id: 'crying-armor',
    title: '울고 있는 갑옷',
    story: [
      '빈 갑옷 안에서 아이의 울음소리가 난다. 가까이 가자 울음이 멎고, 금속 안쪽에서 숨소리만 남는다.',
      '갑옷 표면에는 오래된 피가 말라 붙어 있다. 누군가의 마지막 방어였을지도 모른다.',
    ],
    options: [
      { id: 'comfort', label: '갑옷에 손을 얹는다.', detail: '방어력이 오른다.', result: { defense: 1 } },
      { id: 'rob', label: '갑옷 조각을 떼어낸다.', detail: '유물을 얻지만 HP를 잃는다.', result: { hp: -5, relic: 'old-shield-fragment' } },
      { id: 'leave', label: '그냥 둔다.', detail: '무언가가 당신을 배웅한다.', result: { mp: 1 } },
    ],
  },
  {
    id: 'mist-corridor',
    title: '안개 낀 통로',
    story: [
      '안개 속에서 발소리가 한 박자 늦게 따라온다. 당신이 멈추면, 그것도 멈춘다.',
      '안개 너머의 형체는 분명하지 않다. 다만, 돌아갈 길은 이미 사라져 있다.',
    ],
    options: [
      { id: 'hide', label: '숨죽여 걷는다.', detail: '다음 전투에서 기습한다.', result: { stealth: true } },
      { id: 'run', label: '뛰어간다.', detail: '피해를 받고 골드를 발견한다.', result: { hp: -4, gold: 20 } },
      { id: 'listen', label: '발소리를 기다린다.', detail: '영혼의 흔적을 얻는다.', result: { memoryShards: 2 } },
    ],
  },
  {
    id: 'black-thorn-wall',
    title: '가시 돋친 벽',
    story: [
      '좁은 통로 한쪽 벽면 전체가 식물로 뒤덮여 있다. 줄기는 돌 틈을 타고 위로 기어 올라가고, 잎사귀는 습기를 머금은 채 검게 젖어 있다.',
      '가까이 다가가 보니 잎마다, 줄기마다 검은 가시가 촘촘히 돋아 있다. 가시 끝에서는 말라 있는 피 자국이 스며 나온다. 손을 대기 전에 무엇을 자를지 정해야 한다.',
    ],
    options: [
      {
        id: 'cut-thorns',
        label: '가시를 자른다.',
        detail: 'HP 10을 잃고 검은 가시 유물을 얻는다.',
        result: { hp: -10, relic: 'black-thorn' },
      },
      {
        id: 'cut-greens',
        label: '줄기와 잎을 자른다.',
        detail: '식물을 이용해 HP 10을 회복한다.',
        result: { hp: 10 },
      },
      {
        id: 'slip-past',
        label: '피해서 지나간다.',
        detail: '가시에 닿지 않고 통로를 빠져나간다.',
        result: {},
      },
    ],
  },
  {
    id: 'wardens-mark',
    title: '문지기의 낡은 표식',
    story: [
      '벽에는 칼끝으로 새긴 표식이 있다. "문은 출구가 아니다."',
      '표식 주변의 돌은 다른 곳보다 차갑다. 마치 오래전부터 이 문장을 지키고 있었던 것처럼.',
    ],
    options: [
      { id: 'take', label: '표식을 떼어낸다.', detail: '문지기의 표식 유물을 얻는다.', result: { relic: 'wardens-mark' } },
      { id: 'memorize', label: '문장을 외운다.', detail: '영혼의 흔적을 얻는다.', result: { memoryShards: 3 } },
      { id: 'deny', label: '믿지 않는다.', detail: '가짜 출구를 향한 충동이 강해진다.', result: { gold: 8 } },
    ],
  },
]

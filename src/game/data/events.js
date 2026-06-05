export const events = [
  {
    id: '1f-corpse-pit',
    title: '시체 구덩이',
    backgroundKey: 'background-1f-corpse-pit',
    story: [
      '구덩이처럼 아래로 파인 공간을 둘러싸고 수없는 시체와 뼈가 굴러다니고 있다.',
      '중앙에는 시체인지 모를 무언가 서 있다. 당연하게도 이 공간에는 영혼의 흔적이 가득 차 있다.',
    ],
    options: [
      {
        id: 'descend',
        label: '구덩이 아래로 내려가본다.',
        detail: '중앙의 형체가 당신을 기다리고 있다.',
        result: { stage: 'inside' },
      },
      { id: 'leave', label: '모른척 떠난다.', detail: '구덩이의 시선을 등진다.', result: {} },
    ],
    stages: {
      inside: {
        backgroundKey: 'background-1f-inside-corpse-pit',
        story: [
          '아래는 위에서 본 것보다 훨씬 넓다. 뼈와 붕대 조각이 발밑을 미끄럽게 만든다.',
          '중앙에 선 형체는 가죽 같은 래핑을 두른 미라다. 건조한 공기 속에서 낡은 천이 바스락거린다.',
        ],
        options: [
          {
            id: 'approach',
            label: '미라에게 말을 건넨다.',
            detail: '잠든 자의 눈이 천천히 당신을 향한다.',
            result: { dialogue: 'mummy-1' },
          },
        ],
      },
    },
    dialogues: {
      'mummy-1': {
        story: [
          '미라의 목 안에서 마른 숨이 새어 나온다.',
          '"...누구냐... 여기는... 잠든 자들의... 무덤이다..."',
          '누더기 사이로 희미한 빛이 스며 나온다. 당신의 말투에 따라 반응이 달라질 것 같다.',
        ],
        options: [
          {
            id: 'gentle',
            label: '조용히 말을 건넨다.',
            detail: '영혼을 놀라게 하지 않으려 한다.',
            result: { dialogue: 'mummy-2-gentle' },
          },
          {
            id: 'aggressive',
            label: '위협하며 답을 요구한다.',
            detail: '붕대 속 형체가 경계한다.',
            result: { dialogue: 'mummy-2-aggressive' },
          },
        ],
      },
      'mummy-2-gentle': {
        story: [
          '미라가 잠시 멈춘다. 구덩이 위의 뼈 소리마저 잦아든다.',
          '"...그 말투라면... 잔향이... 너를 밀어내지 않는다..."',
          '공기 속 영혼의 흔적이 옅은 빛으로 흔들린다. 어떻게 달래줄지 결정해야 한다.',
        ],
        options: [
          {
            id: 'soothe',
            label: '영혼을 달래준다.',
            detail: '잔향을 조용히 가라앉힌다.',
            result: {
              memoryShards: 5,
              epilogue: [
                '미라가 고개를 숙인다. 구덩이의 영혼들이 천천히 잠으로 돌아간다.',
                '당신은 충분한 잔향을 건져 올리고, 뒤돌아 구덩이를 빠져나왔다.',
              ],
            },
          },
          {
            id: 'pray',
            label: '짧은 기도를 올린다.',
            detail: '말 없이 잠든 자들을 기억한다.',
            result: {
              memoryShards: 3,
              epilogue: [
                '기도가 끝나자 구덩이가 조금 가벼워진다.',
                '미라는 다시 움직이지 않았고, 당신은 잔향만 남기고 떠났다.',
              ],
            },
          },
        ],
      },
      'mummy-2-aggressive': {
        story: [
          '붕대가 팽팽하게 조여진다. 미라의 눈에서 붉은 빛이 번뜩인다.',
          '"...침입자... 잠을... 깨운 자..."',
          '뼈와 붕대가 바스락이며, 대화가 곧 끝날 것 같다.',
        ],
        options: [
          {
            id: 'fight',
            label: '칼을 뽑는다.',
            detail: '미라가 공격 자세를 취한다.',
            result: { startBattle: 'pit-mummy' },
          },
          {
            id: 'retreat',
            label: '물러선다.',
            detail: '미라의 분노를 피해 구덩이를 빠져나간다.',
            result: {
              memoryShards: 2,
              hp: -4,
              epilogue: [
                '붕대가 허공을 휘두르지만 당신은 간신히 위로 올라왔다.',
                '구덩이는 다시 고요해졌고, 손끝에 남은 잔향만이 증거였다.',
              ],
            },
          },
        ],
      },
    },
  },
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
    id: 'blacksmith-soul',
    title: '대장장이의 영혼',
    story: [
      '망치질 소리가 끊이지 않는 통로 끝에, 희미한 영혼이 서 있다. 그의 손에는 아직 힘이 남아 있는 것 같다.',
      '"잠깐만 몸을 빌려다오. 내 힘이 아직 강해. 네가 허락하면, 네게 도움을 줄 수 있다."',
    ],
    relicStory: {
      'old-shield': [
        '영혼의 시선이 당신의 방패로 향한다.',
        '"그 방패... 아직 쓸만해 보이는군. 금 간 곳만 제대로 잡아주면 오래 버틸 거야."',
      ],
    },
    options: [
      {
        id: 'lend-body',
        label: '몸을 빌려준다.',
        detail: '영혼의 힘을 잠시 받아들인다.',
        result: {
          attack: 1,
          epilogue: [
            '영혼이 당신의 손목을 잡았다. 뜨거운 기운이 지나가고, 망치질의 리듬이 잠시 당신의 심장박동과 맞춰졌다.',
            '힘이 빠져나간 뒤에도 팔에는 희미한 열기가 남았다.',
          ],
        },
      },
      {
        id: 'repair-shield',
        label: '오래된 방패를 수리한다.',
        detail: '대장장이의 손길로 방패를 고친다.',
        lockedByRelic: 'old-shield',
        result: {
          defense: 1,
          epilogue: [
            '영혼이 말없이 방패를 받아 들었다. 망치질 소리가 짧게 울리고, 금 간 틈이 메워졌다.',
            '방패 표면이 다시 단단해졌다. 이제 조금 더 믿고 들 수 있을 것 같다.',
          ],
        },
      },
      {
        id: 'decline',
        label: '거절한다.',
        detail: '영혼의 제안을 뿌리친다.',
        result: {
          epilogue: [
            '영혼은 고개를 끄덕이고는 말없이 망치를 다시 든다.',
            '망치질 소리만 등 뒤에 길게 남았다.',
          ],
        },
      },
      {
        id: 'leave',
        label: '떠난다.',
        detail: '통로를 지나간다.',
        result: {},
      },
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
      {
        id: 'destroy',
        label: '갑옷을 파괴한다.',
        detail: '갑옷의 영혼이 마지막 일격을 날린다. 영혼의 흔적을 얻는다.',
        result: {
          hp: -6,
          memoryShards: 4,
          epilogue: [
            '당신은 갑옷을 거칠게 내리쳤다. 금속이 갈라지자 안에서 숨어 있던 영혼이 비명처럼 튀어 올랐다.',
            '영혼이 마지막 일격을 날려 당신을 밀어냈다. 갑옷에 깃들어 있던 그 영혼도 함께 산산조각 났다.',
            '흩어진 잔향만이 당신의 손끝에 맴돌았다.',
          ],
        },
      },
      {
        id: 'soothe',
        label: '갑옷에 깃든 영혼을 달랜다.',
        detail: '영혼의 공명으로 위로하고, 빈 갑옷을 얻는다.',
        result: {
          relic: 'old-armor',
          epilogue: [
            '당신은 갑옷 안의 숨소리에 맞춰 조용히 말을 건넸다. 울음이 점점 잦아들며, 공명이 희미한 빛으로 갑옷 표면을 적셨다.',
            '영혼이 마지막 숨을 내쉬고 갑옷 밖으로 빠져나갔다. 빈 껍데기만 남은 오래된 갑옷이 당신 앞에 놓였다.',
          ],
        },
      },
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

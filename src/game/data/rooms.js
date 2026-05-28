export const roomTypes = [
  {
    id: 'merchant-camp',
    label: '나무 아래의 캠프',
    backgroundKey: 'background-camp',
    risk: '낯선 인물',
    story: [
      '환한 빛에 시야가 흐려진다. 동굴을 빠져나오자마자, 당신은 큰 나무 옆에 캠프를 친 낯선 사람을 발견했다.',
      '이윽고 그도 당신을 발견하고는 미소를 지으며 다가온다.',
      '"내가 너에게 도움이 될만한 물건들을 좀 가지고 있는데, 어때? 구경할래?"',
    ],
    prompt: '당신은,',
    options: [
      {
        id: 'talk-to-stranger',
        label: '대화를 시도한다.',
        detail: '낯선 사람의 정체를 묻는다.',
        type: 'dialogue',
        dialogueId: 'stranger-question',
      },
      {
        id: 'browse-goods',
        label: '물건을 구경한다.',
        detail: '아직 상점은 구현 전입니다.',
        type: 'message',
        response: [
          '당신은 조심스럽게 천막 안쪽을 살핀다.',
          '녹슨 단검, 금이 간 부적, 말라붙은 약초가 가지런히 놓여 있다. 낯선 사람은 아무 말 없이 당신의 반응을 기다린다.',
        ],
      },
      {
        id: 'leave-camp',
        label: '관심 없다. 가던 길을 간다.',
        detail: '다음 장소로 이동한다.',
        type: 'move',
      },
    ],
    dialogues: {
      'stranger-question': {
        title: '차가워진 미소',
        story: [
          '당신은 낯선 사람에게 대화를 시도한다.',
          '"당신은 누구십니까?"',
          '그러자 낯선 사람의 표정이 차갑게 일변한다.',
          '"너에게 그런 질문은 허락되지 않았어. 물건을 사든가, 아니면 썩 꺼져."',
        ],
        prompt: '당신은,',
        options: [
          {
            id: 'challenge',
            label: '"누가 제게 허락을 하지 않았다는 거죠?"',
            detail: '위험할 수 있는 질문을 이어간다.',
            type: 'message',
            response: [
              '낯선 사람의 눈동자가 아주 잠깐, 사람의 것이 아닌 빛으로 번뜩인다.',
              '"아직은 그 이름을 들을 때가 아니야."',
            ],
          },
          {
            id: 'secret-known',
            label: '"사실 네 정체에 대해 이미 알고 있어."',
            detail: '엔딩 경험 필요',
            type: 'locked',
            locked: true,
          },
          {
            id: 'silent-leave',
            label: '말없이 떠난다.',
            detail: '다음 장소로 이동한다.',
            type: 'move',
          },
        ],
      },
    },
  },
  {
    id: 'battle',
    label: '괴물의 흔적',
    backgroundKey: 'background-forest',
    risk: '위험도 중간',
    story: [
      '젖은 흙 위에 선명한 발자국이 이어져 있다. 발자국 주변에는 검게 마른 피가 번져 있다.',
      '숲 안쪽에서 낮은 울음소리가 들린다. 이 길을 지나려면 피할 수 없는 마주침이 있을 것 같다.',
    ],
    prompt: '당신은,',
  },
  {
    id: 'event',
    label: '낡은 제단',
    backgroundKey: 'background-ruins',
    risk: '위험도 낮음',
    story: [
      '허물어진 돌기둥 사이에 작은 제단이 남아 있다. 제단 위의 촛불은 바람도 없이 흔들린다.',
      '손을 뻗으면 무언가를 얻을 수 있을지도 모른다. 하지만 그 대가가 무엇인지는 알 수 없다.',
    ],
    prompt: '당신은,',
  },
  {
    id: 'mystery',
    label: '안개 낀 통로',
    backgroundKey: 'background-mist',
    risk: '정보 부족',
    story: [
      '회색 안개가 길을 삼킨다. 몇 걸음 앞도 제대로 보이지 않지만, 안개 너머에서 누군가 속삭이는 듯하다.',
      '돌아가기엔 이미 길이 사라졌다.',
    ],
    prompt: '당신은,',
  },
  {
    id: 'rest',
    label: '희미한 모닥불',
    backgroundKey: 'background-camp',
    risk: '안전',
    story: [
      '꺼져가는 모닥불이 동굴 벽에 긴 그림자를 만든다. 누가 남기고 갔는지 모를 담요와 빈 냄비가 놓여 있다.',
      '잠시 쉬어가도 괜찮을 것 같다. 다만, 오래 머물수록 어둠도 당신의 냄새를 기억할 것이다.',
    ],
    prompt: '당신은,',
  },
]

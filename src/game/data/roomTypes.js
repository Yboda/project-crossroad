export const roomTypes = {
  shop: {
    id: 'shop',
    label: '나무 아래의 캠프',
    backgroundKey: 'background-basic',
    risk: '상점',
    story: [
      '환한 빛에 시야가 흐려진다. 큰 나무 옆에 캠프를 친 낯선 그림자가 당신을 기다리고 있다.',
      '후드 아래 얼굴은 보이지 않지만, 상자 안 물건들은 이미 당신의 골드를 기억하고 있는 듯하다.',
    ],
    prompt: '당신은,',
  },
  battle: {
    id: 'battle',
    label: '괴물의 흔적',
    backgroundKey: 'background-basic',
    risk: '위험도 보통',
    story: [
      '어두운 숲길 끝에서 낮은 울음소리가 들려온다. 젖은 흙 위에는 검게 마른 피가 번져 있다.',
      '발자국은 멈추지 않고 안쪽으로 이어진다. 이 길을 지나려면 피할 수 없는 마주침이 있을 것 같다.',
    ],
    prompt: '당신은,',
  },
  event: {
    id: 'event',
    label: '낡은 제단',
    backgroundKey: 'background-basic',
    risk: '사건',
    story: [
      '허물어진 돌기둥 사이, 검은 촛불이 바람도 없이 흔들린다. 공기는 오래된 재 냄새로 무겁다.',
      '제단 위에는 아무도 남기지 않은 제물 자국만 남아 있다. 손을 뻗으면 대가 없는 선물은 없을 것이다.',
    ],
    prompt: '당신은,',
  },
  mystery: {
    id: 'mystery',
    label: '안개 낀 통로',
    backgroundKey: 'background-basic',
    risk: '정보 부족',
    story: [
      '회색 안개가 길을 삼킨다. 몇 걸음 앞도 보이지 않지만, 안개 너머에서 누군가 속삭이는 듯하다.',
      '돌아가려 해도 발밑의 길은 이미 사라졌다. 남은 선택은 더 깊이 들어가는 것뿐이다.',
    ],
    prompt: '당신은,',
  },
  rest: {
    id: 'rest',
    label: '희미한 모닥불',
    backgroundKey: 'background-basic',
    risk: '안전',
    story: [
      '꺼져가는 모닥불이 동굴 벽에 긴 그림자를 만든다. 누가 남기고 간 담요와 빈 냄비가 놓여 있다.',
      '잠시 쉬어가도 괜찮을 것 같다. 다만, 오래 머물수록 어둠도 당신의 냄새를 기억할 것이다.',
    ],
    prompt: '당신은,',
  },
  boss: {
    id: 'boss',
    label: '층의 문',
    backgroundKey: 'background-basic',
    risk: '보스',
    story: [
      '거대한 문 앞에서 공기가 멈춘다. 문틈마다 오래된 죽음의 냄새가 배어 나온다.',
      '이 문을 넘으려면, 이 층에 고인 시간의 주인을 쓰러뜨려야 한다. 발밑의 돌은 이미 수많은 발자국을 기억하고 있다.',
    ],
    prompt: '당신은,',
  },
  ending: {
    id: 'ending',
    label: '지상문',
    backgroundKey: 'background-basic',
    risk: '결말',
    story: [
      '끝없이 이어지던 계단이 마침내 끊기고, 눈부신 문 하나가 나타난다.',
      '문틈에서 따스한 햇살이 새어 나오지만, 영혼 깊은 곳에서는 알 수 없는 공포가 고개를 든다.',
    ],
    prompt: '당신은,',
  },
}

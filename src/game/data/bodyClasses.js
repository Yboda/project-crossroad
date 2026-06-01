export const bodyClasses = [
  {
    id: 'swordsman',
    name: '검사의 육체',
    description: '손끝에 낡은 검술의 기억이 남아 있다.',
    stats: { hp: 34, maxHp: 34, attack: 6, defense: 6, mp: 3, maxMp: 5 },
    skills: ['heavy', 'mana-guard'],
  },
  {
    id: 'monk',
    name: '수도자의 육체',
    description: '고통을 참는 법과 호흡을 가다듬는 법을 알고 있다.',
    stats: { hp: 38, maxHp: 38, attack: 4, defense: 8, mp: 4, maxMp: 6 },
    skills: ['heavy', 'mana-guard'],
  },
  {
    id: 'thief',
    name: '도적의 육체',
    description: '그림자 속에서 먼저 움직였던 기억이 남아 있다.',
    stats: { hp: 28, maxHp: 28, attack: 7, defense: 5, mp: 5, maxMp: 6 },
    skills: ['heavy', 'mana-guard'],
    traits: ['stealthy'],
  },
  {
    id: 'medium',
    name: '영매의 육체',
    description: '죽은 시간의 목소리를 조금 더 선명하게 듣는다.',
    stats: { hp: 30, maxHp: 30, attack: 4, defense: 5, mp: 6, maxMp: 8 },
    skills: ['heavy', 'mana-guard'],
    traits: ['memory-sensitive'],
  },
]

export const enemyTemplates = [
  {
    id: 'cave-wolf',
    name: '동굴 늑대',
    textureKey: 'enemy-wolf',
    maxHp: 24,
    attack: 6,
    pattern: [
      { type: 'attack', value: 6, label: '물어뜯기' },
      { type: 'attack', value: 8, label: '달려들기' },
      { type: 'block', value: 5, label: '몸 낮추기' },
    ],
  },
  {
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
  },
]

export function createEnemy(depth) {
  const template = enemyTemplates[depth % enemyTemplates.length]
  const hpBonus = Math.floor(depth * 1.5)

  return {
    ...template,
    hp: template.maxHp + hpBonus,
    maxHp: template.maxHp + hpBonus,
    attack: template.attack + Math.floor(depth / 3),
    block: 0,
    turn: 0,
  }
}

export const floors = [
  {
    id: 'corpse-pit',
    name: '시체더미의 저층',
    floorNumber: 1,
    depthToBoss: 4,
    backgroundKey: 'background-1f-path',
    bossIntroBackgroundKey: 'background-boss-1f-front',
    enemyPool: ['starving-wolf', 'ash-imp', 'bone-rat'],
    bossId: 'corpse-butcher',
    eventPool: ['old-altar', 'hand-in-corpses', 'backward-well', 'blacksmith-soul', '1f-corpse-pit', 'black-thorn-wall'],
    roomWeights: { battle: 45, event: 25, shop: 10, rest: 10, mystery: 10 },
    difficulty: { hp: 0, attack: 0 },
  },
  {
    id: 'echo-prison',
    name: '깨진 메아리의 감옥',
    floorNumber: 2,
    depthToBoss: 4,
    backgroundKey: 'background-1f-path',
    enemyPool: ['hollow-guard', 'ghost-of-regret', 'chain-wraith'],
    bossId: 'mirror-jailer',
    eventPool: ['memory-door', 'endless-campfire', 'broken-mirror', 'crying-armor', 'black-thorn-wall'],
    roomWeights: { battle: 50, event: 20, shop: 10, rest: 10, mystery: 10 },
    difficulty: { hp: 7, attack: 2 },
  },
  {
    id: 'false-sky',
    name: '그림자 없는 하늘문',
    floorNumber: 3,
    depthToBoss: 4,
    backgroundKey: 'background-1f-path',
    enemyPool: ['dark-knight', 'time-leech', 'soul-hound'],
    bossId: 'surface-warden',
    eventPool: ['mist-corridor', 'wardens-mark', 'old-altar', 'memory-door'],
    roomWeights: { battle: 55, event: 18, shop: 9, rest: 8, mystery: 10 },
    difficulty: { hp: 14, attack: 4 },
  },
]

export function getFloorByIndex(index) {
  return floors[Math.min(index, floors.length - 1)]
}

export function isFinalFloor(index) {
  return index >= floors.length - 1
}

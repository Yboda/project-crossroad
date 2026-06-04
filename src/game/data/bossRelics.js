/** 보스 처치 시 해당 보스 전용 유물 풀에서 1종 랜덤 (미보유만) */
export const bossRelicDrops = {
  'corpse-butcher': ['butcher-knife', 'corpse-sack'],
  'mirror-jailer': ['mirror-fragment', 'jailer-whisper'],
  'surface-warden': ['warden-gavel', 'loop-fragment'],
}

export function getBossRelicPool(bossId) {
  return bossRelicDrops[bossId] ?? []
}

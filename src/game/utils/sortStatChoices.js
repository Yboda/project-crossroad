const STAT_CHOICE_RANK = {
  attack: 0,
  defense: 1,
  maxHp: 2,
}

export function sortStatChoiceOptions(options) {
  return [...options].sort((left, right) => {
    const leftRank = STAT_CHOICE_RANK[left.reward?.type] ?? 99
    const rightRank = STAT_CHOICE_RANK[right.reward?.type] ?? 99
    return leftRank - rightRank
  })
}

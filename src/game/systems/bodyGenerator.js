import { bodyClasses } from '../data/bodyClasses'

export function createBodyCandidates(persistentState, count = 3) {
  const unlockedCount = persistentState.unlockedSoulNodes?.length ?? 0

  return bodyClasses.slice(0, count).map((bodyClass, index) => ({
    id: `${bodyClass.id}-${index}`,
    classId: bodyClass.id,
    name: bodyClass.name,
    description: bodyClass.description,
    stats: {
      ...bodyClass.stats,
      attack: bodyClass.stats.attack + (index === 0 ? 0 : index - 1) + Math.floor(unlockedCount / 6),
      maxHp: bodyClass.stats.maxHp + index * 2,
      hp: bodyClass.stats.hp + index * 2,
    },
    skills: bodyClass.skills,
    traits: bodyClass.traits ?? [],
  }))
}

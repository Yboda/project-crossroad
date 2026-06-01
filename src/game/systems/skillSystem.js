import { skills } from '../data/skills'

export function getSkillById(id) {
  return skills.find((skill) => skill.id === id)
}

export function getKnownSkills(player) {
  return (player.skills ?? ['heavy', 'mana-guard']).map(getSkillById).filter(Boolean)
}

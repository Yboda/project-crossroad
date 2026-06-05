/** @typedef {'idle' | 'player-hit' | 'player-hit-heavy' | 'enemy-lunge' | 'enemy-block' | 'enemy-buff'} EnemyMotionId */
/** @typedef {'player-hit' | 'player-block' | 'player-block-strong' | 'player-attack-strong' | null} ScreenEffectId */

export function emitCombatMotion(detail) {
  window.dispatchEvent(new CustomEvent('game:combat-motion', { detail }))
}

/**
 * @param {string} actionId
 * @param {{ target?: string }} result
 * @returns {{ enemy: EnemyMotionId | null, screen: ScreenEffectId }}
 */
export function getMotionForPlayerAction(actionId, result) {
  if (result?.target === 'enemy') {
    return {
      enemy: actionId === 'heavy' ? 'player-hit-heavy' : 'player-hit',
      screen: actionId === 'heavy' ? 'player-attack-strong' : null,
    }
  }

  if (actionId === 'defend') {
    return { enemy: null, screen: 'player-block' }
  }

  if (actionId === 'mana-guard') {
    return { enemy: null, screen: 'player-block-strong' }
  }

  return { enemy: null, screen: null }
}

/**
 * @param {string} intentType
 * @param {{ target?: string }} result
 * @returns {{ enemy: EnemyMotionId | null, screen: ScreenEffectId }}
 */
export function getMotionForEnemyIntent(intentType, result) {
  if (result?.target === 'player' && intentType === 'attack') {
    return { enemy: 'enemy-lunge', screen: 'player-hit' }
  }

  if (intentType === 'block') {
    return { enemy: 'enemy-block', screen: null }
  }

  if (intentType === 'buff') {
    return { enemy: 'enemy-buff', screen: null }
  }

  return { enemy: null, screen: null }
}

/** framer-motion one-shot presets (transform-origin: bottom center) */
export const ENEMY_MOTION_PRESETS = {
  idle: {
    scaleY: [1, 1.018, 1],
    scaleX: [1, 1.006, 1],
    transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
  },
  'player-hit': {
    scaleY: [1, 0.93, 1.02, 1],
    scaleX: [1, 1.02, 0.98, 1],
    x: [0, -8, 5, 0],
    transition: { duration: 0.28, ease: 'easeOut' },
  },
  'player-hit-heavy': {
    scaleY: [1, 0.88, 1.05, 1],
    scaleX: [1, 1.04, 0.96, 1],
    x: [0, -14, 8, 0],
    transition: { duration: 0.38, ease: 'easeOut' },
  },
  'enemy-lunge': {
    scaleY: [1, 1.07, 1],
    scaleX: [1, 1.03, 1],
    y: [0, 18, 0],
    transition: { duration: 0.32, ease: 'easeInOut' },
  },
  'enemy-block': {
    scaleX: [1, 1.1, 1],
    scaleY: [1, 0.94, 1],
    transition: { duration: 0.26, ease: 'easeOut' },
  },
  'enemy-buff': {
    scaleY: [1, 1.04, 1],
    opacity: [1, 0.85, 1],
    transition: { duration: 0.34, ease: 'easeInOut' },
  },
  'enemy-defeat': {
    scaleY: [1, 0.9, 0.72],
    opacity: [1, 0.6, 0],
    y: [0, 10, 28],
    transition: { duration: 0.55, ease: 'easeIn' },
  },
}

export const SCREEN_EFFECT_DURATIONS_MS = {
  'player-hit': 140,
  'player-block': 320,
  'player-block-strong': 380,
  'player-attack-strong': 180,
}

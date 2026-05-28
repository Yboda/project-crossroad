import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'
import { BootScene } from './scenes/BootScene'
import { ExplorationScene } from './scenes/ExplorationScene'

export function createGameConfig(parent) {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#080b12',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, ExplorationScene],
  }
}

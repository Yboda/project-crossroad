import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, getGameResolution } from './constants'
import { BootScene } from './scenes/BootScene'
import { ExplorationScene } from './scenes/ExplorationScene'

export function createGameConfig(parent) {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#080b12',
    resolution: getGameResolution(),
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    scale: {
      // CSS가 프레임을 채우도록 스케일하고, FIT 레터박스(양옆 여백)는 사용하지 않음
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.NO_CENTER,
    },
    scene: [BootScene, ExplorationScene],
  }
}

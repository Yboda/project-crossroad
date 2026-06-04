import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../constants'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  create() {
    this.createBackgroundTexture('background-forest', 0x172417, 0x2c4b34, 0x7d8f59)
    this.createBackgroundTexture('background-ruins', 0x181923, 0x4a3d49, 0xb58b5b)
    this.createBackgroundTexture('background-mist', 0x101720, 0x334153, 0x9db1c0)
    this.createBackgroundTexture('background-camp', 0x1d1712, 0x50351f, 0xe3a857)
    this.createEnemyTexture('enemy-wolf', 0x2a3140, 0x8ba0b8)
    this.createEnemyTexture('enemy-imp', 0x4a1f1b, 0xff8a3d)
    this.createEnemyTexture('enemy-rat', 0x2d2630, 0xd9d0ba)
    this.createEnemyTexture('enemy-guard', 0x2f3442, 0xa7b0c4)
    this.createEnemyTexture('enemy-moth', 0x30283f, 0xd8c6ff)
    this.createEnemyTexture('enemy-wraith', 0x1b2030, 0x7cc7ff)
    this.createEnemyTexture('enemy-knight', 0x222936, 0xffedb5)
    this.createEnemyTexture('enemy-leech', 0x35202b, 0xff6b9a)
    this.createEnemyTexture('enemy-hound', 0x241d22, 0xff8a3d)
    this.createIntentTextures()
    this.scene.start('ExplorationScene')
  }

  createBackgroundTexture(key, skyColor, groundColor, accentColor) {
    const graphics = this.add.graphics()

    graphics.fillStyle(skyColor, 1)
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    graphics.fillStyle(groundColor, 1)
    graphics.fillRect(0, GAME_HEIGHT * 0.45, GAME_WIDTH, GAME_HEIGHT * 0.55)

    for (let i = 0; i < 5; i += 1) {
      const x = -40 + i * 118
      const baseY = GAME_HEIGHT * 0.48
      const height = Phaser.Math.Between(120, 230)
      graphics.fillStyle(accentColor, 0.22)
      graphics.fillTriangle(x - 110, baseY, x, baseY - height, x + 110, baseY)
    }

    graphics.fillStyle(0x05070c, 0.36)
    graphics.fillRect(0, GAME_HEIGHT * 0.64, GAME_WIDTH, GAME_HEIGHT * 0.36)
    graphics.generateTexture(key, GAME_WIDTH, GAME_HEIGHT)
    graphics.destroy()
  }

  createEnemyTexture(key, bodyColor, accentColor) {
    const graphics = this.add.graphics()

    graphics.fillStyle(bodyColor, 1)
    graphics.fillRoundedRect(20, 42, 94, 84, 34)
    graphics.fillTriangle(30, 48, 48, 10, 64, 52)
    graphics.fillTriangle(78, 52, 100, 12, 108, 58)
    graphics.fillStyle(accentColor, 1)
    graphics.fillCircle(52, 72, 7)
    graphics.fillCircle(86, 72, 7)
    graphics.lineStyle(5, accentColor, 0.55)
    graphics.strokeRoundedRect(20, 42, 94, 84, 34)
    graphics.generateTexture(key, 134, 140)
    graphics.destroy()
  }

  createIntentTextures() {
    this.createAttackIntentTexture()
    this.createBlockIntentTexture()
    this.createBuffIntentTexture()
  }

  createAttackIntentTexture() {
    const graphics = this.add.graphics()

    graphics.lineStyle(6, 0xff6b5f, 1)
    graphics.lineBetween(10, 34, 34, 10)
    graphics.lineStyle(4, 0xffd0ca, 1)
    graphics.lineBetween(24, 8, 36, 20)
    graphics.lineBetween(12, 30, 22, 40)
    graphics.generateTexture('intent-attack', 44, 44)
    graphics.destroy()
  }

  createBlockIntentTexture() {
    const graphics = this.add.graphics()

    graphics.fillStyle(0x5fa8ff, 1)
    graphics.fillTriangle(22, 6, 38, 14, 32, 36)
    graphics.fillTriangle(22, 6, 6, 14, 12, 36)
    graphics.lineStyle(4, 0xd7ecff, 1)
    graphics.strokeTriangle(22, 6, 38, 14, 32, 36)
    graphics.strokeTriangle(22, 6, 6, 14, 12, 36)
    graphics.generateTexture('intent-block', 44, 44)
    graphics.destroy()
  }

  createBuffIntentTexture() {
    const graphics = this.add.graphics()

    graphics.fillStyle(0xd8a657, 1)
    graphics.fillCircle(22, 22, 15)
    graphics.lineStyle(4, 0xffedb5, 1)
    graphics.lineBetween(22, 10, 22, 34)
    graphics.lineBetween(10, 22, 34, 22)
    graphics.generateTexture('intent-buff', 44, 44)
    graphics.destroy()
  }
}

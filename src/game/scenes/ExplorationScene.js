import Phaser from 'phaser'
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../constants'
import { playerCharacter } from '../data/characters'
import { createEnemy } from '../data/enemies'
import { roomTypes } from '../data/rooms'
import {
  applyEnemyIntent,
  applyPlayerAction,
  applyReward,
  createPlayerState,
  createRewardOptions,
  getBattleActions,
  getEnemyIntent,
} from '../systems/combatSystem'
import { createRoomOptions } from '../systems/roomGenerator'

const LAYOUT = {
  heroX: 118,
  heroY: 286,
  heroScale: 0.76,
  enemyX: 280,
  enemyY: 270,
  enemyScale: 0.8,
}

export class ExplorationScene extends Phaser.Scene {
  constructor() {
    super('ExplorationScene')
  }

  create() {
    this.depth = 1
    this.player = createPlayerState(playerCharacter)
    this.currentRoom = roomTypes[0]
    this.roomOptions = createRoomOptions(this.depth)
    this.currentNarrative = this.createRoomNarrative(this.currentRoom)
    this.isTransitioning = false
    this.currentEnemy = null

    this.createWorld()
    this.createHud()
    this.setupChoiceInput()
    this.publishNarrative()
    this.startIdleMotion()
  }

  createWorld() {
    this.background = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.currentRoom.backgroundKey)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.18).setOrigin(0)

    this.hero = this.add.image(LAYOUT.heroX, LAYOUT.heroY, 'hero-back').setOrigin(0.5, 1)
    this.hero.setScale(LAYOUT.heroScale)
    this.createPlayerBattleHud()

    this.enemySprite = this.add.image(LAYOUT.enemyX, LAYOUT.enemyY, 'enemy-wolf').setOrigin(0.5, 1)
    this.enemySprite.setScale(LAYOUT.enemyScale).setVisible(false)
    this.createEnemyBattleHud()
    this.createIntentIndicator()

    this.overlay = this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0)
      .setOrigin(0)
      .setDepth(20)
  }

  createHud() {
    this.depthText = this.add
      .text(18, 18, `깊이 ${this.depth}`, {
        color: '#f7efe0',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '21px',
        fontStyle: '700',
      })
      .setDepth(5)

    this.characterText = this.add
      .text(18, 48, this.createCharacterHudText(), {
        color: '#d8a657',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '14px',
      })
      .setDepth(5)
  }

  createIntentIndicator() {
    this.intentIndicator = this.add.container(280, 168).setVisible(false).setDepth(6)
    this.intentBadge = this.add
      .rectangle(0, 0, 88, 42, 0x111827, 0.92)
      .setStrokeStyle(1, COLORS.gold, 0.42)
      .setOrigin(0.5)
    this.intentIcon = this.add.image(-22, 0, 'intent-attack').setScale(0.66)
    this.intentText = this.add
      .text(10, 0, '0', {
        color: '#f7efe0',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '18px',
        fontStyle: '700',
      })
      .setOrigin(0.5)

    this.intentIndicator.add([this.intentBadge, this.intentIcon, this.intentText])
  }

  createPlayerBattleHud() {
    this.playerBattleHud = this.add.container(LAYOUT.heroX, LAYOUT.heroY + 18).setVisible(false).setDepth(6)
    this.playerHpBarBg = this.add
      .rectangle(0, 0, 112, 12, 0x111827, 0.92)
      .setStrokeStyle(1, COLORS.gold, 0.34)
      .setOrigin(0.5)
    this.playerHpBar = this.add.rectangle(-54, 0, 108, 8, 0x62d68f, 1).setOrigin(0, 0.5)
    this.playerHpText = this.add
      .text(0, 18, '', {
        color: '#f7efe0',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '12px',
        fontStyle: '700',
        stroke: '#080b12',
        strokeThickness: 3,
      })
      .setOrigin(0.5)

    this.playerBattleHud.add([this.playerHpBarBg, this.playerHpBar, this.playerHpText])
    this.updatePlayerBattleHud()
  }

  createEnemyBattleHud() {
    this.enemyBattleHud = this.add.container(LAYOUT.enemyX, LAYOUT.enemyY + 18).setVisible(false).setDepth(6)
    this.enemyHpBarBg = this.add
      .rectangle(0, 0, 112, 12, 0x111827, 0.92)
      .setStrokeStyle(1, COLORS.gold, 0.34)
      .setOrigin(0.5)
    this.enemyHpBar = this.add.rectangle(-54, 0, 108, 8, 0xff6b5f, 1).setOrigin(0, 0.5)
    this.enemyHpText = this.add
      .text(0, 18, '', {
        color: '#f7efe0',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '12px',
        fontStyle: '700',
        stroke: '#080b12',
        strokeThickness: 3,
      })
      .setOrigin(0.5)

    this.enemyBattleHud.add([this.enemyHpBarBg, this.enemyHpBar, this.enemyHpText])
  }

  createCharacterHudText() {
    return `${playerCharacter.name} · HP ${this.player.hp}/${this.player.maxHp} · 공격 ${this.player.attack} · 방어 ${this.player.defense}`
  }

  updateHud() {
    this.characterText.setText(this.createCharacterHudText())
    this.updatePlayerBattleHud()
    this.updateEnemyBattleHud()
  }

  updatePlayerBattleHud() {
    const hpRatio = Phaser.Math.Clamp(this.player.hp / this.player.maxHp, 0, 1)
    this.playerHpBar.displayWidth = 108 * hpRatio
    this.playerHpText.setText(`HP ${this.player.hp}/${this.player.maxHp}`)
  }

  updateEnemyBattleHud() {
    if (!this.currentEnemy) {
      return
    }

    const hpRatio = Phaser.Math.Clamp(this.currentEnemy.hp / this.currentEnemy.maxHp, 0, 1)
    this.enemyHpBar.displayWidth = 108 * hpRatio
    this.enemyHpText.setText(`HP ${this.currentEnemy.hp}/${this.currentEnemy.maxHp}`)
    this.enemyBattleHud.setPosition(this.enemySprite.x, this.enemySprite.y + 22)
  }

  setupChoiceInput() {
    this.handleChoiceEvent = (event) => {
      const option = this.currentNarrative.options.find(({ id }) => id === event.detail.optionId)
      if (option) {
        this.selectChoice(option)
      }
    }

    window.addEventListener('game:choice', this.handleChoiceEvent)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('game:choice', this.handleChoiceEvent)
    })
  }

  createRoomNarrative(room) {
    if (room.id === 'battle') {
      return this.createBattleIntroNarrative(room)
    }

    return {
      id: `room-${room.instanceId ?? room.id}-${this.depth}`,
      title: room.label,
      story: room.story,
      prompt: room.prompt ?? '당신은,',
      options: this.createUiOptions(room.options ?? this.createTravelChoices()),
    }
  }

  createBattleIntroNarrative(room) {
    return {
      id: `battle-intro-${room.instanceId ?? room.id}-${this.depth}`,
      title: room.label,
      story: [
        ...room.story,
        '당신은 무기 손잡이를 고쳐 쥔다. 이번 전투에서 살아남는다면, 분명 조금 더 강해질 것이다.',
      ],
      prompt: '당신은,',
      options: this.createUiOptions([
        {
          id: 'start-battle',
          label: '전투를 시작한다.',
          detail: '승리하면 성장 보상을 선택한다.',
          type: 'start-battle',
        },
      ]),
    }
  }

  createDialogueNarrative(dialogue) {
    return {
      id: `dialogue-${dialogue.title}-${this.depth}`,
      title: dialogue.title,
      story: dialogue.story,
      prompt: dialogue.prompt ?? '당신은,',
      options: this.createUiOptions(dialogue.options),
    }
  }

  createTravelChoices() {
    return this.roomOptions.map((room) => ({
      id: `move-${room.instanceId}`,
      label: `${room.label}로 향한다.`,
      detail: room.risk,
      type: 'move',
      room,
    }))
  }

  createUiOptions(options) {
    return options.map((option) => ({
      ...option,
      locked: option.type === 'locked' || option.locked,
    }))
  }

  createBattleNarrative(log = []) {
    const intent = getEnemyIntent(this.currentEnemy)
    this.updateIntentIndicator(intent)

    return {
      id: `battle-turn-${this.depth}-${this.currentEnemy.turn}-${this.player.hp}-${this.currentEnemy.hp}`,
      title: `내 턴 · ${this.currentEnemy.name}와의 전투`,
      story: [
        `현재는 당신의 턴이다. 행동을 선택하면 즉시 처리되고, 이어서 적이 예고한 행동을 실행한다.`,
        `당신: HP ${this.player.hp}/${this.player.maxHp} · 방어도 ${this.player.block} · 분노 ${this.player.rage}`,
        `${this.currentEnemy.name}: HP ${this.currentEnemy.hp}/${this.currentEnemy.maxHp} · 방어도 ${this.currentEnemy.block}`,
        `적의 다음 행동: ${intent.description}`,
        ...log,
      ],
      prompt: '행동을 선택하세요.',
      options: this.createUiOptions(getBattleActions(this.player)),
    }
  }

  updateIntentIndicator(intent = getEnemyIntent(this.currentEnemy)) {
    if (!this.currentEnemy || !this.enemySprite.visible) {
      this.intentIndicator.setVisible(false)
      return
    }

    const iconKeyByType = {
      attack: 'intent-attack',
      block: 'intent-block',
      buff: 'intent-buff',
    }
    const valuePrefix = intent.type === 'buff' ? '+' : ''

    this.intentIcon.setTexture(iconKeyByType[intent.type] ?? 'intent-attack')
    this.intentText.setText(`${valuePrefix}${intent.value}`)
    this.intentIndicator.setPosition(this.enemySprite.x, this.enemySprite.y - 142)
    this.intentIndicator.setVisible(true)
  }

  createVictoryNarrative(log = []) {
    return {
      id: `victory-${this.depth}`,
      title: '전투 승리',
      story: [
        `${this.currentEnemy.name}가 어둠 속으로 쓰러진다.`,
        '숨을 고르는 사이, 몸 안쪽에서 조금 더 깊은 힘이 깨어나는 것이 느껴진다.',
        ...log,
      ],
      prompt: '보상을 하나 선택하세요.',
      options: this.createUiOptions(createRewardOptions(this.player)),
    }
  }

  publishNarrative() {
    window.dispatchEvent(new CustomEvent('game:narrative', { detail: this.currentNarrative }))
  }

  setUiVisibility(visible) {
    window.dispatchEvent(new CustomEvent('game:ui-visibility', { detail: { visible } }))
  }

  startIdleMotion() {
    this.tweens.add({
      targets: this.hero,
      y: this.hero.y - 7,
      scaleX: LAYOUT.heroScale + 0.02,
      scaleY: LAYOUT.heroScale - 0.02,
      duration: 1250,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })
  }

  startEnemyIdleMotion() {
    this.tweens.killTweensOf(this.enemySprite)
    this.tweens.killTweensOf(this.intentIndicator)
    this.tweens.killTweensOf(this.enemyBattleHud)
    this.tweens.add({
      targets: this.enemySprite,
      y: this.enemySprite.y - 6,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    this.tweens.add({
      targets: this.intentIndicator,
      y: this.intentIndicator.y - 6,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    this.tweens.add({
      targets: this.enemyBattleHud,
      y: this.enemyBattleHud.y - 6,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    this.tweens.add({
      targets: this.enemySprite,
      scaleX: LAYOUT.enemyScale + 0.04,
      scaleY: LAYOUT.enemyScale - 0.04,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })
  }

  animateHeroAttack() {
    this.tweens.add({
      targets: this.hero,
      x: LAYOUT.heroX + 34,
      duration: 120,
      yoyo: true,
      ease: 'Sine.easeInOut',
    })

    this.tweens.add({
      targets: this.enemySprite,
      x: this.enemySprite.x + 10,
      alpha: 0.72,
      duration: 90,
      yoyo: true,
      ease: 'Sine.easeInOut',
    })
  }

  animateEnemyAction(result) {
    if (result.target === 'player') {
      this.tweens.add({
        targets: this.enemySprite,
        x: this.enemySprite.x - 20,
        duration: 120,
        yoyo: true,
        ease: 'Sine.easeInOut',
      })

      this.tweens.add({
        targets: this.hero,
        alpha: 0.68,
        duration: 100,
        yoyo: true,
        ease: 'Sine.easeInOut',
      })
      return
    }

    this.tweens.add({
      targets: this.enemySprite,
      scaleX: 0.96,
      scaleY: 0.9,
      duration: 140,
      yoyo: true,
      ease: 'Sine.easeInOut',
    })
  }

  showCombatFloat(result) {
    const target = result.target === 'enemy' ? this.enemySprite : this.hero
    const colorByType = {
      damage: '#ff6b5f',
      block: '#77b7ff',
      buff: '#ffd166',
      neutral: '#f7efe0',
    }

    const text = this.add
      .text(target.x, target.y - 142, result.floatText, {
        color: colorByType[result.floatType] ?? '#f7efe0',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '26px',
        fontStyle: '800',
        stroke: '#080b12',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(8)

    this.tweens.add({
      targets: text,
      y: text.y - 36,
      alpha: 0,
      duration: 620,
      ease: 'Sine.easeOut',
      onComplete: () => text.destroy(),
    })
  }

  animateEnemyDefeat() {
    this.tweens.killTweensOf(this.enemySprite)
    this.tweens.killTweensOf(this.intentIndicator)
    this.tweens.killTweensOf(this.enemyBattleHud)
    this.intentIndicator.setVisible(false)
    this.enemyBattleHud.setVisible(false)
    this.tweens.add({
      targets: this.enemySprite,
      alpha: 0,
      y: this.enemySprite.y + 24,
      angle: 10,
      duration: 320,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.enemySprite.setVisible(false).setAngle(0)
      },
    })
  }

  selectChoice(option) {
    if (this.isTransitioning) {
      return
    }

    if (option.type === 'locked' || option.locked) {
      return
    }

    if (option.type === 'dialogue') {
      const dialogue = this.currentRoom.dialogues?.[option.dialogueId]
      if (dialogue) {
        this.currentNarrative = this.createDialogueNarrative(dialogue)
        this.publishNarrative()
      }
      return
    }

    if (option.type === 'start-battle') {
      this.startBattle()
      return
    }

    if (option.type === 'battle-action') {
      this.resolveBattleAction(option.id)
      return
    }

    if (option.type === 'reward') {
      this.collectReward(option.reward)
      return
    }

    if (option.type === 'message') {
      this.currentNarrative = {
        id: `message-${option.id}-${this.depth}`,
        title: this.currentRoom.label,
        story: option.response,
        prompt: '당신은,',
        options: this.createUiOptions(this.createTravelChoices()),
      }
      this.publishNarrative()
      return
    }

    const nextRoom = option.room ?? this.roomOptions[0]
    this.isTransitioning = true
    this.setUiVisibility(false)

    this.time.delayedCall(220, () => this.playRoomTransition(nextRoom))
  }

  startBattle() {
    this.currentEnemy = createEnemy(this.depth)
    this.enemySprite.setTexture(this.currentEnemy.textureKey).setVisible(true).setAlpha(1)
    this.enemySprite.setPosition(LAYOUT.enemyX, LAYOUT.enemyY).setScale(LAYOUT.enemyScale)
    this.playerBattleHud.setVisible(true)
    this.enemyBattleHud.setVisible(true)
    this.updateHud()
    this.updateIntentIndicator()
    this.startEnemyIdleMotion()
    this.currentNarrative = this.createBattleNarrative([
      `${this.currentEnemy.name}가 길을 막아섰다.`,
    ])
    this.publishNarrative()
  }

  resolveBattleAction(actionId) {
    this.isTransitioning = true
    this.intentIndicator.setVisible(false)

    const playerResult = applyPlayerAction(this.player, this.currentEnemy, actionId)
    const log = [playerResult.message]
    this.animateHeroAttack()
    this.showCombatFloat(playerResult)
    this.updateHud()

    this.time.delayedCall(520, () => {
      if (this.currentEnemy.hp <= 0) {
        this.animateEnemyDefeat()
        this.updateHud()
        this.currentNarrative = this.createVictoryNarrative(log)
        this.publishNarrative()
        this.isTransitioning = false
        return
      }

      const enemyResult = applyEnemyIntent(this.player, this.currentEnemy)
      log.push(enemyResult.message)
      this.animateEnemyAction(enemyResult)
      this.showCombatFloat(enemyResult)
      this.updateHud()

      this.time.delayedCall(620, () => {
        if (this.player.hp <= 0) {
          this.intentIndicator.setVisible(false)
          this.currentNarrative = this.createDefeatNarrative(log)
        } else {
          this.currentNarrative = this.createBattleNarrative(log)
        }

        this.publishNarrative()
        this.isTransitioning = false
      })
    })
  }

  createDefeatNarrative(log = []) {
    return {
      id: `defeat-${this.depth}`,
      title: '쓰러짐',
      story: [
        ...log,
        '무릎이 꺾이고 시야가 어둠에 잠긴다. 아직은 더 깊은 곳으로 나아갈 힘이 부족했다.',
        '프로토타입에서는 다시 일어나는 선택지로 전투 흐름을 계속 확인할 수 있다.',
      ],
      prompt: '당신은,',
      options: this.createUiOptions([
        {
          id: 'revive-prototype',
          label: '다시 일어난다.',
          detail: '체력을 절반 회복하고 다음 장소로 이동한다.',
          type: 'reward',
          reward: { type: 'revive', value: 0 },
        },
      ]),
    }
  }

  collectReward(reward) {
    let result = ''

    if (reward.type === 'revive') {
      this.player.hp = Math.max(1, Math.floor(this.player.maxHp / 2))
      result = '당신은 간신히 다시 일어났다.'
    } else {
      result = applyReward(this.player, reward)
    }

    this.updateHud()
    this.currentEnemy = null
    this.enemySprite.setVisible(false)
    this.intentIndicator.setVisible(false)
    this.enemyBattleHud.setVisible(false)
    this.playerBattleHud.setVisible(false)
    this.currentNarrative = {
      id: `reward-result-${this.depth}`,
      title: '성장',
      story: [
        result,
        '이제 같은 길도 이전과는 다르게 느껴진다. 더 깊은 곳으로 향할 준비가 됐다.',
      ],
      prompt: '당신은,',
      options: this.createUiOptions(this.createTravelChoices()),
    }
    this.publishNarrative()
  }

  playRoomTransition(room) {
    this.tweens.killTweensOf(this.hero)

    this.tweens.add({
      targets: this.hero,
      x: this.hero.x + 46,
      y: this.hero.y - 46,
      scaleX: 0.68,
      scaleY: 0.68,
      duration: 720,
      ease: 'Sine.easeInOut',
    })

    this.tweens.add({
      targets: this.background,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 720,
      ease: 'Sine.easeInOut',
    })

    this.tweens.add({
      targets: this.overlay,
      alpha: 0.88,
      duration: 720,
      ease: 'Sine.easeInOut',
      onComplete: () => this.arriveAtRoom(room),
    })
  }

  arriveAtRoom(room) {
    this.depth += 1
    this.currentRoom = room
    this.roomOptions = createRoomOptions(this.depth)

    this.background.setTexture(room.backgroundKey)
    this.background.setScale(1)
    this.hero.setPosition(LAYOUT.heroX, LAYOUT.heroY).setScale(LAYOUT.heroScale)
    this.enemySprite.setVisible(false)
    this.intentIndicator.setVisible(false)
    this.enemyBattleHud.setVisible(false)
    this.playerBattleHud.setVisible(false)

    this.depthText.setText(`깊이 ${this.depth}`)
    this.currentNarrative = this.createRoomNarrative(room)
    this.publishNarrative()

    this.tweens.add({
      targets: this.overlay,
      alpha: 0,
      duration: 360,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.isTransitioning = false
        this.setUiVisibility(true)
        this.startIdleMotion()
      },
    })
  }
}

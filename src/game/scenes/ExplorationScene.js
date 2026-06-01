import Phaser from 'phaser'
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../constants'
import { getFloorByIndex, isFinalFloor } from '../data/floors'
import { createBossEnemy, createEnemy } from '../data/enemies'
import {
  applyEnemyIntent,
  applyPlayerAction,
  getBattleActions,
  getEnemyIntent,
  getSkillActions,
} from '../systems/combatSystem'
import { applyEventResult, createEventNarrative } from '../systems/eventSystem'
import { createBodySelectNarrative, createLobbyNarrative, createSoulNodeNarrative } from '../systems/lobbySystem'
import { applyEnemyDrop, applyReward, createRewardOptions } from '../systems/rewardSystem'
import {
  advanceRunDepth,
  createInitialRunState,
  moveToNextFloor,
  recordRoomVisit,
  selectRunBody,
} from '../systems/runState'
import { loadPersistentState, savePersistentState, settleRun } from '../systems/saveSystem'
import { buyShopItem, createShopNarrative } from '../systems/shopSystem'
import { createRoomOptions } from '../systems/roomGenerator'
import {
  checkCoreRouteUnlocked,
  createFakeEndingNarrative,
  createTrueEndingNarrative,
  unlockMemory,
} from '../systems/storyProgressSystem'
import { unlockSoulNode } from '../systems/soulEngravingSystem'

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

  update() {
    this.syncEnemyAttachedUi()
  }

  create() {
    this.persistentState = loadPersistentState()
    this.runState = createInitialRunState(this.persistentState)
    this.depth = this.runState.totalDepth
    this.player = this.runState.player
    this.currentFloor = getFloorByIndex(this.runState.floorIndex)
    this.currentRoom = null
    this.roomOptions = createRoomOptions(this.runState)
    this.currentNarrative = createLobbyNarrative(this.runState, this.persistentState)
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
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.currentFloor.backgroundKey)
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
      .text(18, 18, this.currentFloor.name, {
        color: '#f7efe0',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '20px',
        fontStyle: '700',
      })
      .setDepth(5)

    this.characterText = this.add
      .text(18, 46, this.createCharacterHudText(), {
        color: '#d8a657',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '12px',
        lineSpacing: 2,
        wordWrap: { width: GAME_WIDTH - 36 },
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
    this.playerBlockText = this.add
      .text(0, 36, '', {
        color: '#77b7ff',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '12px',
        fontStyle: '800',
        stroke: '#080b12',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setVisible(false)

    this.playerBattleHud.add([this.playerHpBarBg, this.playerHpBar, this.playerHpText, this.playerBlockText])
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
    this.enemyBlockText = this.add
      .text(0, 36, '', {
        color: '#77b7ff',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '12px',
        fontStyle: '800',
        stroke: '#080b12',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setVisible(false)

    this.enemyBattleHud.add([this.enemyHpBarBg, this.enemyHpBar, this.enemyHpText, this.enemyBlockText])
  }

  createCharacterHudText() {
    return `HP ${this.player.hp}/${this.player.maxHp} · MP ${this.player.mp}/${this.player.maxMp} · 공격 ${this.player.attack} · 방어 ${this.player.defense}\n골드 ${this.runState.gold} · 영혼의 흔적 ${this.runState.memoryShards}`
  }

  updateHud() {
    this.characterText.setText(this.createCharacterHudText())
    this.updatePlayerBattleHud()
    this.updateEnemyBattleHud()
  }

  updatePlayerBattleHud() {
    const hpRatio = Phaser.Math.Clamp(this.player.hp / this.player.maxHp, 0, 1)
    this.playerHpBar.displayWidth = 108 * hpRatio
    this.playerHpText.setText(`HP ${this.player.hp}/${this.player.maxHp} · MP ${this.player.mp}/${this.player.maxMp}`)
    this.playerBlockText.setText(`방어도 ${this.player.block}`)
    this.playerBlockText.setVisible(this.player.block > 0)
  }

  updateEnemyBattleHud() {
    if (!this.currentEnemy) {
      return
    }

    const hpRatio = Phaser.Math.Clamp(this.currentEnemy.hp / this.currentEnemy.maxHp, 0, 1)
    this.enemyHpBar.displayWidth = 108 * hpRatio
    this.enemyHpText.setText(`HP ${this.currentEnemy.hp}/${this.currentEnemy.maxHp}`)
    this.enemyBlockText.setText(`방어도 ${this.currentEnemy.block}`)
    this.enemyBlockText.setVisible(this.currentEnemy.block > 0)
    this.syncEnemyAttachedUi()
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
    if (room.type === 'battle' || room.type === 'boss') {
      return this.createBattleIntroNarrative(room)
    }

    if (room.type === 'event' || room.type === 'mystery') {
      return createEventNarrative(room.eventId, this.player)
    }

    if (room.type === 'shop') {
      return createShopNarrative(this.player, this.runState)
    }

    if (room.type === 'rest') {
      return this.createRestNarrative()
    }

    if (room.type === 'ending') {
      return checkCoreRouteUnlocked(this.persistentState, this.runState)
        ? createTrueEndingNarrative()
        : createFakeEndingNarrative(this.runState)
    }

    return {
      id: `room-${room.instanceId ?? room.id}-${this.depth}`,
      title: room.label,
      story: room.story,
      prompt: room.prompt ?? '당신은,',
      options: this.createUiOptions(room.options ?? this.createTravelChoices()),
    }
  }

  createRestNarrative() {
    return {
      id: `rest-${this.runState.totalDepth}`,
      title: '희미한 모닥불',
      story: [
        '꺼져가는 모닥불이 당신의 그림자를 길게 늘인다.',
        '잠깐의 휴식은 이 미궁에서 허락되는 가장 수상한 친절이다.',
      ],
      prompt: '당신은,',
      options: this.createUiOptions([
        { id: 'rest-hp', label: '상처를 돌본다.', detail: 'HP를 35% 회복한다.', type: 'rest', restType: 'hp' },
        { id: 'rest-mp', label: '호흡을 가다듬는다.', detail: 'MP를 모두 회복한다.', type: 'rest', restType: 'mp' },
        { id: 'leave-rest', label: '바로 떠난다.', detail: '다음 장소로 이동한다.', type: 'continue-run' },
      ]),
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
      title: `${this.currentEnemy.name}와의 전투`,
      story: [
        `당신: HP ${this.player.hp}/${this.player.maxHp} · MP ${this.player.mp}/${this.player.maxMp} · 방어도 ${this.player.block}`,
        `${this.currentEnemy.name}: HP ${this.currentEnemy.hp}/${this.currentEnemy.maxHp} · 방어도 ${this.currentEnemy.block}`,
        `적의 다음 행동: ${intent.description}`,
        ...log,
      ],
      prompt: '당신의 턴입니다. 행동을 선택하세요.',
      options: this.createUiOptions(getBattleActions(this.player, this.currentEnemy)),
    }
  }

  createSkillNarrative() {
    return {
      id: `skill-select-${this.depth}-${this.player.mp}-${this.currentEnemy.hp}`,
      title: '스킬 선택',
      story: [
        `사용할 스킬을 선택하세요. 현재 MP는 ${this.player.mp}/${this.player.maxMp}입니다.`,
        `${this.currentEnemy.name}: HP ${this.currentEnemy.hp}/${this.currentEnemy.maxHp} · 방어도 ${this.currentEnemy.block}`,
      ],
      prompt: '스킬을 선택하세요.',
      options: this.createUiOptions(getSkillActions(this.player, this.currentEnemy)),
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
    this.syncEnemyAttachedUi()
    this.intentIndicator.setVisible(true)
  }

  syncEnemyAttachedUi() {
    if (!this.enemySprite?.visible) {
      return
    }

    this.intentIndicator.setPosition(this.enemySprite.x, this.enemySprite.y - 142)
    this.enemyBattleHud.setPosition(this.enemySprite.x, this.enemySprite.y + 22)
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
      options: this.createUiOptions(createRewardOptions(this.player, this.currentEnemy)),
    }
  }

  publishNarrative() {
    window.dispatchEvent(new CustomEvent('game:narrative', { detail: this.currentNarrative }))
  }

  setUiVisibility(visible) {
    window.dispatchEvent(new CustomEvent('game:ui-visibility', { detail: { visible } }))
  }

  startIdleMotion() {
    this.tweens.killTweensOf(this.hero)
    this.tweens.killTweensOf(this.playerBattleHud)
    this.tweens.add({
      targets: this.hero,
      y: this.hero.y - 7,
      duration: 1250,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    this.tweens.add({
      targets: this.playerBattleHud,
      y: this.playerBattleHud.y - 7,
      duration: 1250,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })

    this.tweens.add({
      targets: this.hero,
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
      targets: [this.hero, this.playerBattleHud],
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

    if (option.type === 'select-body') {
      selectRunBody(this.runState, option.body, this.persistentState)
      this.player = this.runState.player
      this.updateHud()
      this.currentNarrative = createBodySelectNarrative(this.runState)
      this.publishNarrative()
      return
    }

    if (option.type === 'open-body-select') {
      this.currentNarrative = createBodySelectNarrative(this.runState)
      this.publishNarrative()
      return
    }

    if (option.type === 'open-soul-nodes') {
      this.currentNarrative = createSoulNodeNarrative(this.persistentState)
      this.publishNarrative()
      return
    }

    if (option.type === 'unlock-soul-node') {
      const result = unlockSoulNode(option.nodeId, this.persistentState)
      savePersistentState(this.persistentState)
      const nextNarrative = createSoulNodeNarrative(this.persistentState)
      this.currentNarrative = {
        ...nextNarrative,
        id: `soul-nodes-${option.nodeId}-${this.persistentState.memoryShards}`,
        modal: result.ok
          ? {
              title: '기억이 새겨짐',
              story: result.message,
            }
          : {
              title: '각인 실패',
              story: result.message,
            },
      }
      this.publishNarrative()
      return
    }

    if (option.type === 'back-to-lobby') {
      this.currentNarrative = createLobbyNarrative(this.runState, this.persistentState)
      this.publishNarrative()
      return
    }

    if (option.type === 'continue-run') {
      this.continueRun()
      return
    }

    if (option.type === 'run-end') {
      this.endRun(option.reason)
      return
    }

    if (option.type === 'event-choice') {
      this.resolveEventChoice(option)
      return
    }

    if (option.type === 'shop-buy') {
      this.resolveShopBuy(option.item)
      return
    }

    if (option.type === 'continue-shop') {
      this.currentNarrative = createShopNarrative(this.player, this.runState)
      this.publishNarrative()
      return
    }

    if (option.type === 'rest') {
      this.resolveRest(option.restType)
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

    if (option.type === 'open-skills') {
      this.currentNarrative = this.createSkillNarrative()
      this.publishNarrative()
      return
    }

    if (option.type === 'skill-action') {
      this.resolveBattleAction(option.id)
      return
    }

    if (option.type === 'close-skills') {
      this.currentNarrative = this.createBattleNarrative()
      this.publishNarrative()
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

  continueRun() {
    if (!this.runState.currentBody) {
      this.currentNarrative = createBodySelectNarrative(this.runState)
      this.publishNarrative()
      return
    }

    const nextRoom = this.roomOptions[0]
    if (!nextRoom) {
      return
    }
    this.isTransitioning = true
    this.setUiVisibility(false)
    this.time.delayedCall(220, () => this.playRoomTransition(nextRoom))
  }

  resolveEventChoice(option) {
    const messages = applyEventResult(this.player, this.runState, option.result)
    this.updateHud()
    this.currentNarrative = {
      id: `event-result-${option.id}`,
      title: '사건의 결과',
      story: messages,
      prompt: '당신은,',
      options: this.createUiOptions([{ id: 'event-continue', label: '다음 장소로 향한다.', detail: '미궁은 계속 이어진다.', type: 'continue-run' }]),
    }
    this.publishNarrative()
  }

  resolveShopBuy(item) {
    const messages = buyShopItem(this.player, this.runState, item)
    this.updateHud()
    this.currentNarrative = {
      id: `shop-result-${item.id}-${this.runState.gold}`,
      title: '거래 완료',
      story: messages,
      prompt: '당신은,',
      options: this.createUiOptions([
        { id: 'shop-more', label: '더 둘러본다.', detail: `남은 골드 ${this.runState.gold}`, type: 'continue-shop' },
        { id: 'shop-leave-after-buy', label: '상점을 떠난다.', detail: '다음 장소로 향한다.', type: 'continue-run' },
      ]),
    }
    this.publishNarrative()
  }

  resolveRest(restType) {
    if (restType === 'hp') {
      const heal = Math.ceil(this.player.maxHp * 0.35)
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal)
    }
    if (restType === 'mp') {
      this.player.mp = this.player.maxMp
    }
    this.updateHud()
    this.currentNarrative = {
      id: `rest-result-${restType}-${this.runState.totalDepth}`,
      title: '짧은 휴식',
      story: ['몸 안쪽의 떨림이 조금 가라앉는다.'],
      prompt: '당신은,',
      options: this.createUiOptions([{ id: 'rest-continue', label: '다음 장소로 향한다.', type: 'continue-run' }]),
    }
    this.publishNarrative()
  }

  endRun(reason) {
    const gained = settleRun(this.runState, this.persistentState, reason)
    if (reason === 'fake-ending') {
      unlockMemory('fake-ending', this.persistentState)
    }
    if (reason === 'death') {
      unlockMemory('first-death', this.persistentState)
    }
    if (reason === 'true-ending') {
      unlockMemory('core-route', this.persistentState)
    }
    savePersistentState(this.persistentState)
    this.runState = createInitialRunState(this.persistentState)
    this.player = this.runState.player
    this.depth = this.runState.totalDepth
    this.currentRoom = null
    this.currentFloor = getFloorByIndex(this.runState.floorIndex)
    this.roomOptions = createRoomOptions(this.runState)
    this.currentEnemy = null
    this.enemySprite.setVisible(false)
    this.intentIndicator.setVisible(false)
    this.enemyBattleHud.setVisible(false)
    this.playerBattleHud.setVisible(false)
    this.background.setTexture(this.currentFloor.backgroundKey)
    this.depthText.setText(this.currentFloor.name)
    this.updateHud()
    this.currentNarrative = {
      ...createLobbyNarrative(this.runState, this.persistentState),
      story: [
        `이번 여정이 끝났다. 영혼의 흔적 ${gained}개가 남았다.`,
        ...createLobbyNarrative(this.runState, this.persistentState).story,
      ],
    }
    this.publishNarrative()
  }

  startBattle() {
    const floor = getFloorByIndex(this.runState.floorIndex)
    this.currentEnemy = this.currentRoom.type === 'boss'
      ? createBossEnemy({ bossId: this.currentRoom.bossId, difficulty: floor.difficulty })
      : createEnemy({
          enemyPool: this.currentRoom.enemyPool,
          totalDepth: this.runState.totalDepth,
          difficulty: floor.difficulty,
        })
    const initiative = this.determineBattleInitiative()
    this.enemySprite.setTexture(this.currentEnemy.textureKey).setVisible(true).setAlpha(1)
    this.hero.setPosition(LAYOUT.heroX, LAYOUT.heroY).setScale(LAYOUT.heroScale)
    this.playerBattleHud.setPosition(LAYOUT.heroX, LAYOUT.heroY + 18)
    this.enemySprite.setPosition(LAYOUT.enemyX, LAYOUT.enemyY).setScale(LAYOUT.enemyScale)
    this.playerBattleHud.setVisible(true)
    this.enemyBattleHud.setVisible(true)
    this.updateHud()
    this.startIdleMotion()
    this.startEnemyIdleMotion()

    if (initiative === 'enemy') {
      this.startEnemyAmbush()
      return
    }

    this.runState.hasStealthApproach = false
    this.currentNarrative = this.createBattleNarrative([
      `당신은 ${this.currentEnemy.name}의 뒤를 기습했습니다! (플레이어 턴)`,
    ])
    this.publishNarrative()
  }

  determineBattleInitiative() {
    if (this.runState.hasStealthApproach || this.player.relics.includes('mist-step')) {
      return 'player'
    }

    if (this.player.relics.includes('broken-clock') && Math.random() < 0.3) {
      return 'player'
    }

    if (this.currentRoom.risk.includes('높음')) {
      return 'enemy'
    }

    return 'player'
  }

  startEnemyAmbush() {
    this.isTransitioning = true
    this.intentIndicator.setVisible(false)
    this.currentNarrative = {
      id: `enemy-ambush-${this.depth}`,
      title: '기습 당함',
      story: [
        `${this.currentEnemy.name}가 어둠 속에서 튀어나와 당신을 먼저 덮쳤습니다! (적 턴)`,
      ],
      prompt: '적의 턴입니다.',
      options: [],
    }
    this.publishNarrative()

    this.time.delayedCall(700, () => {
      const enemyResult = applyEnemyIntent(this.player, this.currentEnemy)
      this.animateEnemyAction(enemyResult)
      this.showCombatFloat(enemyResult)
      this.updateHud()

      this.time.delayedCall(620, () => {
        const ambushMessage = `${this.currentEnemy.name}가 어둠 속에서 튀어나와 당신을 먼저 덮쳤습니다! (적 턴)`
        const log = [ambushMessage, enemyResult.message]
        this.runState.hasStealthApproach = false

        if (this.player.hp <= 0) {
          this.currentNarrative = this.createDefeatNarrative(log)
        } else {
          this.currentNarrative = this.createBattleNarrative(log)
        }

        this.publishNarrative()
        this.isTransitioning = false
      })
    })
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
        log.push(...applyEnemyDrop(this.runState, this.currentEnemy))
        if (this.currentEnemy.memoryId) {
          const memory = unlockMemory(this.currentEnemy.memoryId, this.persistentState)
          if (memory) {
            log.push(`기억 해금: ${memory.title}`)
          }
        }
        savePersistentState(this.persistentState)
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
        '떨어지는 감각 끝에서, 시체더미의 방이 다시 가까워진다.',
      ],
      prompt: '당신은,',
      options: this.createUiOptions([
        {
          id: 'settle-death',
          label: '시체더미에서 다시 눈뜬다.',
          detail: '영혼에 남은 흔적을 붙잡고 시체더미로 돌아간다.',
          type: 'run-end',
          reason: 'death',
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
      result = applyReward(this.player, this.runState, reward)
    }

    const defeatedBoss = this.currentEnemy?.isBoss ? this.currentEnemy.id : null
    if (defeatedBoss) {
      this.runState.defeatedBosses.push(defeatedBoss)
      if (isFinalFloor(this.runState.floorIndex)) {
        advanceRunDepth(this.runState)
      } else {
        moveToNextFloor(this.runState)
      }
      this.currentFloor = getFloorByIndex(this.runState.floorIndex)
    }
    this.roomOptions = createRoomOptions(this.runState)
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
      options: this.createUiOptions([
        {
          id: 'post-reward-continue',
          label: defeatedBoss ? '다음 층으로 오른다.' : '다음 장소로 향한다.',
          detail: defeatedBoss ? '층의 문이 열린다.' : '미궁은 계속 이어진다.',
          type: 'continue-run',
        },
      ]),
    }
    this.publishNarrative()
  }

  playRoomTransition(room) {
    this.tweens.killTweensOf(this.hero)
    this.tweens.killTweensOf(this.playerBattleHud)

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
      targets: this.playerBattleHud,
      x: this.playerBattleHud.x + 46,
      y: this.playerBattleHud.y - 46,
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
    advanceRunDepth(this.runState)
    recordRoomVisit(this.runState, room)
    this.depth = this.runState.totalDepth
    this.currentRoom = room
    this.currentFloor = getFloorByIndex(this.runState.floorIndex)
    this.roomOptions = createRoomOptions(this.runState)

    this.background.setTexture(room.backgroundKey)
    this.background.setScale(1)
    this.hero.setPosition(LAYOUT.heroX, LAYOUT.heroY).setScale(LAYOUT.heroScale)
    this.playerBattleHud.setPosition(LAYOUT.heroX, LAYOUT.heroY + 18)
    this.enemySprite.setVisible(false)
    this.intentIndicator.setVisible(false)
    this.enemyBattleHud.setVisible(false)
    this.playerBattleHud.setVisible(false)

    this.depthText.setText(this.currentFloor.name)
    if (room.type === 'mystery') {
      this.runState.hasStealthApproach = true
    }
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

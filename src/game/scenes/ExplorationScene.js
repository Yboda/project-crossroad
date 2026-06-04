import Phaser from 'phaser'
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../constants'
import { getBackgroundDefinition, resolveBackgroundKey } from '../data/backgrounds'
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
import {
  applyLevelUpReward,
  createLevelUpRewardOptions,
  getLevelText,
  grantBattleExp,
} from '../systems/experienceSystem'
import { applyEnemyDrop, applyReward, createRewardOptions } from '../systems/rewardSystem'
import {
  advanceRunDepth,
  createInitialRunState,
  moveToNextFloor,
  recordRoomVisit,
  selectRunBody,
} from '../systems/runState'
import { loadPersistentState, savePersistentState, settleRun } from '../systems/saveSystem'
import { buyShopItem, createShopInventory, createShopNarrative, createShopScreenNarrative } from '../systems/shopSystem'
import { applyDevPreview, exitDevPreview } from '../dev/devPreview'
import { createRoomOptions } from '../systems/roomGenerator'
import { getRelicById } from '../systems/relicSystem'
import {
  checkCoreRouteUnlocked,
  createFakeEndingNarrative,
  createTrueEndingNarrative,
  unlockMemory,
} from '../systems/storyProgressSystem'
import { unlockSoulNode } from '../systems/soulEngravingSystem'

const LAYOUT = {
  enemyX: 280,
  enemyY: 270,
  enemyScale: 0.8,
}

/** React 전투 UI 오버레이와 맞춘 적/의도 표시 위치 (게임 좌표 = 390×844) */
const COMBAT_LAYOUT = {
  portraitX: GAME_WIDTH / 2,
  portraitY: 200,
  portraitScale: 0.62,
  intentOffsetY: 76,
  /** 1인칭 시점 — 플레이어 피격 연출 위치 (화면 하단 중앙) */
  playerHitX: GAME_WIDTH / 2,
  playerHitY: 498,
  /** 적이 플레이어(카메라) 쪽으로 찌르는 모션 */
  lungeDy: 38,
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
    this.currentShopInventory = null

    this.createWorld()
    this.setupChoiceInput()
    this.setupDevTools()
    this.updateHud()
    this.publishNarrative()
  }

  createWorld() {
    const initialBackgroundKey =
      this.currentNarrative?.layout === 'lobby-main' ? 'background-lobby' : this.currentFloor.backgroundKey
    this.background = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, resolveBackgroundKey(initialBackgroundKey))
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(0)

    this.sceneDimmer = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.18).setOrigin(0).setDepth(1)

    this.enemySprite = this.add.image(LAYOUT.enemyX, LAYOUT.enemyY, 'enemy-wolf').setOrigin(0.5, 1)
    this.enemySprite.setScale(LAYOUT.enemyScale).setVisible(false).setDepth(7)
    this.createEnemyBattleHud()
    this.createIntentIndicator()

    this.overlay = this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.ink, 0)
      .setOrigin(0)
      .setDepth(20)
  }

  applySceneBackground(backgroundKey, { lobby = false } = {}) {
    if (!this.background) {
      return
    }

    if (lobby) {
      if (this.textures.exists('background-lobby')) {
        this.background.setTexture('background-lobby').setDisplaySize(GAME_WIDTH, GAME_HEIGHT).clearTint()
      }
      this.sceneDimmer?.setVisible(false)
      return
    }

    const textureKey = resolveBackgroundKey(backgroundKey)
    if (this.textures.exists(textureKey)) {
      this.background.setTexture(textureKey).setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
    }

    const tone = getBackgroundDefinition(textureKey).explorationTone
    if (tone?.tint) {
      this.background.setTint(tone.tint)
    } else {
      this.background.clearTint()
    }

    this.sceneDimmer?.setVisible(true)
    if (tone?.dimAlpha != null) {
      this.sceneDimmer?.setAlpha(tone.dimAlpha)
    }
  }

  createIntentIndicator() {
    this.intentIndicator = this.add.container(280, 168).setVisible(false).setDepth(8)
    this.intentBadge = this.add
      .rectangle(0, 0, 120, 40, 0x0c0c0f, 0.92)
      .setStrokeStyle(1, 0x8b6d3b, 0.45)
      .setOrigin(0.5)
    this.intentIconFrame = this.add
      .rectangle(-38, 0, 30, 30, 0x1a0a0a, 0.95)
      .setStrokeStyle(1, 0x7f1d1d, 0.55)
      .setOrigin(0.5)
    this.intentIcon = this.add.image(-38, 0, 'intent-attack').setScale(0.68)
    this.intentText = this.add
      .text(12, 0, '0', {
        color: '#e8dcc7',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '15px',
        fontStyle: '700',
      })
      .setOrigin(0.5)

    this.intentLabel = this.add
      .text(0, -26, '다음 행동', {
        color: '#71717a',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: '10px',
        fontStyle: '600',
      })
      .setOrigin(0.5)
      .setVisible(false)

    this.intentIndicator.add([
      this.intentBadge,
      this.intentIconFrame,
      this.intentIcon,
      this.intentText,
      this.intentLabel,
    ])
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

  updateHud() {
    this.updateEnemyBattleHud()
    this.publishRunStatus()
    this.refreshCombatNarrativeMeta()
  }

  refreshCombatNarrativeMeta() {
    if (this.currentNarrative?.layout !== 'combat' || !this.currentEnemy) {
      return
    }

    this.currentNarrative = {
      ...this.currentNarrative,
      combatMeta: this.createCombatMeta(getEnemyIntent(this.currentEnemy)),
    }
    window.dispatchEvent(new CustomEvent('game:narrative', { detail: this.currentNarrative }))
  }

  createRunStatusPayload() {
    return {
      bodyName: this.runState.currentBody?.name ?? '육체 미선택',
      bodyDescription: this.runState.currentBody?.description ?? '',
      floorName: this.currentFloor.name,
      level: this.runState.level,
      exp: this.runState.exp,
      expToNext: this.runState.expToNext,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      mp: this.player.mp,
      maxMp: this.player.maxMp,
      attack: this.player.attack,
      defense: this.player.defense,
      block: this.player.block,
      gold: this.runState.gold,
      memoryShards: this.runState.memoryShards,
      relics: this.player.relics.map((relicId) => getRelicById(relicId)),
      isBodySelected: Boolean(this.runState.currentBody),
    }
  }

  publishRunStatus() {
    window.dispatchEvent(new CustomEvent('game:run-status', { detail: this.createRunStatusPayload() }))
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

  setupDevTools() {
    if (!import.meta.env.DEV) {
      return
    }

    this.devPreviewActive = false
    this.devUiVisible = true

    this.handleDevPreview = (event) => {
      applyDevPreview(this, event.detail?.screenId)
    }
    this.handleDevExitPreview = () => {
      exitDevPreview(this)
    }
    this.handleDevToggleUi = () => {
      this.devUiVisible = !this.devUiVisible
      this.setUiVisibility(this.devUiVisible)
    }

    window.addEventListener('game:dev-preview', this.handleDevPreview)
    window.addEventListener('game:dev-exit-preview', this.handleDevExitPreview)
    window.addEventListener('game:dev-toggle-ui', this.handleDevToggleUi)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener('game:dev-preview', this.handleDevPreview)
      window.removeEventListener('game:dev-exit-preview', this.handleDevExitPreview)
      window.removeEventListener('game:dev-toggle-ui', this.handleDevToggleUi)
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
      layout: 'exploration',
      story: room.story,
      prompt: room.prompt ?? '당신은,',
      options: this.createUiOptions(room.options ?? this.createTravelChoices()),
    }
  }

  createRestNarrative() {
    return {
      id: `rest-${this.runState.totalDepth}`,
      layout: 'exploration',
      story: [
        '꺼져가는 모닥불이 벽에 긴 그림자를 만든다. 숨소리만큼은 이 공간에서 유일하게 규칙적인 소리다.',
        '잠깐의 휴식은 이 미궁에서 허락되는 가장 수상한 친절이다. 오래 머물수록 어둠도 당신을 기억할 것이다.',
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
      layout: 'exploration',
      story: [
        room.story[0],
        `${room.story[1] ?? ''} 당신은 무기 손잡이를 고쳐 쥔다. 이번 전투에서 살아남는다면, 분명 조금 더 강해질 것이다.`.trim(),
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
      layout: 'exploration',
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
      layout: 'combat',
      title: `${this.currentEnemy.name}와의 전투`,
      story: log,
      prompt: '당신의 턴입니다.',
      options: this.createUiOptions(getBattleActions(this.player, this.currentEnemy)),
      combatMeta: this.createCombatMeta(intent),
    }
  }

  createCombatMeta(intent = getEnemyIntent(this.currentEnemy)) {
    return {
      enemyName: this.currentEnemy?.name ?? '적',
      enemyKind: this.currentEnemy?.tags?.[0] ?? '적',
      enemyHp: this.currentEnemy?.hp ?? 0,
      enemyMaxHp: this.currentEnemy?.maxHp ?? 1,
      enemyBlock: this.currentEnemy?.block ?? 0,
      intentType: intent?.type ?? 'attack',
      intentValue: intent?.value ?? 0,
      intentDescription: intent?.description ?? '',
    }
  }

  buildBattleStoryLines(log = [], intentDescription) {
    return [
      ...log,
      `당신: HP ${this.player.hp}/${this.player.maxHp} · MP ${this.player.mp}/${this.player.maxMp} · 방어도 ${this.player.block}`,
      `${this.currentEnemy.name}: HP ${this.currentEnemy.hp}/${this.currentEnemy.maxHp} · 방어도 ${this.currentEnemy.block}`,
      `적의 다음 행동: ${intentDescription}`,
    ]
  }

  filterVictoryLogLines(log = []) {
    return log.filter((line) => {
      if (!line) return false
      if (/경험치 \+/.test(line)) return true
      if (/기억 해금:/.test(line)) return true
      if (/골드 .*얻었다/.test(line)) return true
      if (/영혼의 흔적/.test(line)) return true
      if (/핵의 파편/.test(line)) return true
      return false
    })
  }

  buildVictoryStoryLines(log = []) {
    const defeatLine = `${this.currentEnemy.name}가 어둠 속으로 쓰러진다.`
    const aftermathLine = '숨을 고르는 사이, 몸 안쪽에서 조금 더 깊은 힘이 깨어나는 것이 느껴진다.'
    const rewardLines = this.filterVictoryLogLines(log)

    return [defeatLine, aftermathLine, ...rewardLines]
  }

  createSkillNarrative() {
    const intent = getEnemyIntent(this.currentEnemy)
    return {
      id: `skill-select-${this.depth}-${this.player.mp}-${this.currentEnemy.hp}`,
      layout: 'combat',
      title: '스킬 선택',
      story: [`MP ${this.player.mp}/${this.player.maxMp} — 사용할 스킬을 고르세요.`],
      prompt: '스킬을 선택하세요.',
      options: this.createUiOptions(getSkillActions(this.player, this.currentEnemy)),
      combatMeta: this.createCombatMeta(intent),
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

    if (this.currentNarrative?.layout === 'combat') {
      this.applyCombatIntentStyle(intent)
    } else {
      this.applyDefaultIntentStyle()
    }

    this.syncEnemyAttachedUi()
    this.intentIndicator.setVisible(true)
  }

  applyDefaultIntentStyle() {
    this.intentBadge.setSize(88, 42)
    this.intentBadge.setFillStyle(0x111827, 0.92)
    this.intentBadge.setStrokeStyle(1, COLORS.gold, 0.42)
    this.intentIconFrame.setVisible(false)
    this.intentLabel.setVisible(false)
    this.intentIcon.setPosition(-22, 0).setScale(0.66)
    this.intentText.setPosition(10, 0).setFontSize(18).setColor('#f7efe0')
  }

  applyCombatIntentStyle(intent) {
    const styles = {
      attack: { frame: 0x7f1d1d, fill: 0x120808, border: 0x5c2020 },
      block: { frame: 0x3b5998, fill: 0x0a1020, border: 0x2a4a7a },
      buff: { frame: 0x8a6b32, fill: 0x1a1510, border: 0x4a3b2c },
    }
    const style = styles[intent.type] ?? styles.attack

    this.intentBadge.setSize(124, 42)
    this.intentBadge.setFillStyle(style.fill, 0.94)
    this.intentBadge.setStrokeStyle(1.5, style.border, 0.75)
    this.intentIconFrame.setVisible(true)
    this.intentIconFrame.setFillStyle(0x090909, 0.98)
    this.intentIconFrame.setStrokeStyle(1, style.frame, 0.85)
    this.intentLabel.setVisible(true)
    this.intentIcon.setPosition(-38, 0).setScale(0.62)
    this.intentText.setPosition(16, 0).setFontSize(15).setColor('#e8dcc7')
  }

  syncEnemyAttachedUi() {
    if (!this.enemySprite?.visible) {
      return
    }

    if (this.currentNarrative?.layout === 'combat') {
      this.intentIndicator.setPosition(
        COMBAT_LAYOUT.portraitX,
        COMBAT_LAYOUT.portraitY - COMBAT_LAYOUT.intentOffsetY,
      )
      return
    }

    this.intentIndicator.setPosition(this.enemySprite.x, this.enemySprite.y - 142)
    this.enemyBattleHud.setPosition(this.enemySprite.x, this.enemySprite.y + 22)
  }

  applyCombatEnemyLayout() {
    this.enemySprite
      .setPosition(COMBAT_LAYOUT.portraitX, COMBAT_LAYOUT.portraitY)
      .setOrigin(0.5, 1)
      .setScale(COMBAT_LAYOUT.portraitScale)
  }

  syncCombatPresentation() {
    const inCombat = this.currentNarrative?.layout === 'combat' && Boolean(this.currentEnemy)

    if (inCombat) {
      this.enemySprite.setVisible(true)
      this.enemyBattleHud.setVisible(false)
      this.applyCombatEnemyLayout()
      this.updateIntentIndicator()
      return
    }

    if (!this.currentEnemy) {
      this.enemySprite.setVisible(false)
      this.intentIndicator.setVisible(false)
      this.enemyBattleHud.setVisible(false)
    }
  }

  createVictoryNarrative(log = []) {
    return {
      id: `victory-${this.depth}`,
      layout: 'victory',
      title: '전투 승리',
      story: this.buildVictoryStoryLines(log),
      prompt: '보상을 하나 선택하세요.',
      options: this.createUiOptions(createRewardOptions(this.player, this.currentEnemy)),
    }
  }

  createLevelUpNarrative(expResult, victoryLog = []) {
    return {
      id: `level-up-${this.runState.level}-${this.depth}`,
      layout: 'level-up',
      title: '육체 적응',
      story: ['이 육체의 근육과 호흡이 조금 더 선명해진다. 낯선 육체가 조금씩 익숙해지고 있다.'],
      prompt: '강화할 감각을 선택하세요.',
      levelMeta: {
        levelText: getLevelText(expResult.newLevel),
        gainedExp: expResult.gained,
      },
      options: this.createUiOptions(createLevelUpRewardOptions()),
      pendingVictoryLog: victoryLog,
    }
  }

  showVictoryAfterLevelUp() {
    const log = this.pendingVictoryLog ?? []
    this.pendingVictoryLog = null
    this.currentNarrative = this.createVictoryNarrative(log)
    this.publishNarrative()
  }

  createRelicModal(relicId) {
    if (!relicId) {
      return null
    }

    const relic = getRelicById(relicId)
    return {
      title: `${relic.name} 획득`,
      story: relic.description,
      relic,
    }
  }

  syncLobbyBackground() {
    if (!this.background) {
      return
    }

    const inLobby = this.currentNarrative?.layout === 'lobby-main'
    this.overlay?.setAlpha(0)

    if (inLobby) {
      this.applySceneBackground('background-lobby', { lobby: true })
      return
    }

    const backgroundKey = this.currentRoom?.backgroundKey ?? this.currentFloor.backgroundKey
    this.applySceneBackground(backgroundKey)
  }

  publishNarrative() {
    this.syncLobbyBackground()
    this.syncCombatPresentation()
    if (this.currentNarrative?.layout === 'combat' && this.currentEnemy) {
      this.currentNarrative = {
        ...this.currentNarrative,
        combatMeta: this.createCombatMeta(getEnemyIntent(this.currentEnemy)),
      }
    }
    window.dispatchEvent(new CustomEvent('game:narrative', { detail: this.currentNarrative }))
  }

  setUiVisibility(visible) {
    window.dispatchEvent(new CustomEvent('game:ui-visibility', { detail: { visible } }))
  }

  startEnemyIdleMotion() {
    this.tweens.killTweensOf(this.enemySprite)
    this.tweens.killTweensOf(this.intentIndicator)
    this.tweens.killTweensOf(this.enemyBattleHud)

    const baseScale =
      this.currentNarrative?.layout === 'combat' ? COMBAT_LAYOUT.portraitScale : LAYOUT.enemyScale

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
      scaleX: baseScale + 0.04,
      scaleY: baseScale - 0.04,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    })
  }

  animatePlayerAttack() {
    const inCombat = this.currentNarrative?.layout === 'combat'

    this.tweens.add({
      targets: this.enemySprite,
      x: inCombat ? this.enemySprite.x : this.enemySprite.x + 10,
      y: inCombat ? this.enemySprite.y - 16 : this.enemySprite.y,
      alpha: 0.72,
      duration: 90,
      yoyo: true,
      ease: 'Sine.easeInOut',
    })
  }

  flashCombatPlayerHit() {
    if (this.combatHitFlash?.active) {
      return
    }

    this.combatHitFlash = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x7f1d1d, 0)
      .setDepth(19)

    this.tweens.add({
      targets: this.combatHitFlash,
      alpha: 0.2,
      duration: 70,
      yoyo: true,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.combatHitFlash?.destroy()
        this.combatHitFlash = null
      },
    })
  }

  animateEnemyAction(result) {
    if (result.target === 'player') {
      const inCombat = this.currentNarrative?.layout === 'combat'
      const startX = this.enemySprite.x
      const startY = this.enemySprite.y
      const baseScale = COMBAT_LAYOUT.portraitScale

      this.tweens.add({
        targets: this.enemySprite,
        x: inCombat ? startX : startX - 20,
        y: inCombat ? startY + COMBAT_LAYOUT.lungeDy : startY,
        scaleX: inCombat ? baseScale * 1.08 : this.enemySprite.scaleX,
        scaleY: inCombat ? baseScale * 1.08 : this.enemySprite.scaleY,
        duration: 130,
        yoyo: true,
        ease: 'Sine.easeInOut',
      })

      if (inCombat) {
        this.flashCombatPlayerHit()
      }

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
    const inCombat = this.currentNarrative?.layout === 'combat'
    const colorByType = {
      damage: '#ff6b5f',
      block: '#77b7ff',
      buff: '#ffd166',
      neutral: '#f7efe0',
    }

    let floatX
    let floatY
    if (result.target === 'player') {
      floatX = COMBAT_LAYOUT.playerHitX
      floatY = COMBAT_LAYOUT.playerHitY
    } else if (result.target === 'enemy') {
      floatX = this.enemySprite.x
      floatY = this.enemySprite.y - 100
    } else {
      floatX = COMBAT_LAYOUT.playerHitX
      floatY = COMBAT_LAYOUT.playerHitY
    }

    const isPlayerHit = result.target === 'player'
    const text = this.add
      .text(floatX, floatY, result.floatText, {
        color: colorByType[result.floatType] ?? '#f7efe0',
        fontFamily: 'system-ui, Segoe UI, sans-serif',
        fontSize: isPlayerHit ? '30px' : '26px',
        fontStyle: '800',
        stroke: '#080b12',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(8)
      .setScale(isPlayerHit ? 1.15 : 1)

    this.tweens.add({
      targets: text,
      y: text.y - (isPlayerHit ? 48 : 36),
      alpha: 0,
      duration: isPlayerHit ? 720 : 620,
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
    if (this.devPreviewActive) {
      return
    }

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

    if (option.type === 'open-shop') {
      this.openShopScreen()
      return
    }

    if (option.type === 'close-shop') {
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

    if (option.type === 'level-up-reward') {
      const result = applyLevelUpReward(this.player, option.reward)
      this.updateHud()
      this.currentNarrative = {
        id: `level-up-result-${this.runState.level}`,
        layout: 'exploration',
        story: [
          result,
          '육체가 조금 더 익숙해진다. 다음 보상을 고를 때까지, 미궁의 공기는 차분하게 가라앉는다.',
        ],
        prompt: '당신은,',
        options: this.createUiOptions([
          {
            id: 'continue-after-level-up',
            label: '다음 보상을 고른다.',
            detail: '전투 보상으로 이어진다.',
            type: 'continue-after-level-up',
          },
        ]),
      }
      this.publishNarrative()
      return
    }

    if (option.type === 'continue-after-level-up') {
      this.showVictoryAfterLevelUp()
      return
    }

    if (option.type === 'reward') {
      this.collectReward(option.reward)
      return
    }

    if (option.type === 'message') {
      const responseLines = Array.isArray(option.response) ? option.response : [option.response]
      this.currentNarrative = {
        id: `message-${option.id}-${this.depth}`,
        layout: this.currentRoom?.type === 'shop' ? 'shop-entry' : 'exploration',
        story: responseLines,
        prompt: '당신은,',
        options: this.createUiOptions(
          this.currentRoom?.type === 'shop'
            ? [
                {
                  id: 'shop-talk-back',
                  label: '상인 앞에 선다.',
                  detail: '상점 선택지로 돌아간다.',
                  type: 'close-shop',
                },
              ]
            : this.createTravelChoices(),
        ),
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
    const relicWasOwned = option.result?.relic ? this.player.relics.includes(option.result.relic) : false
    const messages = applyEventResult(this.player, this.runState, option.result)
    this.updateHud()
    const [mainResult, ...restResults] = messages
    this.currentNarrative = {
      id: `event-result-${option.id}`,
      layout: 'exploration',
      story: [
        mainResult ?? '무언가가 조용히 바뀌었다.',
        restResults.length ? restResults.join(' ') : '미궁은 당신의 선택을 기억한 채, 다음 길을 기다린다.',
      ],
      modal: option.result?.relic && !relicWasOwned ? this.createRelicModal(option.result.relic) : null,
      prompt: '당신은,',
      options: this.createUiOptions([{ id: 'event-continue', label: '다음 장소로 향한다.', detail: '미궁은 계속 이어진다.', type: 'continue-run' }]),
    }
    this.publishNarrative()
  }

  resolveShopBuy(item) {
    const canAfford = this.runState.gold >= item.price
    const relicWasOwned = item.result?.relic ? this.player.relics.includes(item.result.relic) : false
    const messages = buyShopItem(this.player, this.runState, item)

    if (canAfford && item.result?.relic && !relicWasOwned && this.currentShopInventory) {
      this.currentShopInventory = this.currentShopInventory.filter((shopItem) => shopItem.id !== item.id)
    }

    this.updateHud()
    this.currentNarrative = {
      ...this.createCurrentShopScreen(messages),
      modal: canAfford && item.result?.relic && !relicWasOwned ? this.createRelicModal(item.result.relic) : null,
    }
    this.publishNarrative()
  }

  openShopScreen(messages = []) {
    this.currentNarrative = this.createCurrentShopScreen(messages)
    this.publishNarrative()
  }

  createCurrentShopScreen(messages = []) {
    if (!this.currentShopInventory) {
      this.currentShopInventory = createShopInventory(this.player, this.runState)
    }

    return createShopScreenNarrative(this.runState, this.currentShopInventory, messages)
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
      layout: 'exploration',
      story: [
        restType === 'hp'
          ? '뜨거운 숨이 천천히 가라앉는다. 상처가 아물 때마다, 몸은 조금 더 무거워진다.'
          : '마력의 파동이 가슴 안에서 잦아든다. 손끝의 떨림이 사라지고, 집중할 여백이 돌아온다.',
        '불꽃은 여전히 꺼지지 않는다. 이곳을 떠나면, 다시 어둠만이 길을 안내할 것이다.',
      ],
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
    this.currentShopInventory = null
    this.currentFloor = getFloorByIndex(this.runState.floorIndex)
    this.roomOptions = createRoomOptions(this.runState)
    this.currentEnemy = null
    this.enemySprite.setVisible(false)
    this.intentIndicator.setVisible(false)
    this.enemyBattleHud.setVisible(false)
    this.applySceneBackground(this.currentFloor.backgroundKey)
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
    this.enemyBattleHud.setVisible(false)
    this.applyCombatEnemyLayout()
    this.updateHud()
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
      layout: 'combat',
      title: '기습 당함',
      story: [
        `${this.currentEnemy.name}가 어둠 속에서 튀어나와 당신을 먼저 덮쳤습니다! (적 턴)`,
      ],
      prompt: '적의 턴입니다.',
      options: [],
      combatMeta: this.createCombatMeta(getEnemyIntent(this.currentEnemy)),
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
    this.animatePlayerAttack()
    this.showCombatFloat(playerResult)
    this.updateHud()

    this.time.delayedCall(520, () => {
      if (this.currentEnemy.hp <= 0) {
        this.animateEnemyDefeat()
        log.push(...applyEnemyDrop(this.runState, this.currentEnemy))
        const expResult = grantBattleExp(this.runState, this.currentEnemy)
        if (expResult.gained > 0) {
          log.push(`경험치 +${expResult.gained}`)
        }
        if (this.currentEnemy.memoryId) {
          const memory = unlockMemory(this.currentEnemy.memoryId, this.persistentState)
          if (memory) {
            log.push(`기억 해금: ${memory.title}`)
          }
        }
        savePersistentState(this.persistentState)
        this.updateHud()
        if (expResult.leveledUp) {
          this.pendingVictoryLog = log
          this.currentNarrative = this.createLevelUpNarrative(expResult, log)
        } else {
          this.currentNarrative = this.createVictoryNarrative(log)
        }
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

  buildDefeatStoryLines() {
    return [
      '무릎이 꺾이고 시야가 어둠에 잠긴다. 아직은 더 깊은 곳으로 나아갈 힘이 부족했다.',
      '떨어지는 감각 끝에서, 시체더미의 방이 다시 가까워진다.',
    ]
  }

  createDefeatNarrative(log = []) {
    return {
      id: `defeat-${this.depth}`,
      layout: 'death',
      title: '쓰러짐',
      story: this.buildDefeatStoryLines(),
      deathMeta: {
        tracesThisRun: this.runState.memoryShards,
      },
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
    const relicWasOwned = reward.type === 'relic' ? this.player.relics.includes(reward.value) : false

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
    this.currentNarrative = {
      id: `reward-result-${this.depth}`,
      layout: 'exploration',
      story: [
        result,
        '이제 같은 길도 이전과는 다르게 느껴진다. 더 깊은 곳으로 향할 준비가 됐다.',
      ],
      modal: reward.type === 'relic' && !relicWasOwned ? this.createRelicModal(reward.value) : null,
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
    this.currentShopInventory = null
    this.currentFloor = getFloorByIndex(this.runState.floorIndex)
    this.roomOptions = createRoomOptions(this.runState)

    this.applySceneBackground(room.backgroundKey)
    this.background.setScale(1)
    this.enemySprite.setVisible(false)
    this.intentIndicator.setVisible(false)
    this.enemyBattleHud.setVisible(false)
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
      },
    })
  }
}

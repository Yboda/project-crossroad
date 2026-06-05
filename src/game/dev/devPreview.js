import { roomTypes } from '../data/roomTypes'
import { bossTemplates, createBossEnemy, createEnemy } from '../data/enemies'
import { createEventNarrative } from '../systems/eventSystem'
import {
  createBodySelectNarrative,
  createLobbyNarrative,
  createSoulNodeNarrative,
} from '../systems/lobbySystem'
import { createShopInventory, createShopNarrative, createShopScreenNarrative } from '../systems/shopSystem'
import { selectRunBody } from '../systems/runState'
const DEV_MOCK_ROOM = {
  instanceId: 'dev-room',
  id: 'battle',
  type: 'battle',
  label: roomTypes.battle.label,
  risk: roomTypes.battle.risk,
  backgroundKey: roomTypes.battle.backgroundKey,
  story: [...roomTypes.battle.story],
  prompt: roomTypes.battle.prompt,
}

export function applyDevPreview(scene, screenId, options = {}) {
  scene.devPreviewActive = true
  scene.isTransitioning = false
  scene.overlay?.setAlpha(0)

  if (options.enemyId) {
    scene.devPreviewEnemyId = options.enemyId
  } else if (!scene.devPreviewEnemyId) {
    scene.devPreviewEnemyId = 'starving-wolf'
  }

  switch (screenId) {
    case 'lobby-main':
      scene.currentRoom = null
      scene.currentEnemy = null
      scene.currentShopInventory = null
      scene.currentNarrative = createLobbyNarrative(scene.runState, scene.persistentState)
      break

    case 'body-select':
      scene.currentRoom = null
      scene.currentEnemy = null
      scene.currentNarrative = createBodySelectNarrative(scene.runState)
      break

    case 'soul-nodes':
      scene.currentRoom = null
      scene.currentEnemy = null
      scene.currentNarrative = createSoulNodeNarrative(scene.persistentState)
      break

    case 'exploration-travel':
      ensureDevRunActive(scene)
      scene.currentRoom = null
      scene.currentEnemy = null
      scene.roomOptions = scene.roomOptions?.length ? scene.roomOptions : buildDevRoomOptions()
      scene.currentNarrative = {
        id: 'dev-exploration-travel',
        layout: 'exploration',
        story: [
          '길이 세 갈래로 갈라진다. 각 방향마다 다른 냄새와 소리가 새어 나온다.',
          '오래 머물수록 어둠이 당신의 발자국을 따라잡을 것이다. 어느 쪽으로 갈지 정해야 한다.',
        ],
        prompt: '당신은,',
        options: scene.createUiOptions(scene.createTravelChoices()),
      }
      break

    case 'exploration-battle-intro':
      ensureDevRunActive(scene)
      scene.currentRoom = DEV_MOCK_ROOM
      scene.currentEnemy = null
      scene.currentNarrative = scene.createBattleIntroNarrative(DEV_MOCK_ROOM)
      break

    case 'exploration-rest':
      ensureDevRunActive(scene)
      scene.currentRoom = { ...roomTypes.rest, instanceId: 'dev-rest', type: 'rest' }
      scene.currentEnemy = null
      scene.currentNarrative = scene.createRestNarrative()
      break

    case 'exploration-event':
      ensureDevRunActive(scene)
      scene.currentRoom = { ...roomTypes.event, instanceId: 'dev-event', type: 'event', eventId: 'old-altar' }
      scene.currentEnemy = null
      scene.currentNarrative = createEventNarrative('old-altar', scene.player)
      break

    case 'exploration-relic-modal':
      ensureDevRunActive(scene)
      scene.currentRoom = null
      scene.currentEnemy = null
      scene.currentNarrative = {
        id: 'dev-relic-modal',
        layout: 'exploration',
        story: ['낡은 제단에서 손을 떼자, 손바닥에 낯선 문양이 새겨진다.'],
        prompt: '당신은,',
        modal: scene.createRelicModal('warm-ember'),
        options: scene.createUiOptions([
          { id: 'dev-continue', label: '다음 장소로 향한다.', detail: '미궁은 계속 이어진다.', type: 'continue-run' },
        ]),
      }
      break

    case 'combat':
      applyDevCombatPreview(scene, { openSkillPanel: false })
      break

    case 'combat-skills':
      applyDevCombatPreview(scene, { openSkillPanel: true })
      break

    case 'victory':
      applyDevVictoryPreview(scene, { withRelic: false })
      break

    case 'victory-relic':
      applyDevVictoryPreview(scene, { withRelic: true, relicId: 'broken-clock' })
      break

    case 'victory-boss-relic':
      applyDevVictoryPreview(scene, { withRelic: true, forceBoss: true })
      break

    case 'level-up':
      ensureDevRunActive(scene)
      scene.currentRoom = DEV_MOCK_ROOM
      scene.currentEnemy = null
      scene.enemySprite.setVisible(false)
      scene.intentIndicator.setVisible(false)
      scene.currentNarrative = scene.createLevelUpNarrative({ gained: 12, newLevel: 2, leveledUp: true })
      break

    case 'death':
      ensureDevRunActive(scene)
      scene.runState.memoryShards = 4
      scene.currentRoom = null
      scene.currentEnemy = null
      scene.enemySprite.setVisible(false)
      scene.intentIndicator.setVisible(false)
      scene.currentNarrative = scene.createDefeatNarrative()
      break

    case 'shop-entry':
      ensureDevRunActive(scene)
      scene.runState.gold = 48
      scene.currentRoom = { ...roomTypes.shop, instanceId: 'dev-shop', type: 'shop' }
      scene.currentEnemy = null
      scene.currentNarrative = createShopNarrative(scene.player, scene.runState)
      break

    case 'shop':
      ensureDevRunActive(scene)
      scene.runState.gold = 48
      scene.currentRoom = { ...roomTypes.shop, instanceId: 'dev-shop', type: 'shop' }
      scene.currentEnemy = null
      scene.currentShopInventory = createShopInventory(scene.player, scene.runState)
      scene.currentNarrative = createShopScreenNarrative(scene.runState, scene.currentShopInventory)
      break

    case 'character-modal':
      ensureDevRunActive(scene)
      window.dispatchEvent(new CustomEvent('game:dev-ui', { detail: { characterModal: true } }))
      if (!scene.currentNarrative) {
        applyDevPreview(scene, 'exploration-travel')
        return
      }
      break

    default:
      console.warn(`[dev] unknown screen: ${screenId}`)
      return
  }

  scene.syncCombatPresentation?.()
  scene.publishNarrative()
  scene.updateHud()
  window.dispatchEvent(
    new CustomEvent('game:dev-preview-state', {
      detail: { active: true, screenId, enemyId: scene.devPreviewEnemyId },
    }),
  )
}

export function exitDevPreview(scene) {
  scene.devPreviewActive = false
  scene.currentEnemy = null
  scene.enemySprite?.setVisible(false)
  scene.intentIndicator?.setVisible(false)
  scene.currentNarrative = createLobbyNarrative(scene.runState, scene.persistentState)
  scene.publishNarrative()
  scene.updateHud()
  window.dispatchEvent(new CustomEvent('game:dev-preview-state', { detail: { active: false } }))
}

function ensureDevRunActive(scene) {
  if (!scene.runState.currentBody && scene.runState.bodyCandidates[0]) {
    selectRunBody(scene.runState, scene.runState.bodyCandidates[0], scene.persistentState)
  }
  scene.player = scene.runState.player
  scene.player.hp = Math.min(scene.player.maxHp, 24)
  scene.player.mp = Math.min(scene.player.maxMp, 4)
  scene.player.block = 2
  scene.runState.gold = scene.runState.gold || 42
  if (!scene.player.relics.includes('warm-ember')) {
    scene.player.relics.push('warm-ember')
  }
}

function createDevEnemy(scene, enemyId = scene.devPreviewEnemyId) {
  const id = enemyId ?? 'starving-wolf'
  if (bossTemplates[id]) {
    return createBossEnemy({ bossId: id, difficulty: scene.currentFloor?.difficulty ?? {} })
  }
  return createEnemy({
    enemyId: id,
    totalDepth: scene.runState.totalDepth,
    difficulty: scene.currentFloor?.difficulty ?? { hp: 0, attack: 0 },
  })
}

function applyDevCombatPreview(scene, { openSkillPanel = false } = {}) {
  ensureDevRunActive(scene)
  scene.currentRoom = DEV_MOCK_ROOM
  scene.currentEnemy = createDevEnemy(scene)
  showDevEnemy(scene)
  scene.player.mp = Math.max(scene.player.mp, openSkillPanel ? 4 : scene.player.mp)
  scene.setCombatLog([
    `${scene.currentEnemy.name}가 당신을 노려본다.`,
    openSkillPanel ? '스킬 패널 미리보기.' : '당신은 무기 손잡이를 고쳐 쥔다.',
  ])
  scene.currentNarrative = scene.createBattleNarrative()
  if (openSkillPanel) {
    scene.currentNarrative = {
      ...scene.currentNarrative,
      combatMeta: { ...scene.currentNarrative.combatMeta, openSkillPanel: true },
    }
  }
}

function applyDevVictoryPreview(scene, { withRelic = false, relicId = 'broken-clock', forceBoss = false } = {}) {
  ensureDevRunActive(scene)
  scene.currentRoom = DEV_MOCK_ROOM
  if (forceBoss && !bossTemplates[scene.devPreviewEnemyId]) {
    scene.devPreviewEnemyId = 'corpse-butcher'
  }
  scene.currentEnemy = createDevEnemy(scene)
  scene.player.relics = withRelic ? [] : scene.player.relics
  scene.enemySprite.setVisible(false)
  scene.intentIndicator.setVisible(false)
  const isBoss = scene.currentEnemy.isBoss
  scene.currentNarrative = scene.createVictoryNarrative(
    isBoss
      ? ['경험치 +28', '골드 32을 얻었다.', '영혼의 흔적 4개를 얻었다.']
      : ['경험치 +12', '골드 14을 얻었다.', '영혼의 흔적 1개를 얻었다.'],
    withRelic ? relicId : undefined,
  )
}

function showDevEnemy(scene) {
  const enemy = scene.currentEnemy
  scene.enemySprite.setTexture(enemy.textureKey).setVisible(true).setAlpha(1)
  scene.startEnemyIdleMotion?.()
}

function buildDevRoomOptions() {
  return [
    { instanceId: 'dev-a', ...roomTypes.battle, type: 'battle' },
    { instanceId: 'dev-b', ...roomTypes.event, type: 'event', eventId: 'old-altar' },
    { instanceId: 'dev-c', ...roomTypes.shop, type: 'shop' },
  ]
}

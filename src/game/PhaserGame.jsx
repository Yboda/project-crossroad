import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Phaser from 'phaser'
import {
  Ghost,
  Flame,
  Hexagon,
  Coins,
  Heart,
  Battery,
  Sword,
  Shield,
  ChevronLeft,
  X,
  Sparkles,
  ScrollText,
  Lock,
  Skull,
  Zap,
  Menu,
  ChevronsUp,
} from 'lucide-react'
import { createGameConfig } from './config'
import { initGameScrollReveal } from './scrollReveal'
import { formatSkillPreviewStat, getSkillActions, getSkillPreview } from './systems/combatSystem'
import { getKnownSkills } from './systems/skillSystem'
import { getRelicById } from './systems/relicSystem'
import lobbyBackgroundUrl from '../assets/backgrounds/lobby-1.png'
import basicBackgroundUrl from '../assets/backgrounds/basic.jpg'
import { DevToolsPanel } from './dev/DevToolsPanel'
import { getRelicImageSrc } from './data/relicAssets'
import {
  getStoryEmphasisClass,
  getStoryLineTier,
  getStoryLineTierClass,
  normalizeStoryLine,
  parseInlineStoryEmphasis,
} from './utils/storyText'

const LOBBY_LAYOUTS = new Set(['lobby-main', 'body-select', 'soul-nodes'])
const FULLSCREEN_LAYOUTS = new Set(['victory', 'death', 'level-up'])

export function PhaserGame() {
  const frameRef = useRef(null)
  const containerRef = useRef(null)
  const storyRef = useRef(null)
  const gameRef = useRef(null)
  const [narrative, setNarrative] = useState(null)
  const [isUiVisible, setIsUiVisible] = useState(true)
  const [runStatus, setRunStatus] = useState(null)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  useEffect(() => {
    const handleNarrative = (event) => {
      const detail = event.detail
      setNarrative(detail)
      requestAnimationFrame(() => {
        if (detail?.layout === 'combat') return
        if (storyRef.current) storyRef.current.scrollTop = 0
      })
    }
    const handleVisibility = (event) => setIsUiVisible(event.detail.visible)
    const handleRunStatus = (event) => setRunStatus(event.detail)

    window.addEventListener('game:narrative', handleNarrative)
    window.addEventListener('game:ui-visibility', handleVisibility)
    window.addEventListener('game:run-status', handleRunStatus)
    return () => {
      window.removeEventListener('game:narrative', handleNarrative)
      window.removeEventListener('game:ui-visibility', handleVisibility)
      window.removeEventListener('game:run-status', handleRunStatus)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return undefined
    gameRef.current = new Phaser.Game(createGameConfig(containerRef.current))
    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  useEffect(() => initGameScrollReveal(frameRef.current), [])
  useEffect(() => {
    if (!runStatus?.isBodySelected) setIsStatusOpen(false)
  }, [runStatus?.isBodySelected])

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined
    const handleDevUi = (event) => {
      if (event.detail?.characterModal) setIsStatusOpen(true)
    }
    window.addEventListener('game:dev-ui', handleDevUi)
    return () => window.removeEventListener('game:dev-ui', handleDevUi)
  }, [])

  const handleChoice = (optionId) => {
    window.dispatchEvent(new CustomEvent('game:choice', { detail: { optionId } }))
  }

  const showTopHud =
    runStatus?.isBodySelected &&
    narrative &&
    !LOBBY_LAYOUTS.has(narrative.layout) &&
    !FULLSCREEN_LAYOUTS.has(narrative.layout)

  const hidePhaserCanvas = !narrative || narrative.layout === 'lobby-main'

  return (
    <section className="game-frame" ref={frameRef} aria-label="Game canvas">
      <div
        className="game-canvas"
        ref={containerRef}
        style={{ visibility: hidePhaserCanvas ? 'hidden' : 'visible' }}
      />
      {showTopHud ? (
        <TopHUD
          status={runStatus}
          onOpen={() => setIsStatusOpen(true)}
          onMenu={() => {}}
        />
      ) : null}
      <StoryPanel
        frameRef={frameRef}
        narrative={narrative}
        isVisible={isUiVisible}
        storyRef={storyRef}
        runStatus={runStatus}
        onChoice={handleChoice}
      />
      {isStatusOpen && frameRef.current ? (
        <CharacterInfoModal container={frameRef.current} status={runStatus} onClose={() => setIsStatusOpen(false)} />
      ) : null}
      <DevToolsPanel />
    </section>
  )
}

/* ── Shared UI ── */

function StatBar({ value, max, colorClass = 'hp' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="m-stat-bg">
      <div className={`m-stat-fill ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function BlockShieldBadge({ value, className = '' }) {
  const block = Math.max(0, Number(value) || 0)
  if (block <= 0) return null

  return (
    <div className={`combat-block-badge ${className}`.trim()} aria-label={`방어도 ${block}`}>
      <Shield className="combat-block-badge-icon" size={36} strokeWidth={1.5} aria-hidden="true" />
      <span className="combat-block-badge-val">{block}</span>
    </div>
  )
}

function GothicButton({ children, onClick, variant = 'primary', disabled = false, icon: Icon, className = '', style }) {
  return (
    <button
      className={`gothic-btn g-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      style={style}
    >
      {Icon ? <Icon size={16} className="g-icon" /> : null}
      {children}
    </button>
  )
}

function GothicPanel({ children, className = '' }) {
  return <div className={`gothic-panel ${className}`}>{children}</div>
}

function getChoiceButtonVariant(option) {
  if (option.variant === 'floor-ascend') {
    return 'floor-ascend'
  }
  if (option.variant === 'primary') {
    return 'primary'
  }
  if (option.type === 'continue-run' && option.label?.includes('떠난')) {
    return 'ghost'
  }
  return 'secondary'
}

function ChoiceList({ narrative, isVisible, onChoice, variant = 'primary' }) {
  return (
    <div className="ui-choice-list">
      {narrative.options.map((option) => {
        const buttonVariant = getChoiceButtonVariant(option)
        const isFloorAscend = buttonVariant === 'floor-ascend'
        return (
          <GothicButton
            key={option.id}
            variant={buttonVariant}
            icon={isFloorAscend ? ChevronsUp : undefined}
            className={isFloorAscend ? 'floor-ascend-btn' : ''}
            disabled={option.locked || !isVisible}
            onClick={() => onChoice(option.id)}
          >
            {option.locked ? `잠김 — ${option.label}` : option.label}
          </GothicButton>
        )
      })}
    </div>
  )
}

/* ── Top HUD ── */

function TopHUD({ status, onOpen, onMenu }) {
  const floorNumber = status.floorNumber ?? 1

  return (
    <div className="top-hud">
      <div className="top-hud-row top-hud-row-head">
        <div className="top-hud-floor">
          <span className="top-hud-floor-dot" aria-hidden="true" />
          <span>{`${floorNumber}F · ${status.floorName}`}</span>
        </div>
        <button className="top-hud-menu-btn" type="button" aria-label="메뉴" onClick={onMenu}>
          <Menu size={14} />
        </button>
      </div>

      <div className="top-hud-row top-hud-row-body">
        <div className="top-hud-player">
          <button className="top-hud-identity-btn" onClick={onOpen} type="button" aria-label="캐릭터 정보">
            <div className="top-hud-avatar-box">
              <Ghost size={20} />
            </div>
            <div className="top-hud-name">
              <strong>{status.bodyName}</strong>
              <small>{`Lv.${status.level}`}</small>
            </div>
          </button>

          <div className="top-hud-bars">
            <StatBar value={status.hp} max={status.maxHp} colorClass="hp" />
            <StatBar value={status.mp} max={status.maxMp} colorClass="mp" />
          </div>
        </div>

        <div className="top-hud-resources">
          <span className="top-hud-resource">
            <span>{status.memoryShards.toLocaleString()}</span>
            <Flame size={14} />
          </span>
          <span className="top-hud-resource gold">
            <span>{status.gold}</span>
            <Coins size={14} />
          </span>
        </div>
      </div>
    </div>
  )
}

function RelicIcon({ relic, className = '' }) {
  const imageSrc = getRelicImageSrc(relic?.iconImage ?? relic?.id)

  if (imageSrc) {
    return (
      <span
        className={`relic-mini-icon relic-image-icon relic-${relic.id} ${className}`}
        title={relic.name}
        aria-hidden="true"
      >
        <img src={imageSrc} alt="" draggable={false} />
      </span>
    )
  }

  if (relic?.icon) {
    return (
      <span
        className={`relic-mini-icon relic-emoji-icon relic-${relic.id} ${className}`}
        title={relic.name}
        aria-hidden="true"
      >
        <span className="relic-emoji-glyph">{relic.icon}</span>
      </span>
    )
  }

  return (
    <span className={`relic-mini-icon relic-${relic.id} ${className}`} title={relic.name} aria-hidden="true">
      <span />
    </span>
  )
}

/* ── Story router ── */

function StoryPanel({ frameRef, narrative, isVisible, storyRef, runStatus, onChoice }) {
  if (!narrative) return null

  const hidden = isVisible ? '' : 'is-hidden'
  const common = { narrative, isVisible, onChoice, hidden }

  if (narrative.layout === 'lobby-main') return <LobbyMain {...common} />
  if (narrative.layout === 'body-select') return <BodySelectLobby {...common} />
  if (narrative.layout === 'soul-nodes') return <SoulEngravingScreen {...common} />
  if (narrative.layout === 'shop-entry') return <ShopEntryScreen {...common} />
  if (narrative.layout === 'shop') return <ShopBuyScreen {...common} frameRef={frameRef} />
  if (narrative.layout === 'combat') return <CombatScreen {...common} runStatus={runStatus} />
  if (narrative.layout === 'victory') return <VictoryScreen {...common} frameRef={frameRef} />
  if (narrative.layout === 'death') return <DeathScreen {...common} />
  if (narrative.layout === 'level-up') return <LevelUpScreen {...common} frameRef={frameRef} />

  return (
    <ExplorationScreen
      frameRef={frameRef}
      narrative={narrative}
      isVisible={isVisible}
      storyRef={storyRef}
      onChoice={onChoice}
      hidden={hidden}
    />
  )
}

/* ── Story text rendering ── */

function StoryLineContent({ line }) {
  const normalized = normalizeStoryLine(line)
  const parts = parseInlineStoryEmphasis(normalized.text)

  if (normalized.emphasis && parts.length === 1 && parts[0].type === 'plain') {
    return <span className={getStoryEmphasisClass(normalized.emphasis)}>{normalized.text}</span>
  }

  return parts.map((part, partIndex) => {
    if (part.type === 'emphasis') {
      return (
        <span key={partIndex} className={getStoryEmphasisClass(part.emphasis)}>
          {part.text}
        </span>
      )
    }
    return <span key={partIndex}>{part.text}</span>
  })
}

function StoryParagraph({ line, index, narrativeId }) {
  const normalized = normalizeStoryLine(line)
  if (!normalized.text) return null

  const tier = getStoryLineTier(index, line)
  const textClass = getStoryLineTierClass(tier)

  return (
    <p key={`${narrativeId}-s-${index}`} className={textClass}>
      <StoryLineContent line={line} />
    </p>
  )
}

function StoryParagraphList({ narrativeId, story = [] }) {
  return story.map((line, index) => (
    <StoryParagraph key={`${narrativeId}-s-${index}`} line={line} index={index} narrativeId={narrativeId} />
  ))
}

/* ── Exploration (rooms, events, rest) ── */

function ExplorationScreen({ frameRef, narrative, isVisible, storyRef, onChoice, hidden }) {
  const [isModalOpen, setIsModalOpen] = useState(Boolean(narrative.modal))
  useEffect(() => setIsModalOpen(Boolean(narrative.modal)), [narrative.id, narrative.modal])

  const modal =
    narrative.modal && isModalOpen && frameRef?.current ? (
      <RelicModalPortal container={frameRef.current} modal={narrative.modal} onClose={() => setIsModalOpen(false)} />
    ) : null

  return (
    <aside className={`screen-exploration ${hidden}`}>
      <div className="screen-exploration-inner">
        <div className="exploration-narrative-block game-scroll" ref={storyRef}>
          <StoryParagraphList narrativeId={narrative.id} story={narrative.story} />
        </div>
        <div className="exploration-actions">
          {narrative.prompt ? <p className="exploration-choice-prompt">{narrative.prompt}</p> : null}
          <ChoiceList narrative={narrative} isVisible={isVisible} onChoice={onChoice} />
        </div>
      </div>
      {modal}
    </aside>
  )
}

/* ── Combat ── */

function filterCombatLogLines(lines = []) {
  return lines.filter(
    (line) =>
      line &&
      !line.startsWith('당신: HP') &&
      !line.includes('적의 다음 행동:') &&
      !/:\s*HP \d/.test(line),
  )
}

const COMBAT_SKILL_ICONS = {
  heavy: Zap,
  'mana-guard': Shield,
}

const COMBAT_ACTION_LABELS = {
  attack: '공격',
  defend: '방어',
  'open-skills': '스킬',
}

const FALLBACK_COMBAT_ACTIONS = [
  { id: 'attack', type: 'battle-action' },
  { id: 'defend', type: 'battle-action' },
  { id: 'open-skills', type: 'open-skills' },
]

function CombatScreen({ narrative, isVisible, onChoice, runStatus, hidden }) {
  const reduceMotion = useReducedMotion()
  const combatLogRef = useRef(null)
  const meta = narrative.combatMeta ?? {}
  const logs = filterCombatLogLines(narrative.story ?? [])
  const [showSkillPanel, setShowSkillPanel] = useState(Boolean(meta.openSkillPanel))

  useEffect(() => {
    const el = combatLogRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [logs.length, narrative.id])

  useEffect(() => {
    setShowSkillPanel(Boolean(meta.openSkillPanel))
  }, [narrative.id, meta.openSkillPanel])

  const liveCombatOptions = narrative.options.filter(
    (o) => o.type === 'battle-action' || o.type === 'open-skills',
  )
  const baseBattleOptions = liveCombatOptions.length ? liveCombatOptions : FALLBACK_COMBAT_ACTIONS
  const actionsDisabled =
    !isVisible || showSkillPanel || meta.actionsLocked || liveCombatOptions.length === 0

  const playerForSkills = runStatus
    ? {
        attack: runStatus.attack,
        defense: runStatus.defense,
        mp: runStatus.mp,
        maxMp: runStatus.maxMp,
        skills: runStatus.skills,
      }
    : null

  const skillLockedById = playerForSkills
    ? Object.fromEntries(
        getSkillActions(playerForSkills, { block: meta.enemyBlock ?? 0 })
          .filter((o) => o.type === 'skill-action')
          .map((o) => [o.id, Boolean(o.locked)]),
      )
    : {}

  const knownSkills = playerForSkills ? getKnownSkills(playerForSkills) : []

  const getCombatIcon = (option) => {
    if (option.id === 'attack') return Sword
    if (option.id === 'defend') return Shield
    if (option.id === 'open-skills') return Flame
    return Sword
  }

  const handleBattleChoice = (optionId) => {
    if (optionId === 'open-skills') {
      setShowSkillPanel(true)
      return
    }
    setShowSkillPanel(false)
    onChoice(optionId)
  }

  const handleSkillChoice = (skillId) => {
    if (skillLockedById[skillId]) return
    setShowSkillPanel(false)
    onChoice(skillId)
  }

  const panelMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 12 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } }

  return (
    <aside className={`screen-combat ${hidden}`}>
      {/* 중앙 상단: 의도(Phaser) + 초상(Phaser) + 이름/HP(React) */}
      <div className="combat-enemy-stack" aria-label={meta.enemyName}>
        <div className="combat-intent-gap" aria-hidden="true" />
        <div className="combat-enemy-portrait" aria-hidden="true" />
        <div className="combat-enemy-info">
          <strong>{meta.enemyName}</strong>
          <small>{meta.enemyKind}</small>
        </div>
        <div className="combat-enemy-hp-block">
          <div className="combat-enemy-hp-row">
            <BlockShieldBadge value={meta.enemyBlock ?? 0} />
            <div className="combat-enemy-hp-bar-col">
              <StatBar value={meta.enemyHp} max={meta.enemyMaxHp || 1} colorClass="hp" />
              <span className="combat-enemy-hp-text">
                {`${meta.enemyHp} / ${meta.enemyMaxHp}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="combat-bottom">
        <div className="combat-log-box game-scroll" ref={combatLogRef}>
          {logs.map((line, i) => (
            <p key={`${narrative.id}-log-${i}`} className={i === logs.length - 1 ? 'is-latest' : ''}>
              {line}
            </p>
          ))}
        </div>

        <GothicPanel className="combat-action-panel">
          {runStatus ? (
            <div className="combat-player-stats">
              <div className="combat-stat-col">
                <div className="combat-stat-label">
                  <span className="hp">HP</span>
                  <span>{`${runStatus.hp}/${runStatus.maxHp}`}</span>
                </div>
                <StatBar value={runStatus.hp} max={runStatus.maxHp} colorClass="hp" />
              </div>
              <div className="combat-stat-col">
                <div className="combat-stat-label">
                  <span className="mp">MP</span>
                  <span>{`${runStatus.mp}/${runStatus.maxMp}`}</span>
                </div>
                <StatBar value={runStatus.mp} max={runStatus.maxMp} colorClass="mp" />
              </div>
            </div>
          ) : null}

          <div className="combat-action-grid">
            {baseBattleOptions.map((option) => (
              <button
                key={option.id}
                className="combat-action-btn"
                disabled={option.locked || actionsDisabled}
                onClick={() => handleBattleChoice(option.id)}
                type="button"
              >
                {(() => {
                  const Icon = getCombatIcon(option)
                  return <Icon size={22} />
                })()}
                <span>{COMBAT_ACTION_LABELS[option.id] ?? option.label}</span>
              </button>
            ))}
          </div>
        </GothicPanel>

        <AnimatePresence>
          {showSkillPanel && runStatus ? (
            <motion.div
              key="combat-skill-panel"
              className="combat-skill-panel-wrap"
              {...panelMotion}
              transition={{ duration: 0.2 }}
            >
              <div className="combat-skill-panel">
                <div className="combat-skill-panel-header">
                  <h3>스킬 선택</h3>
                  <button
                    type="button"
                    className="combat-skill-panel-close"
                    aria-label="스킬 선택 닫기"
                    onClick={() => setShowSkillPanel(false)}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="combat-skill-list game-scroll">
                  {knownSkills.map((skill) => {
                    const canUse = !skillLockedById[skill.id]
                    const Icon = COMBAT_SKILL_ICONS[skill.id] ?? Zap
                    const preview = playerForSkills
                      ? getSkillPreview(skill.id, playerForSkills, { block: meta.enemyBlock ?? 0 })
                      : null
                    const previewText = formatSkillPreviewStat(preview)
                    const previewKind = preview?.kind ?? ''
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        className={`combat-skill-row${canUse ? '' : ' is-locked'}`}
                        disabled={!canUse || !isVisible}
                        onClick={() => handleSkillChoice(skill.id)}
                      >
                        <div className="combat-skill-row-icon">
                          <Icon size={20} />
                        </div>
                        <div className="combat-skill-row-body">
                          <div className="combat-skill-row-title">
                            <span>{skill.name}</span>
                            <span className="combat-skill-mp">MP {skill.mpCost}</span>
                          </div>
                          <p>{skill.description ?? skill.detail}</p>
                          {previewText ? (
                            <span className={`combat-skill-stat is-${previewKind}`}>{previewText}</span>
                          ) : null}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="combat-skill-panel-footer">
                  <div className="combat-skill-mp-label">
                    <span>현재 MP</span>
                    <span>{`${runStatus.mp} / ${runStatus.maxMp}`}</span>
                  </div>
                  <StatBar value={runStatus.mp} max={runStatus.maxMp} colorClass="mp" />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </aside>
  )
}

/* ── Victory ── */

function VictoryDivider() {
  return (
    <div className="victory-divider" aria-hidden="true">
      <span className="victory-divider-line" />
      <span className="victory-divider-diamond" />
      <span className="victory-divider-line victory-divider-line--right" />
    </div>
  )
}

function VictoryLootRow({ loot }) {
  const cards = []

  if (loot?.gold > 0) {
    cards.push({
      id: 'gold',
      label: '골드',
      value: `+${loot.gold}`,
      Icon: Coins,
      tone: 'gold',
    })
  }

  if (loot?.exp > 0) {
    cards.push({
      id: 'exp',
      label: '경험치',
      value: `+${loot.exp}`,
      Icon: Sparkles,
      tone: 'exp',
    })
  }

  if (loot?.memoryShards > 0) {
    cards.push({
      id: 'shards',
      label: '영혼의 흔적',
      value: `+${loot.memoryShards}`,
      Icon: Flame,
      tone: 'shard',
    })
  }

  if (!cards.length) return null

  return (
    <div className="victory-loot-row">
      {cards.map((card) => {
        const { Icon } = card
        return (
          <div key={card.id} className={`victory-loot-card tone-${card.tone}`}>
            <Icon size={22} className="victory-loot-card-icon" />
            <span className="victory-loot-card-label">{card.label}</span>
            <span className="victory-loot-card-value">{card.value}</span>
          </div>
        )
      })}
    </div>
  )
}

function VictoryRelicSection({ isVisible, onReveal, label = '미확인 유물' }) {
  return (
    <button type="button" className="victory-relic-section" disabled={!isVisible} onClick={onReveal}>
      <div className="victory-relic-section-main">
        <Sparkles size={18} className="victory-relic-section-icon" />
        <span className="victory-relic-section-label">{label}</span>
      </div>
      <span className="victory-relic-section-hint">클릭하여 확인</span>
    </button>
  )
}

function VictoryRelicAcquiredSection({ relicId, eyebrow = '획득한 유물' }) {
  const relic = getRelicById(relicId)

  return (
    <div className="victory-relic-acquired">
      <span className="victory-relic-acquired-eyebrow">{eyebrow}</span>
      <div className="victory-relic-acquired-main">
        <div className="victory-relic-acquired-icon-wrap" aria-hidden="true">
          <RelicIcon relic={relic} className="is-victory-acquired" />
        </div>
        <div className="victory-relic-acquired-details">
          <h3 className="victory-relic-acquired-name">{relic.name}</h3>
          <p className="victory-relic-acquired-desc">{relic.description}</p>
        </div>
      </div>
    </div>
  )
}

function VictoryScreen({ narrative, isVisible, onChoice, hidden, frameRef }) {
  const [isModalOpen, setIsModalOpen] = useState(Boolean(narrative.modal))
  const [isRelicPreviewOpen, setIsRelicPreviewOpen] = useState(false)
  const loot = narrative.victoryMeta?.loot ?? {}
  const pendingRelicId = narrative.victoryMeta?.pendingRelicId ?? null
  const pendingBossRelicId = narrative.victoryMeta?.pendingBossRelicId ?? null
  const acquiredRelicId = narrative.victoryMeta?.acquiredRelicId ?? null
  const acquiredBossRelicId = narrative.victoryMeta?.acquiredBossRelicId ?? null
  const pendingRelic = pendingRelicId ? getRelicById(pendingRelicId) : null
  const pendingBossRelic = pendingBossRelicId ? getRelicById(pendingBossRelicId) : null
  const canRevealPending = Boolean(pendingRelicId && !acquiredRelicId)
  const canRevealBossPending = Boolean(pendingBossRelicId && !acquiredBossRelicId)
  const [previewRelicKind, setPreviewRelicKind] = useState(null)

  const previewRelic =
    previewRelicKind === 'boss' ? pendingBossRelic : previewRelicKind === 'normal' ? pendingRelic : null

  useEffect(() => setIsModalOpen(Boolean(narrative.modal)), [narrative.id, narrative.modal])
  useEffect(() => {
    setIsRelicPreviewOpen(false)
    setPreviewRelicKind(null)
  }, [narrative.id, pendingRelicId, pendingBossRelicId, acquiredRelicId, acquiredBossRelicId])

  const handleRelicAccept = () => {
    if (previewRelicKind === 'boss') {
      if (!pendingBossRelicId || acquiredBossRelicId) return
      onChoice(`victory-accept-relic-${pendingBossRelicId}`)
    } else {
      if (!pendingRelicId || acquiredRelicId) return
      onChoice(`victory-accept-relic-${pendingRelicId}`)
    }
    setIsRelicPreviewOpen(false)
    setPreviewRelicKind(null)
  }

  const rewardModal =
    narrative.modal && isModalOpen && frameRef?.current ? (
      <RelicModalPortal container={frameRef.current} modal={narrative.modal} onClose={() => setIsModalOpen(false)} />
    ) : null

  const relicPreviewModal =
    isRelicPreviewOpen && previewRelic && frameRef?.current ? (
      <RelicModalPortal
        container={frameRef.current}
        modal={{ relic: previewRelic }}
        onClose={() => {
          setIsRelicPreviewOpen(false)
          setPreviewRelicKind(null)
        }}
        onAccept={handleRelicAccept}
      />
    ) : null

  return (
    <aside className={`screen-victory ${hidden}`}>
      <div className="screen-victory-glow" />
      <GothicPanel className="victory-panel">
        <h2 className="victory-title">전투 승리</h2>
        <div className="victory-body">
          <VictoryDivider />

          <div className="victory-story game-scroll">
            {narrative.story.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <VictoryLootRow loot={loot} />

          {acquiredBossRelicId ? (
            <VictoryRelicAcquiredSection relicId={acquiredBossRelicId} eyebrow="보스 유물" />
          ) : canRevealBossPending ? (
            <VictoryRelicSection
              isVisible={isVisible}
              label="보스의 영혼 흔적"
              onReveal={() => {
                setPreviewRelicKind('boss')
                setIsRelicPreviewOpen(true)
              }}
            />
          ) : null}

          {acquiredRelicId ? (
            <VictoryRelicAcquiredSection relicId={acquiredRelicId} />
          ) : canRevealPending ? (
            <VictoryRelicSection
              isVisible={isVisible}
              onReveal={() => {
                setPreviewRelicKind('normal')
                setIsRelicPreviewOpen(true)
              }}
            />
          ) : null}

          <div className="victory-rewards-section">
            <p className="victory-prompt">{narrative.prompt}</p>
            <div className="victory-rewards">
              {narrative.options.map((option) => (
                <button
                  key={option.id}
                  className="victory-reward-row"
                  disabled={option.locked || !isVisible}
                  onClick={() => onChoice(option.id)}
                  type="button"
                >
                  <RewardRowIcon option={option} />
                  <div className="victory-reward-copy">
                    <strong>{option.label}</strong>
                    {option.detail ? <small>{option.detail}</small> : null}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GothicPanel>
      {rewardModal}
      {relicPreviewModal}
    </aside>
  )
}

function RewardRowIcon({ option }) {
  const reward = option.reward
  let Icon = Sparkles
  let tone = 'gold'
  if (reward?.type === 'attack' || reward?.type === 'defense' || reward?.type === 'maxHp' || reward?.type === 'maxMp') {
    Icon = Sword
    tone = 'red'
  }
  if (reward?.type === 'relic') Icon = Sparkles
  return (
    <div className={`victory-reward-icon tone-${tone}`}>
      <Icon size={20} />
    </div>
  )
}

/* ── Death ── */

function DeathDivider() {
  return (
    <div className="death-divider" aria-hidden="true">
      <span className="death-divider-line" />
      <span className="death-divider-diamond" />
      <span className="death-divider-line death-divider-line--right" />
    </div>
  )
}

function DeathScreen({ narrative, isVisible, onChoice, hidden }) {
  const reduceMotion = useReducedMotion()
  const tracesGained = narrative.deathMeta?.tracesThisRun ?? 0
  const totalTraces = (narrative.deathMeta?.totalTraces ?? 0) + tracesGained
  const settleOption = narrative.options[0]
  const storyLines = narrative.story ?? []

  const enter = reduceMotion
    ? { initial: false, animate: { opacity: 1, scale: 1 } }
    : { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.8 } }

  return (
    <aside className={`screen-death ${hidden}`}>
      <div
        className="screen-death-bg"
        style={{ backgroundImage: `url(${basicBackgroundUrl})` }}
        aria-hidden="true"
      />
      <div className="screen-death-vignette" aria-hidden="true" />
      <div className="screen-death-blood-drip" aria-hidden="true" />

      <motion.div className="death-content" {...enter}>
        <motion.div
          className="death-skull-wrap"
          initial={reduceMotion ? false : { y: -20 }}
          animate={{ y: 0 }}
          transition={reduceMotion ? undefined : { delay: 0.3, type: 'spring' }}
        >
          <Skull size={80} className="death-skull" strokeWidth={1.25} />
        </motion.div>

        <motion.span
          className="death-eyebrow"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduceMotion ? undefined : { delay: 0.5 }}
        >
          Journey Ended
        </motion.span>

        <motion.h1
          className="death-title"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduceMotion ? undefined : { delay: 0.7 }}
        >
          육체가 무너졌습니다
        </motion.h1>

        {storyLines.length ? (
          <motion.div
            className="death-story"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduceMotion ? undefined : { delay: 0.9 }}
          >
            {storyLines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </motion.div>
        ) : (
          <motion.p
            className="death-subtitle"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduceMotion ? undefined : { delay: 0.9 }}
          >
            그러나 영혼은 남습니다.
            <br />
            기억과 흔적은 사라지지 않습니다.
          </motion.p>
        )}

        <DeathDivider />

        <motion.div
          className="death-traces-box"
          initial={reduceMotion ? false : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={reduceMotion ? undefined : { delay: 1.1 }}
        >
          <span className="death-traces-label">남겨진 영혼의 흔적</span>
          <motion.span
            className="death-traces-value"
            initial={reduceMotion ? false : { scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={reduceMotion ? undefined : { delay: 1.3, type: 'spring' }}
          >
            + {tracesGained} <Flame size={24} />
          </motion.span>
          <span className="death-traces-total">총 흔적: {totalTraces.toLocaleString()}</span>
        </motion.div>

        {settleOption ? (
          <motion.div
            className="death-actions"
            initial={reduceMotion ? false : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reduceMotion ? undefined : { delay: 1.5 }}
          >
            <GothicButton
              variant="danger"
              className="death-restart-btn"
              onClick={() => onChoice(settleOption.id)}
              disabled={!isVisible}
            >
              {settleOption.label}
            </GothicButton>
          </motion.div>
        ) : null}
      </motion.div>
    </aside>
  )
}

/* ── Level up ── */

const LEVEL_UP_ICONS = {
  'level-attack': { Icon: Sword, color: '#ff5555', title: '공격 감각' },
  'level-defense': { Icon: Shield, color: '#aaaaaa', title: '방어 감각' },
  'level-hp': { Icon: Heart, color: '#ff8888', title: '생존 감각' },
}

function LevelUpScreen({ narrative, isVisible, onChoice, hidden, frameRef }) {
  const levelText = narrative.levelMeta?.levelText ?? narrative.title
  const [isModalOpen, setIsModalOpen] = useState(Boolean(narrative.modal))
  useEffect(() => setIsModalOpen(Boolean(narrative.modal)), [narrative.id, narrative.modal])

  const modal =
    narrative.modal && isModalOpen && frameRef?.current ? (
      <RelicModalPortal container={frameRef.current} modal={narrative.modal} onClose={() => setIsModalOpen(false)} />
    ) : null

  return (
    <aside className={`screen-levelup ${hidden}`}>
      <div className="levelup-content">
        <p className="levelup-eyebrow">Body Adaptation</p>
        <h2 className="levelup-title">{`육체 적응 ${levelText}`}</h2>
        <p className="levelup-sub">{narrative.story[0]}</p>
        <div className="levelup-cards">
          {narrative.options.map((option) => {
            const preset = LEVEL_UP_ICONS[option.id] ?? { Icon: Sparkles, color: '#c2a67a', title: option.label }
            const { Icon, color } = preset
            return (
              <button
                key={option.id}
                className="levelup-card"
                disabled={option.locked || !isVisible}
                onClick={() => onChoice(option.id)}
                type="button"
              >
                <div className="levelup-card-icon" style={{ color }}>
                  <Icon size={24} />
                </div>
                <div className="levelup-card-copy">
                  <strong>{option.label}</strong>
                  <p>{option.detail}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      {modal}
    </aside>
  )
}

/* ── Shop entry ── */

function ShopEntryScreen({ narrative, isVisible, onChoice, hidden }) {
  return (
    <aside className={`screen-shop-entry ${hidden}`}>
      <div className="shop-entry-bg" />
      <div className="shop-entry-spacer" />
      <div className="shop-entry-bottom">
        <GothicPanel className="shop-entry-panel">
          <h3 className="shop-entry-npc">{narrative.title ?? '상인'}</h3>
          <div className="shop-entry-dialogue game-scroll">
            <StoryParagraphList narrativeId={narrative.id} story={narrative.story} />
          </div>
          <ChoiceList narrative={narrative} isVisible={isVisible} onChoice={onChoice} />
        </GothicPanel>
      </div>
    </aside>
  )
}

/* ── Shop buy ── */

const SHOP_ITEM_EMOJI = {
  potion: '🧪',
  ether: '💧',
}

function ShopBuyItemVisual({ item, large = false }) {
  return <ShopItemIcon item={item} large={large} />
}

function ShopBuyScreen({ narrative, isVisible, onChoice, hidden, frameRef }) {
  const reduceMotion = useReducedMotion()
  const closeOption = narrative.options.find((o) => o.type === 'close-shop')
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(Boolean(narrative.modal))
  const selectedItem = narrative.shop?.items.find((i) => i.id === selectedItemId) ?? null

  useEffect(() => {
    setSelectedItemId(null)
  }, [narrative.id, narrative.shop?.items])

  useEffect(() => setIsModalOpen(Boolean(narrative.modal)), [narrative.id, narrative.modal])

  const modal =
    narrative.modal && isModalOpen && frameRef?.current ? (
      <RelicModalPortal container={frameRef.current} modal={narrative.modal} onClose={() => setIsModalOpen(false)} />
    ) : null

  return (
    <aside className={`screen-shop-buy ${hidden}`}>
      <div className="shop-buy-bg" />
      <div className="shop-buy-panel-wrap">
        <motion.div
          className="shop-buy-panel-motion"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
        >
          <GothicPanel className="shop-buy-panel">
            <div className="shop-buy-header">
              <h3>상품 목록</h3>
              <button
                className="shop-buy-close"
                onClick={() => onChoice(closeOption?.id ?? 'close-shop')}
                disabled={!isVisible}
                type="button"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>
            <div className="shop-buy-grid">
              {narrative.shop?.items.map((item) => {
                const isSelected = selectedItem?.id === item.id
                const canAfford = !item.locked

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    className={`shop-buy-item ${isSelected ? 'is-selected' : ''} ${!canAfford ? 'is-locked' : ''}`}
                    disabled={!isVisible}
                    whileHover={isVisible && !reduceMotion && canAfford ? { scale: 1.02 } : undefined}
                    whileTap={isVisible && !reduceMotion && canAfford ? { scale: 0.98 } : undefined}
                    onClick={() => isVisible && setSelectedItemId(item.id)}
                  >
                    <ShopBuyItemVisual item={item} />
                    <span className="shop-buy-item-name">{item.label}</span>
                    <span className={`shop-buy-item-price ${canAfford ? 'can-afford' : 'cannot-afford'}`}>
                      <Coins size={13} className="shop-buy-price-icon" aria-hidden="true" />
                      <span className="shop-buy-item-price-value">{item.price}</span>
                    </span>
                  </motion.button>
                )
              })}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {selectedItem ? (
                <motion.div
                  key="shop-buy-detail"
                  className="shop-buy-detail"
                  initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduceMotion ? undefined : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <div className="shop-buy-detail-row">
                    <ShopBuyItemVisual item={selectedItem} large />
                    <div className="shop-buy-detail-copy">
                      <h4>{selectedItem.label}</h4>
                      <p>{selectedItem.detail}</p>
                    </div>
                  </div>
                  <GothicButton
                    className="shop-buy-purchase-btn"
                    variant="primary"
                    icon={selectedItem.locked ? undefined : Coins}
                    disabled={selectedItem.locked || !isVisible}
                    onClick={() => onChoice(selectedItem.optionId)}
                  >
                    {selectedItem.locked ? '금화가 부족하다' : `${selectedItem.price} 금화로 구매`}
                  </GothicButton>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </GothicPanel>
        </motion.div>
      </div>
      {modal}
    </aside>
  )
}

function ShopItemIcon({ item, large = false }) {
  if (item.kind === 'relic' && item.relic) {
    return <RelicIcon relic={item.relic} className={`shop-buy-relic-icon ${large ? 'is-large' : ''}`} />
  }

  const supplyId = item.id?.replace(/^relic-/, '') ?? item.id
  const emoji = SHOP_ITEM_EMOJI[supplyId] ?? '📦'
  return <span className={`shop-buy-emoji ${large ? 'is-large' : ''}`}>{emoji}</span>
}

/* ── Gothic divider (ui-proto) ── */

function GothicDivider({ className = '' }) {
  return (
    <div className={`gothic-divider ${className}`.trim()} aria-hidden="true">
      <span className="gothic-divider-line" />
      <span className="gothic-divider-diamond" />
      <span className="gothic-divider-line gothic-divider-line--right" />
    </div>
  )
}

/* ── Lobby ── */

function LobbyDivider() {
  return <GothicDivider className="lobby-divider" />
}

function LobbyMain({ narrative, isVisible, onChoice, hidden }) {
  const reduceMotion = useReducedMotion()
  const startOption = narrative.options.find((o) => o.type === 'continue-run')
  const otherOptions = narrative.options.filter((o) => o.type !== 'continue-run')
  const hasBody = narrative.stats.selectedBodyName !== '미선택'
  const motionKey = narrative.id

  return (
    <aside className={`lobby-screen-new ${hidden}`}>
      <motion.div
        key={`lobby-bg-${motionKey}`}
        className="lobby-bg-stack"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.2, ease: 'easeOut' }}
      >
        <img className="lobby-bg-photo" src={lobbyBackgroundUrl} alt="" />
        <div className="lobby-bg-gradient" />
        <div className="lobby-bg-glow" />
      </motion.div>

      <motion.div
        key={`lobby-top-${motionKey}`}
        className="lobby-topbar-new"
        initial={reduceMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="lobby-topbar-resource">
          <Flame size={16} className="lobby-topbar-icon" />
          <span>{narrative.stats.memoryShards.toLocaleString()}</span>
        </div>
        <div className="lobby-topbar-resource">
          <Hexagon size={16} className="lobby-topbar-icon" />
          <span>{`${narrative.stats.unlockedSoulNodes} / 10`}</span>
        </div>
      </motion.div>

      <motion.div
        key={`lobby-title-${motionKey}`}
        className="lobby-title-block"
        initial={reduceMotion ? false : { y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 0.2 }}
      >
        <span className="lobby-eyebrow-new">Corpse Chamber</span>
        <h1 className="lobby-title-new">{narrative.title}</h1>
        <LobbyDivider />
        {narrative.story?.length ? (
          <div className="lobby-atmosphere game-scroll">
            {narrative.story.map((line, index) => (
              <p key={`${narrative.id}-story-${index}`}>{line}</p>
            ))}
          </div>
        ) : null}
      </motion.div>

      <motion.div
        key={`lobby-bottom-${motionKey}`}
        className="lobby-bottom-actions"
        initial={reduceMotion ? false : { y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 0.4 }}
      >
        <div className="lobby-body-display">
          <span className="lobby-body-label">현재 깃든 그릇</span>
          <div className="lobby-body-box">
            <Ghost size={20} className={hasBody ? 'lobby-body-icon' : 'lobby-body-icon is-empty'} />
            <span className={`lobby-body-box-name ${hasBody ? '' : 'is-empty'}`}>{narrative.stats.selectedBodyName}</span>
          </div>
        </div>
        <div className="lobby-buttons-grid">
          {otherOptions.map((option) => (
            <GothicButton
              key={option.id}
              variant="secondary"
              onClick={() => onChoice(option.id)}
              disabled={option.locked || !isVisible}
            >
              {option.label}
            </GothicButton>
          ))}
          {startOption ? (
            <GothicButton
              key={startOption.id}
              className="lobby-start-btn"
              variant={startOption.locked ? 'secondary' : 'primary'}
              onClick={() => onChoice(startOption.id)}
              disabled={startOption.locked || !isVisible}
            >
              {startOption.locked ? '육체를 먼저 선택해야 합니다' : startOption.label}
            </GothicButton>
          ) : null}
        </div>
      </motion.div>
    </aside>
  )
}

const BODY_CLASS_ICONS = {
  swordsman: '⚔️',
  monk: '🙏',
  thief: '🗡️',
  medium: '🔮',
}

function BodySelectStatItem({ icon: Icon, value, tone }) {
  return (
    <div className="body-card-stat">
      <Icon size={14} className={`body-card-stat-icon tone-${tone}`} />
      <span>{value}</span>
    </div>
  )
}

function BodySelectLobby({ narrative, isVisible, onChoice, hidden }) {
  const reduceMotion = useReducedMotion()
  const bodyOptions = narrative.options.filter((o) => o.type === 'select-body')
  const confirmOption = narrative.options.find((o) => o.id === 'confirm-body-select')
  const backOption = narrative.options.find((o) => o.id === 'back-to-lobby')

  return (
    <aside className={`body-select-screen-new ${hidden}`}>
      <header className="body-select-header">
        <button
          className="body-select-back-btn"
          onClick={() => onChoice(backOption?.id ?? 'back-to-lobby')}
          disabled={!isVisible}
          type="button"
          aria-label="로비로 돌아가기"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="body-select-title">육체 선택</h1>
        <div className="body-select-header-spacer" aria-hidden="true" />
      </header>

      <div className="body-select-list game-scroll">
        {bodyOptions.map((option, index) => {
          const selected = narrative.selectedBodyId === option.body.id
          const stats = option.body.stats
          const icon = BODY_CLASS_ICONS[option.body.classId] ?? '👤'

          return (
            <motion.div
              key={option.id}
              role="button"
              tabIndex={isVisible ? 0 : -1}
              className={`body-card-new ${selected ? 'is-selected' : ''}`}
              initial={reduceMotion ? false : { x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : index * 0.1 }}
              onClick={() => isVisible && onChoice(option.id)}
              onKeyDown={(event) => {
                if (!isVisible) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onChoice(option.id)
                }
              }}
            >
              <div className="body-card-new-header">
                <div className="body-card-new-main">
                  <span className="body-card-new-icon" aria-hidden="true">
                    {icon}
                  </span>
                  <div className="body-card-new-copy">
                    <h3 className={`body-card-new-name ${selected ? 'is-selected' : ''}`}>{option.body.name}</h3>
                    <p className="body-card-new-desc">{option.body.description}</p>
                  </div>
                </div>
                {selected ? (
                  <motion.div
                    className="body-card-check"
                    initial={reduceMotion ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    aria-hidden="true"
                  >
                    <span>✓</span>
                  </motion.div>
                ) : null}
              </div>
              <div className="body-card-stats">
                <BodySelectStatItem icon={Heart} value={stats.maxHp} tone="hp" />
                <BodySelectStatItem icon={Battery} value={stats.maxMp} tone="mp" />
                <BodySelectStatItem icon={Sword} value={stats.attack} tone="atk" />
                <BodySelectStatItem icon={Shield} value={stats.defense} tone="def" />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="body-select-bottom">
        {confirmOption ? (
          <GothicButton
            onClick={() => onChoice(confirmOption.id)}
            disabled={confirmOption.locked || !isVisible}
            variant="primary"
          >
            {confirmOption.locked ? '육체를 선택하세요' : confirmOption.label}
          </GothicButton>
        ) : null}
      </div>
    </aside>
  )
}

/* ── Soul engraving ── */

const SOUL_NODE_ICONS = {
  attack: Sword,
  defense: Shield,
  hp: Heart,
  mp: Battery,
  special: Zap,
}

const SOUL_NODE_ICON_COLORS = {
  attack: 'tone-attack',
  defense: 'tone-defense',
  hp: 'tone-hp',
  mp: 'tone-mp',
  special: 'tone-special',
}

function getSoulLinkStroke(parent, child) {
  if (parent?.unlocked && child?.unlocked) {
    return { stroke: 'rgba(193, 163, 95, 0.8)', strokeWidth: 3, strokeDasharray: '0' }
  }
  if (parent?.unlocked) {
    return { stroke: 'rgba(138, 107, 50, 0.5)', strokeWidth: 2, strokeDasharray: '4 4' }
  }
  return { stroke: 'rgba(63, 63, 70, 0.3)', strokeWidth: 2, strokeDasharray: '4 4' }
}

function SoulNodeRoundIcon({ iconType, unlocked }) {
  const Icon = SOUL_NODE_ICONS[iconType] ?? Zap
  const tone = SOUL_NODE_ICON_COLORS[iconType] ?? 'tone-special'
  return <Icon size={24} className={`soul-round-node-icon ${unlocked ? tone : ''}`} />
}

function SoulEngravingScreen({ narrative, isVisible, onChoice, hidden }) {
  const reduceMotion = useReducedMotion()
  const nodeOptions = narrative.options.filter((o) => o.type === 'unlock-soul-node')
  const backOption = narrative.options.find((o) => o.type === 'back-to-lobby')
  const [selectedNodeId, setSelectedNodeId] = useState(nodeOptions[0]?.nodeId ?? null)
  const [isModalOpen, setIsModalOpen] = useState(Boolean(narrative.modal))
  const selectedNode = nodeOptions.find((o) => o.nodeId === selectedNodeId) ?? nodeOptions[0]

  useEffect(() => setIsModalOpen(Boolean(narrative.modal)), [narrative.id, narrative.modal])

  const engraveDisabledReason = selectedNode?.unlocked
    ? null
    : !selectedNode?.canAfford
      ? '흔적이 부족하다'
      : selectedNode?.locked
        ? '이전 노드 필요'
        : null

  return (
    <aside className={`soul-screen-new ${hidden}`}>
      <header className="soul-screen-header">
        <button
          className="soul-screen-back"
          onClick={() => onChoice(backOption?.id ?? 'back-to-lobby')}
          disabled={!isVisible}
          type="button"
          aria-label="로비로 돌아가기"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="soul-screen-title">영혼 각인</h1>
        <div className="soul-header-traces">
          <span>{narrative.memoryShards?.toLocaleString() ?? '—'}</span>
          <Flame size={16} className="soul-header-traces-icon" />
        </div>
      </header>

      <div className="soul-map-area">
        <div className="soul-map-glow" aria-hidden="true" />
        <svg className="soul-map-links" aria-hidden="true">
          {nodeOptions.flatMap((option) =>
            option.requirements.map((requiredId) => {
              const parent = nodeOptions.find((n) => n.nodeId === requiredId)
              if (!parent?.position || !option.position) return null
              const linkStyle = getSoulLinkStroke(parent, option)
              return (
                <line
                  key={`${requiredId}-${option.nodeId}`}
                  x1={`${parent.position.x}%`}
                  y1={`${parent.position.y}%`}
                  x2={`${option.position.x}%`}
                  y2={`${option.position.y}%`}
                  stroke={linkStyle.stroke}
                  strokeWidth={linkStyle.strokeWidth}
                  strokeDasharray={linkStyle.strokeDasharray}
                />
              )
            }),
          )}
        </svg>
        {nodeOptions.map((option, index) => {
          const isSelected = selectedNode?.nodeId === option.nodeId
          const canUnlock = !option.unlocked && !option.locked

          return (
            <motion.button
              key={option.id}
              type="button"
              className={`soul-round-node ${option.unlocked ? 'is-unlocked' : ''} ${
                canUnlock ? 'is-available' : ''
              } ${isSelected ? 'is-selected' : ''}`}
              style={{ left: `${option.position?.x ?? 50}%`, top: `${option.position?.y ?? 50}%` }}
              initial={reduceMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : index * 0.04 }}
              whileHover={isVisible && !reduceMotion ? { scale: 1.1 } : undefined}
              whileTap={isVisible && !reduceMotion ? { scale: 0.95 } : undefined}
              onClick={() => isVisible && setSelectedNodeId(option.nodeId)}
              disabled={!isVisible}
              aria-label={option.label}
            >
              {option.unlocked ? (
                <SoulNodeRoundIcon iconType={option.iconType} unlocked />
              ) : (
                <Lock size={20} className="soul-round-node-lock" />
              )}
            </motion.button>
          )
        })}
      </div>

      {selectedNode ? (
        <motion.div
          className="soul-detail-panel-wrap"
          initial={reduceMotion ? false : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <GothicPanel className="soul-detail-panel">
            <div className="soul-detail-head">
              <div>
                <h3>{selectedNode.label}</h3>
                <span className={`soul-detail-badge ${selectedNode.unlocked ? 'is-done' : ''}`}>
                  {selectedNode.unlocked ? '각인됨' : '미각인'}
                </span>
              </div>
              <Flame size={32} className={selectedNode.unlocked ? 'is-lit' : ''} />
            </div>
            <p className="soul-detail-desc">{selectedNode.abilityDescription}</p>
            <div className="soul-detail-action">
              <div className={`soul-detail-cost ${selectedNode.unlocked ? 'is-placeholder' : ''}`}>
                <span>요구 흔적</span>
                <span className={selectedNode.canAfford ? 'can-afford' : 'cannot-afford'}>
                  {selectedNode.cost} <Flame size={12} />
                </span>
              </div>
              <GothicButton
                className="soul-detail-engrave-btn"
                variant="primary"
                disabled={selectedNode.unlocked || selectedNode.locked || !isVisible}
                onClick={selectedNode.unlocked ? undefined : () => onChoice(selectedNode.id)}
              >
                {selectedNode.unlocked
                  ? '이미 영혼에 새겨진 각인입니다.'
                  : engraveDisabledReason ?? '영혼에 각인한다'}
              </GothicButton>
            </div>
          </GothicPanel>
        </motion.div>
      ) : null}

      {narrative.modal && isModalOpen ? (
        <div className="game-modal-backdrop">
          <GothicPanel className="soul-memory-modal">
            <button className="soul-story-modal-close" onClick={() => setIsModalOpen(false)} type="button">
              x
            </button>
            <div className="soul-memory-modal-inner">
              <p className="relic-modal-eyebrow soul-memory-modal-eyebrow">Soul Memory</p>
              <GothicDivider className="soul-memory-modal-divider" />
              <h3 className="soul-memory-modal-title">{narrative.modal.title}</h3>
              <p className="soul-memory-modal-story">{narrative.modal.story}</p>
            </div>
          </GothicPanel>
        </div>
      ) : null}
    </aside>
  )
}

/* ── Character modal ── */

function CharacterInfoModal({ container, status, onClose }) {
  if (!status) return null
  const hpPct = (status.hp / status.maxHp) * 100
  const mpPct = (status.mp / status.maxMp) * 100
  const expPct = (status.exp / status.expToNext) * 100

  return createPortal(
    <div className="game-modal-backdrop">
      <div className="char-modal-new" role="dialog" aria-modal="true">
        <div className="char-modal-header">
          <h3>캐릭터 정보</h3>
          <button className="char-modal-close-btn" onClick={onClose} type="button">
            <X size={22} />
          </button>
        </div>
        <div className="char-modal-body game-scroll">
          <div className="char-modal-identity">
            <div className="char-modal-avatar">
              <Ghost size={32} />
            </div>
            <div className="char-modal-info">
              <h3 className="char-modal-name">{status.bodyName}</h3>
              <span className="char-modal-level">{`Lv.${status.level} · Exp ${status.exp}/${status.expToNext}`}</span>
              <div className="char-modal-exp-bar-bg">
                <div className="char-modal-exp-bar-fill" style={{ width: `${expPct}%` }} />
              </div>
            </div>
          </div>
          <div className="char-modal-vitals">
            <div className="char-modal-vital-row">
              <Heart size={14} style={{ color: '#f87171' }} />
              <span className="char-modal-vital-label">HP</span>
              <div className="char-modal-vital-bar">
                <div className="char-modal-vital-bar-fill" style={{ width: `${hpPct}%`, background: '#ff4444' }} />
              </div>
              <span className="char-modal-vital-val">{`${status.hp}/${status.maxHp}`}</span>
            </div>
            <div className="char-modal-vital-row">
              <Battery size={14} style={{ color: '#60a5fa' }} />
              <span className="char-modal-vital-label">MP</span>
              <div className="char-modal-vital-bar">
                <div className="char-modal-vital-bar-fill" style={{ width: `${mpPct}%`, background: '#55aaff' }} />
              </div>
              <span className="char-modal-vital-val">{`${status.mp}/${status.maxMp}`}</span>
            </div>
          </div>
          <div className="char-modal-stats-grid">
            <div className="char-modal-stat-card">
              <Sword size={16} />
              <span className="char-modal-stat-label">공격력</span>
              <span className="char-modal-stat-val">{status.attack}</span>
            </div>
            <div className="char-modal-stat-card">
              <Shield size={16} />
              <span className="char-modal-stat-label">방어력</span>
              <span className="char-modal-stat-val">{status.defense}</span>
            </div>
            <div className="char-modal-stat-card">
              <Coins size={16} style={{ color: '#eab308' }} />
              <span className="char-modal-stat-label">금화</span>
              <span className="char-modal-stat-val">{status.gold}</span>
            </div>
            <div className="char-modal-stat-card">
              <Flame size={16} style={{ color: '#c2a67a' }} />
              <span className="char-modal-stat-label">흔적</span>
              <span className="char-modal-stat-val">{status.memoryShards}</span>
            </div>
          </div>
          <div className="char-modal-relics-section">
            <div className="char-modal-relics-title">
              <ScrollText size={16} />
              <span>{`보유 유물 (${status.relics.length})`}</span>
            </div>
            {status.relics.length ? (
              status.relics.map((relic) => (
                <div className="char-modal-relic-row" key={relic.id}>
                  <div className="char-modal-relic-icon-wrap">
                    <RelicIcon relic={relic} />
                  </div>
                  <div className="char-modal-relic-info">
                    <strong>{relic.name}</strong>
                    <small>{relic.description}</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="char-modal-empty">아직 보유한 유물이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    container,
  )
}

function RelicModalPortal({ container, modal, onClose, onAccept }) {
  const reduceMotion = useReducedMotion()
  if (!modal.relic) return null

  const relic = modal.relic
  const hasFlavor = Boolean(relic.flavorLine?.trim())
  const handleAccept = onAccept ?? onClose
  const eyebrow = modal.eyebrow ?? 'Relic Acquired'
  return createPortal(
    <div className="game-modal-backdrop">
      <motion.div
        className="relic-modal-new"
        role="dialog"
        aria-modal="true"
        initial={reduceMotion ? false : { y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relic-modal-inner">
          <p className="relic-modal-eyebrow">{eyebrow}</p>
          <div className="relic-modal-icon-wrap">
            <div className="relic-modal-icon-pulse" aria-hidden="true" />
            {getRelicImageSrc(relic.iconImage ?? relic.id) ? (
              <img
                className="relic-modal-image"
                src={getRelicImageSrc(relic.iconImage ?? relic.id)}
                alt=""
                draggable={false}
              />
            ) : relic.icon ? (
              <span className="relic-modal-emoji" aria-hidden="true">
                {relic.icon}
              </span>
            ) : (
              <RelicIcon relic={relic} className="is-large" />
            )}
            <Sparkles className="relic-modal-sparkle" size={20} aria-hidden="true" />
          </div>
          <h2 className="relic-modal-name">{relic.name}</h2>
          <p className={`relic-modal-desc ${hasFlavor ? 'has-flavor' : ''}`}>{relic.description}</p>
          {hasFlavor ? <p className="relic-modal-flavor">&quot;{relic.flavorLine}&quot;</p> : null}
          <GothicButton className="relic-modal-accept-btn" onClick={handleAccept} variant="primary">
            받아들인다
          </GothicButton>
        </div>
      </motion.div>
    </div>,
    container,
  )
}

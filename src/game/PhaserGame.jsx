import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Phaser from 'phaser'
import {
  Ghost,
  Flame,
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
} from 'lucide-react'
import { createGameConfig } from './config'
import { initGameScrollReveal } from './scrollReveal'

const LOBBY_LAYOUTS = new Set(['lobby-main', 'body-select', 'soul-nodes'])
const FULLSCREEN_LAYOUTS = new Set(['combat', 'victory', 'death', 'level-up', 'shop-entry', 'shop'])

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
      setNarrative(event.detail)
      requestAnimationFrame(() => {
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

  const handleChoice = (optionId) => {
    window.dispatchEvent(new CustomEvent('game:choice', { detail: { optionId } }))
  }

  const showTopHud =
    runStatus?.isBodySelected &&
    narrative &&
    !LOBBY_LAYOUTS.has(narrative.layout) &&
    !FULLSCREEN_LAYOUTS.has(narrative.layout)

  return (
    <section className="game-frame" ref={frameRef} aria-label="Game canvas">
      <div className="game-canvas" ref={containerRef} />
      {showTopHud ? <TopHUD status={runStatus} onOpen={() => setIsStatusOpen(true)} /> : null}
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

function ChoiceList({ narrative, isVisible, onChoice, variant = 'primary' }) {
  return (
    <div className="ui-choice-list">
      {narrative.options.map((option, index) => {
        const isGhost = option.type === 'continue-run' && option.label?.includes('떠난')
        return (
          <GothicButton
            key={option.id}
            variant={option.variant === 'primary' ? 'primary' : isGhost ? 'ghost' : 'secondary'}
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

function TopHUD({ status, onOpen }) {
  return (
    <div className="top-hud">
      <button className="top-hud-left" onClick={onOpen} type="button" aria-label="캐릭터 정보">
        <div className="top-hud-identity">
          <div className="top-hud-avatar-box">
            <Ghost size={20} />
          </div>
          <div className="top-hud-name">
            <strong>{status.bodyName}</strong>
            <small>{`Lv.${status.level}`}</small>
          </div>
        </div>
        <div className="top-hud-bars">
          <div className="top-hud-bar-row">
            <span className="top-hud-bar-label hp">HP</span>
            <StatBar value={status.hp} max={status.maxHp} colorClass="hp" />
          </div>
          <div className="top-hud-bar-row">
            <span className="top-hud-bar-label mp">MP</span>
            <StatBar value={status.mp} max={status.maxMp} colorClass="mp" />
          </div>
        </div>
      </button>
      <div className="top-hud-right">
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
  )
}

function RelicIcon({ relic, className = '' }) {
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
  if (narrative.layout === 'shop-entry') return <ShopEntryScreen {...common} runStatus={runStatus} />
  if (narrative.layout === 'shop') return <ShopBuyScreen {...common} frameRef={frameRef} />
  if (narrative.layout === 'combat') return <CombatScreen {...common} runStatus={runStatus} />
  if (narrative.layout === 'victory') return <VictoryScreen {...common} frameRef={frameRef} />
  if (narrative.layout === 'death') return <DeathScreen {...common} />
  if (narrative.layout === 'level-up') return <LevelUpScreen {...common} />

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
          {narrative.story.map((paragraph, index) => {
            if (!paragraph) return null
            const textClass =
              index === 0
                ? 'exploration-main-text'
                : index === 1
                  ? 'exploration-sub-text'
                  : 'exploration-extra-text'
            return (
              <p key={`${narrative.id}-s-${index}`} className={textClass}>
                {paragraph}
              </p>
            )
          })}
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

function CombatScreen({ narrative, isVisible, onChoice, runStatus, hidden }) {
  const meta = narrative.combatMeta ?? {}
  const logs = filterCombatLogLines(narrative.story ?? [])
  const battleOptions = narrative.options.filter((o) => o.type !== 'close-skills')
  const closeSkill = narrative.options.find((o) => o.id === 'close-skills')

  const getCombatIcon = (option) => {
    if (option.id === 'attack' || option.type === 'skill-action') return Sword
    if (option.id === 'defend') return Shield
    if (option.id === 'open-skills') return Zap
    return Sword
  }

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
          <StatBar value={meta.enemyHp} max={meta.enemyMaxHp || 1} colorClass="hp" />
          <span className="combat-enemy-hp-text">
            {`${meta.enemyHp} / ${meta.enemyMaxHp}`}
          </span>
        </div>
      </div>

      <div className="combat-bottom">
        <div className="combat-log-box game-scroll">
          {logs.map((line, i) => (
            <p key={i} className={i === logs.length - 1 ? 'is-latest' : ''}>
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
            {battleOptions.map((option) => (
              <button
                key={option.id}
                className="combat-action-btn"
                disabled={option.locked || !isVisible}
                onClick={() => onChoice(option.id)}
                type="button"
              >
                {(() => {
                  const Icon = getCombatIcon(option)
                  return <Icon size={22} />
                })()}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          {closeSkill ? (
            <GothicButton variant="ghost" onClick={() => onChoice(closeSkill.id)} disabled={!isVisible}>
              {closeSkill.label}
            </GothicButton>
          ) : null}
        </GothicPanel>
      </div>
    </aside>
  )
}

/* ── Victory ── */

function VictoryScreen({ narrative, isVisible, onChoice, hidden, frameRef }) {
  const [isModalOpen, setIsModalOpen] = useState(Boolean(narrative.modal))
  useEffect(() => setIsModalOpen(Boolean(narrative.modal)), [narrative.id, narrative.modal])

  const modal =
    narrative.modal && isModalOpen && frameRef?.current ? (
      <RelicModalPortal container={frameRef.current} modal={narrative.modal} onClose={() => setIsModalOpen(false)} />
    ) : null

  return (
    <aside className={`screen-victory ${hidden}`}>
      <div className="screen-victory-glow" />
      <GothicPanel className="victory-panel">
        <h2 className="victory-title">전투 승리</h2>
        <div className="victory-body">
          <div className="victory-log game-scroll">
            {narrative.story.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
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
      {modal}
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
  if (reward?.type === 'boss-cache') Icon = Coins
  if (reward?.type === 'relic') Icon = Sparkles
  return (
    <div className={`victory-reward-icon tone-${tone}`}>
      <Icon size={20} />
    </div>
  )
}

/* ── Death ── */

function DeathScreen({ narrative, isVisible, onChoice, hidden }) {
  const traces = narrative.deathMeta?.tracesThisRun ?? 0
  const settleOption = narrative.options[0]

  return (
    <aside className={`screen-death ${hidden}`}>
      <div className="screen-death-glow" />
      <div className="death-content">
        <Skull size={64} className="death-skull" />
        <span className="death-eyebrow">Journey Ended</span>
        <h1 className="death-title">육체가 무너졌습니다</h1>
        <div className="death-traces-box">
          <span className="death-traces-label">이번 여정의 영혼의 흔적</span>
          <span className="death-traces-value">
            {traces} <Flame size={20} />
          </span>
        </div>
        {narrative.story.length ? (
          <div className="death-story game-scroll">
            {narrative.story.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ) : null}
        {settleOption ? (
          <GothicButton
            variant="danger"
            onClick={() => onChoice(settleOption.id)}
            disabled={!isVisible}
            style={{ maxWidth: '280px', marginTop: '16px' }}
          >
            {settleOption.label}
          </GothicButton>
        ) : null}
      </div>
    </aside>
  )
}

/* ── Level up ── */

const LEVEL_UP_ICONS = {
  'level-attack': { Icon: Sword, color: '#ff5555', title: '공격 감각' },
  'level-defense': { Icon: Shield, color: '#aaaaaa', title: '방어 감각' },
  'level-hp': { Icon: Heart, color: '#ff8888', title: '생존 감각' },
}

function LevelUpScreen({ narrative, isVisible, onChoice, hidden }) {
  const levelText = narrative.levelMeta?.levelText ?? narrative.title

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
    </aside>
  )
}

/* ── Shop entry ── */

function ShopEntryScreen({ narrative, isVisible, onChoice, runStatus, hidden }) {
  return (
    <aside className={`screen-shop-entry ${hidden}`}>
      <div className="shop-entry-bg" />
      <div className="shop-entry-top">
        <span className="shop-merchant-label">The Merchant</span>
        {runStatus ? (
          <div className="shop-gold-badge">
            <span>{runStatus.gold}</span>
            <Coins size={16} />
          </div>
        ) : null}
      </div>
      <div className="shop-entry-spacer" />
      <div className="shop-entry-bottom">
        <GothicPanel className="shop-entry-panel">
          <h3 className="shop-entry-npc">얼굴 없는 상인</h3>
          <div className="shop-entry-dialogue game-scroll">
            {narrative.story.map((line, i) => {
              if (!line) return null
              const textClass =
                i === 0 ? 'exploration-main-text' : i === 1 ? 'exploration-sub-text' : 'exploration-extra-text'
              return (
                <p key={i} className={textClass}>
                  {line}
                </p>
              )
            })}
          </div>
          <ChoiceList narrative={narrative} isVisible={isVisible} onChoice={onChoice} />
        </GothicPanel>
      </div>
    </aside>
  )
}

/* ── Shop buy ── */

function ShopBuyScreen({ narrative, isVisible, onChoice, hidden, frameRef }) {
  const closeOption = narrative.options.find((o) => o.type === 'close-shop')
  const [selectedItemId, setSelectedItemId] = useState(narrative.shop?.items[0]?.id ?? null)
  const [isModalOpen, setIsModalOpen] = useState(Boolean(narrative.modal))
  const selectedItem = narrative.shop?.items.find((i) => i.id === selectedItemId) ?? narrative.shop?.items[0]

  useEffect(() => {
    setSelectedItemId(narrative.shop?.items[0]?.id ?? null)
  }, [narrative.id, narrative.shop?.items])

  useEffect(() => setIsModalOpen(Boolean(narrative.modal)), [narrative.id, narrative.modal])

  const modal =
    narrative.modal && isModalOpen && frameRef?.current ? (
      <RelicModalPortal container={frameRef.current} modal={narrative.modal} onClose={() => setIsModalOpen(false)} />
    ) : null

  return (
    <aside className={`screen-shop-buy ${hidden}`}>
      <div className="shop-buy-bg" />
      <div className="shop-buy-top">
        <span className="shop-merchant-label">The Merchant</span>
        <div className="shop-gold-badge">
          <span>{narrative.shop?.gold ?? 0}</span>
          <Coins size={16} />
        </div>
      </div>
      <div className="shop-buy-panel-wrap">
        <GothicPanel className="shop-buy-panel">
          <div className="shop-buy-header">
            <h3>상품 목록</h3>
            <button
              className="shop-buy-close"
              onClick={() => onChoice(closeOption?.id ?? 'close-shop')}
              type="button"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>
          <div className="shop-buy-grid game-scroll">
            {narrative.shop?.items.map((item) => (
              <button
                key={item.id}
                className={`shop-buy-item ${selectedItem?.id === item.id ? 'is-selected' : ''} ${item.locked ? 'is-locked' : ''}`}
                disabled={!isVisible}
                onClick={() => setSelectedItemId(item.id)}
                type="button"
              >
                <ShopItemIcon item={item} />
                <span className="shop-buy-item-name">{item.label}</span>
                <span className="shop-buy-item-price">
                  {item.price} <Coins size={12} />
                </span>
              </button>
            ))}
          </div>
          {selectedItem ? (
            <div className="shop-buy-detail">
              <h4>{selectedItem.label}</h4>
              <p>{selectedItem.detail}</p>
              <GothicButton
                variant="primary"
                disabled={selectedItem.locked || !isVisible}
                onClick={() => onChoice(selectedItem.optionId)}
              >
                {selectedItem.locked ? '금화가 부족하다' : '구매한다'}
              </GothicButton>
            </div>
          ) : null}
        </GothicPanel>
      </div>
      {modal}
    </aside>
  )
}

function ShopItemIcon({ item, large = false }) {
  if (item.kind === 'relic' && item.relic) {
    return <RelicIcon relic={item.relic} className={large ? 'is-large' : ''} />
  }
  const supplyClass = item.id?.includes('ether') ? 'supply-ether' : ''
  return (
    <span className={`shop-supply-icon ${large ? 'is-large' : ''} ${supplyClass}`} aria-hidden="true">
      <span />
    </span>
  )
}

/* ── Lobby ── */

function LobbyMain({ narrative, isVisible, onChoice, hidden }) {
  const startOption = narrative.options.find((o) => o.type === 'continue-run')
  const otherOptions = narrative.options.filter((o) => o.type !== 'continue-run')
  const hasBody = narrative.stats.selectedBodyName !== '미선택'

  return (
    <aside className={`lobby-screen-new ${hidden}`}>
      <div className="lobby-bg-overlay">
        <div className="lobby-bg-img" />
      </div>
      <div className="lobby-topbar-new">
        <div className="lobby-topbar-resource">
          <Flame size={16} style={{ opacity: 0.8 }} />
          <span>{narrative.stats.memoryShards.toLocaleString()}</span>
        </div>
        <div className="lobby-topbar-resource">
          <span>⬡</span>
          <span>{`${narrative.stats.unlockedSoulNodes} / 10`}</span>
        </div>
      </div>
      <div className="lobby-center">
        <span className="lobby-eyebrow-new">Corpse Chamber</span>
        <h1 className="lobby-title-new">{narrative.title}</h1>
        <div className="lobby-divider" />
      </div>
      <div className="lobby-bottom-actions">
        <div className="lobby-body-display">
          <span className="lobby-body-label">현재 깃든 그릇</span>
          <div className="lobby-body-box">
            <Ghost size={20} style={{ color: hasBody ? '#c2a67a' : '#3f3f46' }} />
            <span className="lobby-body-box-name" style={{ color: hasBody ? '#e8dcc7' : '#52525b' }}>
              {narrative.stats.selectedBodyName}
            </span>
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
              variant={startOption.locked ? 'secondary' : 'primary'}
              onClick={() => onChoice(startOption.id)}
              disabled={startOption.locked || !isVisible}
            >
              {startOption.locked ? '육체를 먼저 선택해야 합니다' : startOption.label}
            </GothicButton>
          ) : null}
        </div>
      </div>
    </aside>
  )
}

function BodySelectLobby({ narrative, isVisible, onChoice, hidden }) {
  const bodyOptions = narrative.options.filter((o) => o.type === 'select-body')
  const confirmOption = narrative.options.find((o) => o.id === 'confirm-body-select')
  const backOption = narrative.options.find((o) => o.id === 'back-to-lobby')

  return (
    <aside className={`body-select-screen-new ${hidden}`}>
      <div className="body-select-header">
        <button
          className="body-select-back-btn"
          onClick={() => onChoice(backOption?.id ?? 'back-to-lobby')}
          type="button"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="body-select-title">육체 선택</h2>
        <div style={{ width: 40 }} />
      </div>
      <div className="body-select-list game-scroll">
        {bodyOptions.map((option) => {
          const selected = narrative.selectedBodyId === option.body.id
          const stats = option.body.stats
          return (
            <button
              key={option.id}
              className={`body-card-new ${selected ? 'is-selected' : ''}`}
              onClick={() => onChoice(option.id)}
              disabled={!isVisible}
              type="button"
            >
              <p className={`body-card-new-name ${selected ? 'is-selected' : ''}`}>{option.body.name}</p>
              <p className="body-card-new-desc">{option.body.description}</p>
              <div className="body-card-stats">
                <div className="body-card-stat">
                  <Heart size={12} style={{ color: '#7f1d1d' }} />
                  <span>{stats.maxHp}</span>
                </div>
                <div className="body-card-stat">
                  <Battery size={12} style={{ color: '#1e3a5f' }} />
                  <span>{stats.maxMp}</span>
                </div>
                <div className="body-card-stat">
                  <Sword size={12} />
                  <span>{stats.attack}</span>
                </div>
                <div className="body-card-stat">
                  <Shield size={12} />
                  <span>{stats.defense}</span>
                </div>
              </div>
            </button>
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

/* ── Soul engraving (mockup circular nodes) ── */

function SoulEngravingScreen({ narrative, isVisible, onChoice, hidden }) {
  const nodeOptions = narrative.options.filter((o) => o.type === 'unlock-soul-node')
  const backOption = narrative.options.find((o) => o.type === 'back-to-lobby')
  const [selectedNodeId, setSelectedNodeId] = useState(nodeOptions[0]?.nodeId ?? null)
  const [isModalOpen, setIsModalOpen] = useState(Boolean(narrative.modal))
  const selectedNode = nodeOptions.find((o) => o.nodeId === selectedNodeId) ?? nodeOptions[0]

  useEffect(() => setIsModalOpen(Boolean(narrative.modal)), [narrative.id, narrative.modal])

  return (
    <aside className={`soul-screen-new ${hidden}`}>
      <div className="soul-screen-header-new">
        <button className="soul-screen-back" onClick={() => onChoice(backOption?.id ?? 'back-to-lobby')} type="button">
          <ChevronLeft size={24} />
        </button>
        <h2 className="soul-screen-title">영혼 각인</h2>
        <div className="soul-screen-traces">
          <span>{narrative.memoryShards?.toLocaleString() ?? '—'}</span>
          <Flame size={14} />
        </div>
      </div>

      <div className="soul-map-area">
        <svg className="soul-map-links" aria-hidden="true">
          {nodeOptions.flatMap((option) =>
            option.requirements.map((requiredId) => {
              const parent = nodeOptions.find((n) => n.nodeId === requiredId)
              if (!parent?.position || !option.position) return null
              const active = parent.unlocked && option.unlocked
              return (
                <line
                  key={`${requiredId}-${option.nodeId}`}
                  x1={`${parent.position.x}%`}
                  y1={`${parent.position.y}%`}
                  x2={`${option.position.x}%`}
                  y2={`${option.position.y}%`}
                  className={active ? 'is-active' : ''}
                />
              )
            }),
          )}
        </svg>
        {nodeOptions.map((option) => (
          <button
            key={option.id}
            className={`soul-round-node ${option.unlocked ? 'is-unlocked' : ''} ${
              selectedNode?.nodeId === option.nodeId ? 'is-selected' : ''
            }`}
            style={{ left: `${option.position?.x ?? 50}%`, top: `${option.position?.y ?? 50}%` }}
            onClick={() => setSelectedNodeId(option.nodeId)}
            disabled={!isVisible}
            type="button"
          >
            {option.unlocked ? <Flame size={20} /> : <Lock size={16} />}
          </button>
        ))}
      </div>

      {selectedNode ? (
        <GothicPanel className="soul-detail-panel">
          <div className="soul-detail-head">
            <div>
              <h3>{selectedNode.label}</h3>
              <span className={`soul-detail-badge ${selectedNode.unlocked ? 'is-done' : ''}`}>
                {selectedNode.unlocked ? '각인됨' : '미각인'}
              </span>
            </div>
            <Flame size={28} className={selectedNode.unlocked ? 'is-lit' : ''} />
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
                : selectedNode.locked
                  ? '각인 불가'
                  : '영혼에 각인한다'}
            </GothicButton>
          </div>
        </GothicPanel>
      ) : null}

      {narrative.modal && isModalOpen ? (
        <div className="game-modal-backdrop">
          <GothicPanel className="soul-memory-modal">
            <button className="soul-story-modal-close" onClick={() => setIsModalOpen(false)} type="button">
              x
            </button>
            <div className="soul-memory-modal-inner">
              <p className="relic-modal-eyebrow">Soul Memory</p>
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

function RelicModalPortal({ container, modal, onClose }) {
  if (!modal.relic) return null
  return createPortal(
    <div className="game-modal-backdrop">
      <div className="relic-modal-new" role="dialog" aria-modal="true">
        <div className="relic-modal-inner">
          <p className="relic-modal-eyebrow">
            <Sparkles size={12} /> Relic Acquired <Sparkles size={12} />
          </p>
          <div className="relic-modal-icon-wrap">
            <div className="relic-modal-icon-pulse" />
            <RelicIcon relic={modal.relic} className="is-large" />
          </div>
          <h3 className="relic-modal-name">{modal.relic.name}</h3>
          <p className="relic-modal-desc">{modal.relic.description}</p>
          <GothicButton onClick={onClose} variant="primary" style={{ width: '180px' }}>
            받아들인다
          </GothicButton>
        </div>
      </div>
    </div>,
    container,
  )
}

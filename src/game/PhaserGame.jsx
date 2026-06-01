import { useEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from './config'

export function PhaserGame() {
  const containerRef = useRef(null)
  const storyRef = useRef(null)
  const gameRef = useRef(null)
  const [narrative, setNarrative] = useState(null)
  const [isUiVisible, setIsUiVisible] = useState(true)

  useEffect(() => {
    const handleNarrative = (event) => {
      setNarrative(event.detail)
      requestAnimationFrame(() => {
        if (storyRef.current) {
          storyRef.current.scrollTop = 0
        }
      })
    }

    const handleVisibility = (event) => {
      setIsUiVisible(event.detail.visible)
    }

    window.addEventListener('game:narrative', handleNarrative)
    window.addEventListener('game:ui-visibility', handleVisibility)

    return () => {
      window.removeEventListener('game:narrative', handleNarrative)
      window.removeEventListener('game:ui-visibility', handleVisibility)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return undefined
    }

    gameRef.current = new Phaser.Game(createGameConfig(containerRef.current))

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  const handleChoice = (optionId) => {
    window.dispatchEvent(new CustomEvent('game:choice', { detail: { optionId } }))
  }

  return (
    <section className="game-frame" aria-label="Game canvas">
      <div className="game-canvas" ref={containerRef} />
      <StoryPanel
        narrative={narrative}
        isVisible={isUiVisible}
        storyRef={storyRef}
        onChoice={handleChoice}
      />
    </section>
  )
}

function StoryPanel({ narrative, isVisible, storyRef, onChoice }) {
  if (!narrative) {
    return null
  }

  if (narrative.layout === 'lobby-main') {
    return <LobbyMain narrative={narrative} isVisible={isVisible} onChoice={onChoice} />
  }

  if (narrative.layout === 'body-select') {
    return <BodySelectLobby narrative={narrative} isVisible={isVisible} onChoice={onChoice} />
  }

  if (narrative.layout === 'soul-nodes') {
    return <SoulNodesLobby narrative={narrative} isVisible={isVisible} onChoice={onChoice} />
  }

  return (
    <aside className={`story-panel ${isVisible ? 'is-visible' : 'is-hidden'}`}>
      <div className="story-copy" ref={storyRef}>
        <h2>{narrative.title}</h2>
        {narrative.story.map((paragraph, index) => (
          <p key={`${narrative.id}-story-${index}`}>{paragraph}</p>
        ))}
      </div>

      <div className="choice-area">
        <p className="choice-prompt">{narrative.prompt}</p>
        <div className="choice-list">
          {narrative.options.map((option, index) => (
            <button
              className="choice-button"
              disabled={option.locked || !isVisible}
              key={option.id}
              onClick={() => onChoice(option.id)}
              type="button"
            >
              <span>{`${index + 1}. ${option.locked ? '잠김' : option.label}`}</span>
              {option.detail ? <small>{option.detail}</small> : null}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function LobbyMain({ narrative, isVisible, onChoice }) {
  return (
    <aside className={`lobby-screen ${isVisible ? 'is-visible' : 'is-hidden'}`}>
      <div className="lobby-hero">
        <p className="lobby-eyebrow">LOBBY</p>
        <h2>{narrative.title}</h2>
        {narrative.story.map((paragraph, index) => (
          <p key={`${narrative.id}-story-${index}`}>{paragraph}</p>
        ))}
      </div>

      <div className="lobby-status-grid">
        <StatusCard label="영혼의 흔적" value={narrative.stats.memoryShards} />
        <StatusCard label="영혼 각인" value={`${narrative.stats.unlockedSoulNodes}개`} />
        <StatusCard label="선택 육체" value={narrative.stats.selectedBodyName} />
      </div>

      <div className="lobby-menu">
        {narrative.options.map((option) => (
          <button
            className={`lobby-menu-button ${option.variant === 'primary' ? 'is-primary' : ''}`}
            disabled={option.locked || !isVisible}
            key={option.id}
            onClick={() => onChoice(option.id)}
            type="button"
          >
            <span>{option.locked ? '잠김' : option.label}</span>
            {option.detail ? <small>{option.detail}</small> : null}
          </button>
        ))}
      </div>
    </aside>
  )
}

function BodySelectLobby({ narrative, isVisible, onChoice }) {
  const bodyOptions = narrative.options.filter((option) => option.type === 'select-body')
  const actionOptions = narrative.options.filter((option) => option.type !== 'select-body')

  return (
    <aside className={`lobby-screen body-select-screen ${isVisible ? 'is-visible' : 'is-hidden'}`}>
      <div className="lobby-topbar">
        <div>
          <p className="lobby-eyebrow">BODY SELECT</p>
          <h2>{narrative.title}</h2>
        </div>
        <button className="lobby-link-button" onClick={() => onChoice('back-to-lobby')} type="button">
          돌아가기
        </button>
      </div>

      <p className="lobby-description">{narrative.story.join(' ')}</p>

      <div className="body-card-list">
        {bodyOptions.map((option) => (
          <button
            className={`body-card ${narrative.selectedBodyId === option.body.id ? 'is-selected' : ''}`}
            disabled={!isVisible}
            key={option.id}
            onClick={() => onChoice(option.id)}
            type="button"
          >
            <CharacterAvatar classId={option.body.classId} />
            <span className="body-card-copy">
              <strong>{option.body.name}</strong>
              <small>{option.body.description}</small>
              <em>{option.detail}</em>
            </span>
          </button>
        ))}
      </div>

      <div className="lobby-menu">
        {actionOptions.map((option) => (
          <button
            className={`lobby-menu-button ${option.variant === 'primary' ? 'is-primary' : ''}`}
            disabled={option.locked || !isVisible}
            key={option.id}
            onClick={() => onChoice(option.id)}
            type="button"
          >
            <span>{option.locked ? '육체 선택 필요' : option.label}</span>
            {option.detail ? <small>{option.detail}</small> : null}
          </button>
        ))}
      </div>
    </aside>
  )
}

function SoulNodesLobby({ narrative, isVisible, onChoice }) {
  const nodeOptions = narrative.options.filter((option) => option.type === 'unlock-soul-node')
  const backOption = narrative.options.find((option) => option.type === 'back-to-lobby')
  const [selectedNodeId, setSelectedNodeId] = useState(nodeOptions[0]?.nodeId ?? null)
  const [isModalOpen, setIsModalOpen] = useState(Boolean(narrative.modal))
  const selectedNode = nodeOptions.find((option) => option.nodeId === selectedNodeId) ?? nodeOptions[0]

  return (
    <aside className={`lobby-screen soul-screen ${isVisible ? 'is-visible' : 'is-hidden'}`}>
      <div className="lobby-topbar">
        <div>
          <p className="lobby-eyebrow">SOUL ENGRAVING</p>
          <h2>{narrative.title}</h2>
        </div>
        <button className="lobby-link-button" onClick={() => onChoice(backOption?.id ?? 'back-to-lobby')} type="button">
          돌아가기
        </button>
      </div>

      <p className="lobby-description">{narrative.story.join(' ')}</p>

      <div className="soul-board">
        <div className="soul-node-map" aria-label="영혼 각인 노드">
          <div className="soul-node-canvas">
            <div className="soul-node-canvas-inner">
              <svg className="soul-node-links" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
                {nodeOptions.flatMap((option) =>
                  option.requirements.map((requiredId) => {
                    const parent = nodeOptions.find((node) => node.nodeId === requiredId)
                    if (!parent?.position || !option.position) {
                      return null
                    }

                    const isActive = parent.unlocked && option.unlocked

                    return (
                      <line
                        className={isActive ? 'is-active' : ''}
                        key={`${requiredId}-${option.nodeId}`}
                        x1={parent.position.x}
                        x2={option.position.x}
                        y1={parent.position.y}
                        y2={option.position.y}
                      />
                    )
                  }),
                )}
              </svg>
              {nodeOptions.map((option) => (
                <button
                  className={`soul-hex-node route-${option.route} ${option.unlocked ? 'is-unlocked' : ''} ${
                    option.locked ? 'is-locked' : ''
                  } ${selectedNode?.nodeId === option.nodeId ? 'is-selected' : ''}`}
                  disabled={!isVisible}
                  key={option.id}
                  onClick={() => setSelectedNodeId(option.nodeId)}
                  style={{ '--node-x': `${option.position?.x ?? 50}%`, '--node-y': `${option.position?.y ?? 50}%` }}
                  type="button"
                >
                  <SoulNodeIcon type={option.iconType} />
                  <span>{option.summary}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedNode ? (
          <div className="soul-node-detail" role="status">
            <div className="soul-node-detail-main">
              <p className="lobby-eyebrow">선택한 각인</p>
              <h3>{selectedNode.label}</h3>
              <strong>{selectedNode.summary}</strong>
              <p>{selectedNode.abilityDescription}</p>
              <small>
                {selectedNode.unlocked
                  ? '이미 영혼에 새겨진 각인입니다.'
                  : selectedNode.locked
                    ? `필요 조건: ${
                        selectedNode.requirementLabels.length ? selectedNode.requirementLabels.join(', ') : '영혼의 흔적'
                      }`
                    : '새길 수 있는 각인입니다.'}
              </small>
            </div>
            <div className="soul-node-detail-action">
              <small>영혼의 흔적 {selectedNode.cost}</small>
              <button
                className="lobby-menu-button is-primary"
                disabled={selectedNode.locked || selectedNode.unlocked || !isVisible}
                onClick={() => onChoice(selectedNode.id)}
                type="button"
              >
                <span>{selectedNode.unlocked ? '각인 완료' : '각인'}</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {narrative.modal && isModalOpen ? (
        <div className="soul-story-modal-backdrop">
          <div className="soul-story-modal" role="dialog" aria-modal="true" aria-label={narrative.modal.title}>
            <button className="soul-story-modal-close" onClick={() => setIsModalOpen(false)} type="button">
              x
            </button>
            <p className="lobby-eyebrow">SOUL MEMORY</p>
            <h3>{narrative.modal.title}</h3>
            <p>{narrative.modal.story}</p>
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function SoulNodeIcon({ type }) {
  return (
    <span className={`soul-node-icon icon-${type}`} aria-hidden="true">
      <span />
    </span>
  )
}

function StatusCard({ label, value }) {
  return (
    <div className="lobby-status-card">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  )
}

function CharacterAvatar({ classId }) {
  return (
    <span className={`character-avatar avatar-${classId}`} aria-hidden="true">
      <span className="avatar-head" />
      <span className="avatar-body" />
      <span className="avatar-weapon" />
    </span>
  )
}

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

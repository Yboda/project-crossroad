import { useCallback, useEffect, useState } from 'react'
import { DEV_SCREEN_GROUPS } from './devScreens'

export function DevToolsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [lastScreenId, setLastScreenId] = useState(null)

  const previewScreen = useCallback((screenId) => {
    setLastScreenId(screenId)
    setIsPreviewActive(true)
    window.dispatchEvent(new CustomEvent('game:dev-preview', { detail: { screenId } }))
  }, [])

  const exitPreview = useCallback(() => {
    setIsPreviewActive(false)
    window.dispatchEvent(new CustomEvent('game:dev-exit-preview'))
  }, [])

  const toggleUiVisible = useCallback(() => {
    window.dispatchEvent(new CustomEvent('game:dev-toggle-ui'))
  }, [])

  useEffect(() => {
    const onPreviewState = (event) => {
      setIsPreviewActive(Boolean(event.detail?.active))
      if (event.detail?.screenId) setLastScreenId(event.detail.screenId)
    }
    window.addEventListener('game:dev-preview-state', onPreviewState)
    return () => window.removeEventListener('game:dev-preview-state', onPreviewState)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === '`' || (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd')) {
        event.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <div className={`dev-tools ${isOpen ? 'is-open' : ''}`} aria-label="개발자 도구">
      <button
        type="button"
        className="dev-tools-toggle"
        onClick={() => setIsOpen((open) => !open)}
        title="개발자 도구 (`)"
      >
        DEV
      </button>

      {isOpen ? (
        <div className="dev-tools-panel">
          <header className="dev-tools-header">
            <strong>화면 미리보기</strong>
            <span className="dev-tools-hint">` 키로 열기/닫기</span>
          </header>

          {isPreviewActive ? (
            <div className="dev-tools-banner">
              <span>미리보기 모드{lastScreenId ? ` · ${lastScreenId}` : ''}</span>
              <button type="button" className="dev-tools-exit" onClick={exitPreview}>
                종료
              </button>
            </div>
          ) : null}

          <div className="dev-tools-actions">
            <button type="button" className="dev-tools-action" onClick={toggleUiVisible}>
              UI 표시 토글
            </button>
          </div>

          <div className="dev-tools-groups">
            {DEV_SCREEN_GROUPS.map((group) => (
              <section key={group.id} className="dev-tools-group">
                <h3>{group.label}</h3>
                <ul>
                  {group.screens.map((screen) => (
                    <li key={screen.id}>
                      <button type="button" onClick={() => previewScreen(screen.id)}>
                        {screen.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

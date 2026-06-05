import { useCallback, useEffect, useState } from 'react'
import { getDevEnemyCatalog } from '../data/enemies'
import { DEV_COMBAT_SCREEN_IDS, DEV_SCREEN_GROUPS } from './devScreens'
import { getDevSettings, setDevSetting } from './devSettings'

const DEV_ENEMY_CATALOG = getDevEnemyCatalog()
const DEFAULT_DEV_ENEMY_ID = 'starving-wolf'

const DEV_VISUAL_TOGGLES = [
  {
    key: 'disableBackgroundDim',
    label: '배경 딤 끄기',
    hint: 'Phaser 검은 오버레이 해제',
  },
  {
    key: 'enableBackgroundTint',
    label: '배경 틴트 켜기',
    hint: '모든 방에 틴트 적용 (방별 tint 있으면 그 값, 없으면 기본값)',
  },
  {
    key: 'disableScreenGradient',
    label: 'UI 그라데이션 끄기',
    hint: '전투·탐험·상점 하단 어둠 해제',
  },
  {
    key: 'disableEnemyPortraitEffects',
    label: '몬스터 연출 끄기',
    hint: '필터·비네트·하단 페이드 해제',
  },
]

export function DevToolsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPreviewActive, setIsPreviewActive] = useState(false)
  const [lastScreenId, setLastScreenId] = useState(null)
  const [selectedEnemyId, setSelectedEnemyId] = useState(DEFAULT_DEV_ENEMY_ID)
  const [devSettings, setDevSettingsState] = useState(getDevSettings)

  const previewScreen = useCallback((screenId, enemyId = selectedEnemyId) => {
    setLastScreenId(screenId)
    setIsPreviewActive(true)
    if (enemyId) setSelectedEnemyId(enemyId)
    window.dispatchEvent(
      new CustomEvent('game:dev-preview', { detail: { screenId, enemyId } }),
    )
  }, [selectedEnemyId])

  const exitPreview = useCallback(() => {
    setIsPreviewActive(false)
    window.dispatchEvent(new CustomEvent('game:dev-exit-preview'))
  }, [])

  const toggleUiVisible = useCallback(() => {
    window.dispatchEvent(new CustomEvent('game:dev-toggle-ui'))
  }, [])

  const handleVisualToggle = useCallback((key) => (event) => {
    setDevSetting(key, event.target.checked)
  }, [])

  const previewCombatWithEnemy = useCallback(
    (enemyId) => {
      setSelectedEnemyId(enemyId)
      const screenId =
        lastScreenId && DEV_COMBAT_SCREEN_IDS.has(lastScreenId) ? lastScreenId : 'combat'
      previewScreen(screenId, enemyId)
    },
    [lastScreenId, previewScreen],
  )

  useEffect(() => {
    const onPreviewState = (event) => {
      setIsPreviewActive(Boolean(event.detail?.active))
      if (event.detail?.screenId) setLastScreenId(event.detail.screenId)
      if (event.detail?.enemyId) setSelectedEnemyId(event.detail.enemyId)
    }
    const onDevSettings = (event) => {
      setDevSettingsState({ ...getDevSettings(), ...event.detail })
    }
    window.addEventListener('game:dev-preview-state', onPreviewState)
    window.addEventListener('game:dev-settings', onDevSettings)
    return () => {
      window.removeEventListener('game:dev-preview-state', onPreviewState)
      window.removeEventListener('game:dev-settings', onDevSettings)
    }
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

          <section className="dev-tools-visual">
            <h3>배경/연출 비교</h3>
            {DEV_VISUAL_TOGGLES.map((toggle) => (
              <label key={toggle.key} className="dev-tools-toggle-row">
                <input
                  type="checkbox"
                  checked={Boolean(devSettings[toggle.key])}
                  onChange={handleVisualToggle(toggle.key)}
                />
                <span>
                  {toggle.label}
                  <small>{toggle.hint}</small>
                </span>
              </label>
            ))}
          </section>

          <section className="dev-tools-enemy-picker">
            <h3>전투 적 선택</h3>
            <label className="dev-tools-enemy-select-wrap">
              <span className="dev-tools-enemy-select-label">적</span>
              <select
                className="dev-tools-enemy-select"
                value={selectedEnemyId}
                onChange={(event) => previewCombatWithEnemy(event.target.value)}
              >
                {DEV_ENEMY_CATALOG.map((enemy) => (
                  <option key={enemy.id} value={enemy.id}>
                    {enemy.name}
                  </option>
                ))}
              </select>
            </label>
            <ul className="dev-tools-enemy-quick">
              {DEV_ENEMY_CATALOG.map((enemy) => (
                <li key={`quick-${enemy.id}`}>
                  <button
                    type="button"
                    className={selectedEnemyId === enemy.id ? 'is-selected' : ''}
                    onClick={() => previewCombatWithEnemy(enemy.id)}
                  >
                    {enemy.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>

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

const STORAGE_PREFIX = 'dev-setting-'

export const DEV_VISUAL_SETTING_KEYS = [
  'disableBackgroundDim',
  'enableBackgroundTint',
  'disableScreenGradient',
  'disableEnemyPortraitEffects',
]

const DEV_SETTING_DEFAULTS = {
  disableBackgroundDim: false,
  enableBackgroundTint: false,
  disableScreenGradient: false,
  disableEnemyPortraitEffects: false,
}

function readSetting(key) {
  if (!import.meta.env.DEV) return false
  try {
    if (key === 'disableBackgroundDim') {
      const legacy = sessionStorage.getItem('dev-disable-bg-dim')
      if (legacy != null) return legacy === '1'
    }
    if (key === 'enableBackgroundTint') {
      const legacyDisable = sessionStorage.getItem(`${STORAGE_PREFIX}disableBackgroundTint`)
      if (legacyDisable != null) return legacyDisable !== '1'
    }
    const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (stored == null) return DEV_SETTING_DEFAULTS[key] ?? false
    return stored === '1'
  } catch {
    return DEV_SETTING_DEFAULTS[key] ?? false
  }
}

function writeSetting(key, value) {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, value ? '1' : '0')
  } catch {
    /* ignore */
  }
}

const settings = Object.fromEntries(
  DEV_VISUAL_SETTING_KEYS.map((key) => [key, readSetting(key)]),
)

function emitSettings() {
  window.dispatchEvent(
    new CustomEvent('game:dev-settings', {
      detail: { ...settings },
    }),
  )
}

export function getDevSettings() {
  return { ...settings }
}

export function setDevSetting(key, value) {
  if (!import.meta.env.DEV || !DEV_VISUAL_SETTING_KEYS.includes(key)) return

  settings[key] = Boolean(value)
  writeSetting(key, settings[key])
  emitSettings()
}

export function isDevBackgroundDimDisabled() {
  return import.meta.env.DEV && settings.disableBackgroundDim
}

export function isDevBackgroundTintEnabled() {
  return import.meta.env.DEV && settings.enableBackgroundTint
}

export function isDevScreenGradientDisabled() {
  return import.meta.env.DEV && settings.disableScreenGradient
}

export function isDevEnemyPortraitEffectsDisabled() {
  return import.meta.env.DEV && settings.disableEnemyPortraitEffects
}

/** @deprecated use getDevSettings().disableBackgroundDim */
export function getDevBackgroundDimDisabled() {
  return settings.disableBackgroundDim
}

/** @deprecated use setDevSetting('disableBackgroundDim', value) */
export function setDevBackgroundDimDisabled(value) {
  setDevSetting('disableBackgroundDim', value)
}

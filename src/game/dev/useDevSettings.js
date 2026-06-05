import { useEffect, useState } from 'react'
import { getDevSettings } from './devSettings'

export function useDevSettings() {
  const [settings, setSettings] = useState(getDevSettings)

  useEffect(() => {
    const onDevSettings = (event) => {
      setSettings({ ...getDevSettings(), ...event.detail })
    }
    window.addEventListener('game:dev-settings', onDevSettings)
    return () => window.removeEventListener('game:dev-settings', onDevSettings)
  }, [])

  return settings
}

import { createDefaultPersistentState } from './soulEngravingSystem'

const SAVE_KEY = 'bora-loop-roguelike-save-v1'

export function loadPersistentState() {
  try {
    const raw = globalThis.localStorage?.getItem(SAVE_KEY)
    return raw ? { ...createDefaultPersistentState(), ...JSON.parse(raw) } : createDefaultPersistentState()
  } catch {
    return createDefaultPersistentState()
  }
}

export function savePersistentState(state) {
  globalThis.localStorage?.setItem(SAVE_KEY, JSON.stringify(state))
}

export function settleRun(runState, persistentState, reason) {
  const gained = runState.memoryShards + (reason === 'fake-ending' ? 3 : 0)
  persistentState.memoryShards += gained
  if (reason && !persistentState.endingsSeen.includes(reason)) {
    persistentState.endingsSeen.push(reason)
  }
  savePersistentState(persistentState)
  return gained
}

const STORAGE_KEY = 'shopping-memo-app-state'

export function loadState() {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)

    if (!serializedState) {
      return undefined
    }

    return JSON.parse(serializedState)
  } catch {
    return undefined
  }
}

export function saveState(state) {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, serializedState)
  } catch {
    // ignore write errors for now
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore write errors for now
  }
}

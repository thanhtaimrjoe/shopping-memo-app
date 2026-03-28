import { configureStore } from '@reduxjs/toolkit'
import { mealsReducer } from '../features/meals/mealsSlice.js'
import { plannerReducer } from '../features/planner/plannerSlice.js'
import { productsReducer } from '../features/products/productsSlice.js'
import { loadState, saveState } from './storage.js'
import { buildFallbackState, fetchRemoteState, persistRemoteState } from './supabaseState.js'

export function createAppStore(preloadedState) {
  const store = configureStore({
    reducer: {
      meals: mealsReducer,
      products: productsReducer,
      planner: plannerReducer,
    },
    preloadedState,
  })

  let persistTimer = null

  store.subscribe(() => {
    const state = {
      meals: store.getState().meals,
      products: store.getState().products,
      planner: store.getState().planner,
    }

    saveState(state)

    window.clearTimeout(persistTimer)
    persistTimer = window.setTimeout(() => {
      persistRemoteState(state)
    }, 500)
  })

  return store
}

export async function bootstrapStore() {
  const localState = loadState()
  const remoteState = await fetchRemoteState()

  const initialState = remoteState ?? localState ?? buildFallbackState()
  const store = createAppStore(initialState)

  if (!remoteState) {
    persistRemoteState(initialState)
  }

  return store
}

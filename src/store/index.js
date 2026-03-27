import { configureStore } from '@reduxjs/toolkit'
import { mealsReducer } from '../features/meals/mealsSlice.js'
import { plannerReducer } from '../features/planner/plannerSlice.js'
import { productsReducer } from '../features/products/productsSlice.js'
import { loadState, saveState } from './storage.js'

const preloadedState = loadState()

export const store = configureStore({
  reducer: {
    meals: mealsReducer,
    products: productsReducer,
    planner: plannerReducer,
  },
  preloadedState,
})

store.subscribe(() => {
  saveState({
    meals: store.getState().meals,
    products: store.getState().products,
    planner: store.getState().planner,
  })
})

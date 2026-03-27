import { configureStore } from '@reduxjs/toolkit'
import { mealsReducer } from '../features/meals/mealsSlice.js'
import { productsReducer } from '../features/products/productsSlice.js'
import { plannerReducer } from '../features/planner/plannerSlice.js'

export const store = configureStore({
  reducer: {
    meals: mealsReducer,
    products: productsReducer,
    planner: plannerReducer,
  },
})

import { createSlice } from '@reduxjs/toolkit'
import { initialMeals } from '../../store/sampleData.js'
import { createId, normalizeText } from '../../utils/helpers.js'

const mealsSlice = createSlice({
  name: 'meals',
  initialState: {
    items: initialMeals,
    searchText: '',
  },
  reducers: {
    addMeal: (state, action) => {
      const { name, ingredients } = action.payload
      const normalizedName = normalizeText(name)
      const exists = state.items.some((meal) => normalizeText(meal.name) === normalizedName)

      if (exists) {
        return
      }

      state.items.unshift({
        id: createId('meal'),
        name: name.trim(),
        ingredients,
      })
    },
    updateMeal: (state, action) => {
      const { id, name, ingredients } = action.payload
      const targetMeal = state.items.find((meal) => meal.id === id)

      if (!targetMeal) {
        return
      }

      targetMeal.name = name.trim()
      targetMeal.ingredients = ingredients
    },
    deleteMeal: (state, action) => {
      state.items = state.items.filter((meal) => meal.id !== action.payload)
    },
    setMealSearchText: (state, action) => {
      state.searchText = action.payload
    },
  },
})

export const { addMeal, updateMeal, deleteMeal, setMealSearchText } = mealsSlice.actions
export const mealsReducer = mealsSlice.reducer

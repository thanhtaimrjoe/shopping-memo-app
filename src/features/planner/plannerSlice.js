import { createSelector, createSlice } from '@reduxjs/toolkit'
import { initialWeeklyPlan } from '../../store/sampleData.js'
import { createId } from '../../utils/helpers.js'

const plannerSlice = createSlice({
  name: 'planner',
  initialState: {
    currentPlan: initialWeeklyPlan,
  },
  reducers: {
    setWeekLabel: (state, action) => {
      state.currentPlan.weekLabel = action.payload
    },
    setMealsForDay: (state, action) => {
      const { dayKey, mealIds } = action.payload
      state.currentPlan.days[dayKey] = mealIds
    },
    addExtraItem: (state, action) => {
      const name = action.payload.trim()

      if (!name) {
        return
      }

      state.currentPlan.extraItems.unshift({
        id: createId('extra'),
        name,
        checked: false,
        note: '',
      })
    },
    updateExtraItem: (state, action) => {
      const { id, name, note } = action.payload
      const targetItem = state.currentPlan.extraItems.find((item) => item.id === id)

      if (!targetItem) {
        return
      }

      targetItem.name = name
      targetItem.note = note
    },
    toggleExtraItemChecked: (state, action) => {
      const targetItem = state.currentPlan.extraItems.find((item) => item.id === action.payload)

      if (!targetItem) {
        return
      }

      targetItem.checked = !targetItem.checked
    },
    deleteExtraItem: (state, action) => {
      state.currentPlan.extraItems = state.currentPlan.extraItems.filter((item) => item.id !== action.payload)
    },
    updatePlanNotes: (state, action) => {
      state.currentPlan.notes = action.payload
    },
  },
})

export const {
  setWeekLabel,
  setMealsForDay,
  addExtraItem,
  updateExtraItem,
  toggleExtraItemChecked,
  deleteExtraItem,
  updatePlanNotes,
} = plannerSlice.actions

export const plannerReducer = plannerSlice.reducer

const selectMeals = (state) => state.meals.items
const selectPlan = (state) => state.planner.currentPlan

export const selectChecklistItems = createSelector([selectPlan, selectMeals], (plan, meals) => {
  const mealMap = Object.fromEntries(meals.map((meal) => [meal.id, meal]))
  const ingredientMap = new Map()

  Object.entries(plan.days).forEach(([dayKey, mealIds]) => {
    mealIds.forEach((mealId) => {
      const meal = mealMap[mealId]

      if (!meal) {
        return
      }

      meal.ingredients.forEach((ingredient) => {
        const existing = ingredientMap.get(ingredient)

        if (existing) {
          existing.dayKeys.push(dayKey)
          existing.mealNames.push(meal.name)
          return
        }

        ingredientMap.set(ingredient, {
          id: `ingredient-${ingredient}`,
          name: ingredient,
          source: 'ingredient',
          checked: false,
          note: '',
          dayKeys: [dayKey],
          mealNames: [meal.name],
        })
      })
    })
  })

  const ingredientItems = Array.from(ingredientMap.values())
  const extraItems = plan.extraItems.map((item) => ({
    ...item,
    source: 'extra',
    dayKeys: [],
    mealNames: [],
  }))

  return [...ingredientItems, ...extraItems]
})

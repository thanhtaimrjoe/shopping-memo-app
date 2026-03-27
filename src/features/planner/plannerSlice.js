import { createSelector, createSlice } from '@reduxjs/toolkit'
import { createInitialWeeklyPlan } from '../../store/sampleData.js'
import { createId } from '../../utils/helpers.js'

const plannerSlice = createSlice({
  name: 'planner',
  initialState: {
    currentPlan: createInitialWeeklyPlan(),
    checklistState: {},
    checklistFilter: 'all',
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
    toggleChecklistItemChecked: (state, action) => {
      const itemId = action.payload
      const currentState = state.checklistState[itemId] ?? { checked: false, note: '' }
      state.checklistState[itemId] = {
        ...currentState,
        checked: !currentState.checked,
      }
    },
    updateChecklistItemNote: (state, action) => {
      const { id, note } = action.payload
      const currentState = state.checklistState[id] ?? { checked: false, note: '' }
      state.checklistState[id] = {
        ...currentState,
        note,
      }
    },
    setChecklistFilter: (state, action) => {
      state.checklistFilter = action.payload
    },
    replacePlan: (state, action) => {
      state.currentPlan = action.payload
      state.checklistState = {}
      state.checklistFilter = 'all'
    },
    resetPlannerState: (state) => {
      state.currentPlan = createInitialWeeklyPlan()
      state.checklistState = {}
      state.checklistFilter = 'all'
    },
    clearPlannerState: (state) => {
      state.currentPlan = {
        id: createId('plan'),
        weekLabel: '',
        notes: '',
        days: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
        extraItems: [],
      }
      state.checklistState = {}
      state.checklistFilter = 'all'
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
  toggleChecklistItemChecked,
  updateChecklistItemNote,
  setChecklistFilter,
  replacePlan,
  resetPlannerState,
  clearPlannerState,
} = plannerSlice.actions

export const plannerReducer = plannerSlice.reducer

const selectMeals = (state) => state.meals.items
const selectPlan = (state) => state.planner.currentPlan
const selectChecklistState = (state) => state.planner.checklistState
const selectChecklistFilterValue = (state) => state.planner.checklistFilter

export const selectChecklistItems = createSelector([selectPlan, selectMeals, selectChecklistState], (plan, meals, checklistState) => {
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

        const persistedState = checklistState[`ingredient-${ingredient}`] ?? { checked: false, note: '' }

        ingredientMap.set(ingredient, {
          id: `ingredient-${ingredient}`,
          name: ingredient,
          source: 'ingredient',
          checked: persistedState.checked,
          note: persistedState.note,
          dayKeys: [dayKey],
          mealNames: [meal.name],
        })
      })
    })
  })

  const ingredientItems = Array.from(ingredientMap.values())
  const extraItems = plan.extraItems.map((item) => {
    const persistedState = checklistState[item.id] ?? { checked: item.checked, note: item.note }

    return {
      ...item,
      checked: persistedState.checked,
      note: persistedState.note,
      source: 'extra',
      dayKeys: [],
      mealNames: [],
    }
  })

  return [...ingredientItems, ...extraItems]
})

export const selectFilteredChecklistItems = createSelector(
  [selectChecklistItems, selectChecklistFilterValue],
  (items, filter) => {
    if (filter === 'pending') {
      return items.filter((item) => !item.checked)
    }

    if (filter === 'done') {
      return items.filter((item) => item.checked)
    }

    return items
  },
)

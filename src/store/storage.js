import { createId, isUuid } from '../utils/helpers.js'

const STORAGE_KEY = 'shopping-memo-app-state'

const emptyDays = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
}

function sanitizeItems(items, mapper) {
  if (!Array.isArray(items)) {
    return []
  }

  return items.map(mapper)
}

function sanitizePersistedState(state) {
  if (!state || typeof state !== 'object') {
    return undefined
  }

  const mealIdMap = new Map()

  const meals = {
    items: sanitizeItems(state.meals?.items, (meal) => {
      const nextId = isUuid(meal?.id) ? meal.id : createId()

      if (meal?.id) {
        mealIdMap.set(meal.id, nextId)
      }

      return {
        id: nextId,
        name: typeof meal?.name === 'string' ? meal.name : '',
        ingredients: Array.isArray(meal?.ingredients) ? meal.ingredients : [],
      }
    }),
    searchText: typeof state.meals?.searchText === 'string' ? state.meals.searchText : '',
  }

  const products = {
    items: sanitizeItems(state.products?.items, (product) => ({
      id: isUuid(product?.id) ? product.id : createId(),
      name: typeof product?.name === 'string' ? product.name : '',
      image: typeof product?.image === 'string' ? product.image : '',
    })),
    searchText: typeof state.products?.searchText === 'string' ? state.products.searchText : '',
  }

  const currentPlan = state.planner?.currentPlan ?? {}
  const sanitizedDays = Object.fromEntries(
    Object.entries({ ...emptyDays, ...(currentPlan.days ?? {}) }).map(([dayKey, mealIds]) => [
      dayKey,
      Array.isArray(mealIds)
        ? mealIds.map((mealId) => mealIdMap.get(mealId) ?? mealId).filter((mealId) => isUuid(mealId))
        : [],
    ]),
  )

  const planner = {
    currentPlan: {
      id: isUuid(currentPlan.id) ? currentPlan.id : createId(),
      weekLabel: typeof currentPlan.weekLabel === 'string' ? currentPlan.weekLabel : '',
      notes: typeof currentPlan.notes === 'string' ? currentPlan.notes : '',
      days: sanitizedDays,
      extraItems: sanitizeItems(currentPlan.extraItems, (item) => ({
        id: typeof item?.id === 'string' && item.id ? item.id : createId(),
        name: typeof item?.name === 'string' ? item.name : '',
        checked: Boolean(item?.checked),
        note: typeof item?.note === 'string' ? item.note : '',
      })),
    },
    checklistState: typeof state.planner?.checklistState === 'object' && state.planner?.checklistState !== null
      ? state.planner.checklistState
      : {},
    checklistFilter: typeof state.planner?.checklistFilter === 'string' ? state.planner.checklistFilter : 'all',
    lastChecklistToggle: state.planner?.lastChecklistToggle ?? null,
  }

  return {
    meals,
    products,
    planner,
  }
}

export function loadState() {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)

    if (!serializedState) {
      return undefined
    }

    return sanitizePersistedState(JSON.parse(serializedState))
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

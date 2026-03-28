import { supabase } from '../lib/supabase.js'
import { createInitialWeeklyPlan, initialMeals, initialProducts } from './sampleData.js'

const emptyDays = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
}

const buildFallbackState = () => ({
  meals: {
    items: initialMeals,
    searchText: '',
  },
  products: {
    items: initialProducts,
    searchText: '',
  },
  planner: {
    currentPlan: createInitialWeeklyPlan(),
    checklistState: {},
    checklistFilter: 'all',
    lastChecklistToggle: null,
  },
})

export async function fetchRemoteState() {
  try {
    const [productsResponse, mealsResponse, weeklyPlansResponse] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('meals').select('*').order('created_at', { ascending: false }),
      supabase.from('weekly_plans').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
    ])

    if (productsResponse.error || mealsResponse.error || weeklyPlansResponse.error) {
      console.error('Failed to fetch Supabase state', {
        productsError: productsResponse.error,
        mealsError: mealsResponse.error,
        weeklyPlansError: weeklyPlansResponse.error,
      })
      return undefined
    }

    const hasRemoteData =
      (productsResponse.data?.length ?? 0) > 0 ||
      (mealsResponse.data?.length ?? 0) > 0 ||
      Boolean(weeklyPlansResponse.data)

    if (!hasRemoteData) {
      return undefined
    }

    return {
      meals: {
        items:
          mealsResponse.data?.length
            ? mealsResponse.data.map((meal) => ({
                id: meal.id,
                name: meal.name,
                ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
              }))
            : initialMeals,
        searchText: '',
      },
      products: {
        items:
          productsResponse.data?.map((product) => ({
            id: product.id,
            name: product.name,
            image: product.image_url ?? '',
          })) ?? initialProducts,
        searchText: '',
      },
      planner: {
        currentPlan: weeklyPlansResponse.data
          ? {
              id: weeklyPlansResponse.data.id,
              weekLabel: weeklyPlansResponse.data.week_label,
              notes: weeklyPlansResponse.data.notes ?? '',
              days: { ...emptyDays, ...(weeklyPlansResponse.data.days ?? {}) },
              extraItems: Array.isArray(weeklyPlansResponse.data.extra_items)
                ? weeklyPlansResponse.data.extra_items
                : [],
            }
          : createInitialWeeklyPlan(),
        checklistState: {},
        checklistFilter: 'all',
        lastChecklistToggle: null,
      },
    }
  } catch (error) {
    console.error('Unexpected Supabase fetch error', error)
    return undefined
  }
}

export async function persistRemoteState(state) {
  try {
    const productRows = state.products.items.map((product) => ({
      id: product.id,
      name: product.name,
      image_url: product.image || null,
    }))

    const mealRows = state.meals.items.map((meal) => ({
      id: meal.id,
      name: meal.name,
      ingredients: meal.ingredients,
    }))

    const weeklyPlanRow = {
      id: state.planner.currentPlan.id,
      week_label: state.planner.currentPlan.weekLabel,
      notes: state.planner.currentPlan.notes,
      days: state.planner.currentPlan.days,
      extra_items: state.planner.currentPlan.extraItems,
    }

    const [productsUpsert, mealsUpsert, weeklyPlanUpsert] = await Promise.all([
      productRows.length
        ? supabase.from('products').upsert(productRows, { onConflict: 'id' })
        : Promise.resolve({ error: null }),
      mealRows.length ? supabase.from('meals').upsert(mealRows, { onConflict: 'id' }) : Promise.resolve({ error: null }),
      supabase.from('weekly_plans').upsert(weeklyPlanRow, { onConflict: 'id' }),
    ])

    if (productsUpsert.error || mealsUpsert.error || weeklyPlanUpsert.error) {
      console.error('Failed to persist Supabase state', {
        productsError: productsUpsert.error,
        mealsError: mealsUpsert.error,
        weeklyPlansError: weeklyPlanUpsert.error,
      })
      return
    }

    if (productRows.length) {
      const productIds = productRows.map((product) => product.id).join(',')
      await supabase.from('products').delete().not('id', 'in', `(${productIds})`)
    }

    if (mealRows.length) {
      const mealIds = mealRows.map((meal) => meal.id).join(',')
      await supabase.from('meals').delete().not('id', 'in', `(${mealIds})`)
    }

    await supabase.from('weekly_plans').delete().neq('id', weeklyPlanRow.id)
  } catch (error) {
    console.error('Unexpected Supabase persist error', error)
  }
}

export { buildFallbackState }

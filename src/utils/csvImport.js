import Papa from 'papaparse'
import { createId, normalizeText } from './helpers.js'

const dayLabelMap = {
  'thứ hai': 'monday',
  'thứ ba': 'tuesday',
  'thứ tư': 'wednesday',
  'thứ năm': 'thursday',
  'thứ sáu': 'friday',
  'thứ bảy': 'saturday',
  'chủ nhật': 'sunday',
}

const baseDays = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
}

export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    })
  })
}

export function buildDatabaseImport(rows) {
  const mealMap = new Map()
  const productMap = new Map()

  rows.forEach((row) => {
    const productName = row['Tên sản phẩm']?.trim()
    const mealName = row['Tên món ăn']?.trim()
    const ingredientText = row['Nguyên liệu']?.trim()

    if (productName && normalizeText(productName) !== 'none') {
      const normalizedProductName = normalizeText(productName)

      if (!productMap.has(normalizedProductName)) {
        productMap.set(normalizedProductName, {
          id: createId('product'),
          name: productName,
        })
      }
    }

    if (mealName && normalizeText(mealName) !== 'none') {
      const normalizedMealName = normalizeText(mealName)
      const ingredients = ingredientText
        ? ingredientText
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : []

      if (!mealMap.has(normalizedMealName)) {
        mealMap.set(normalizedMealName, {
          id: createId('meal'),
          name: mealName,
          ingredients,
        })
      }
    }
  })

  return {
    meals: Array.from(mealMap.values()),
    products: Array.from(productMap.values()),
  }
}

export function buildWeeklyPlanImport(rows, meals) {
  const mealIdByName = new Map(meals.map((meal) => [normalizeText(meal.name), meal.id]))
  const days = structuredClone(baseDays)
  const extraItems = []

  rows.forEach((row) => {
    const dayLabel = row['Thứ']?.trim()
    const mealName = row['Tên món']?.trim()
    const note = row['Note']?.trim() ?? ''
    const checked = String(row['Check'] ?? '').trim().toLowerCase() === 'true'

    if (!mealName || normalizeText(mealName) === 'none') {
      return
    }

    if (normalizeText(dayLabel) === 'mua thêm') {
      mealName
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => {
          extraItems.push({
            id: createId('extra'),
            name: item,
            checked,
            note,
          })
        })
      return
    }

    const dayKey = dayLabelMap[normalizeText(dayLabel)]
    const mealId = mealIdByName.get(normalizeText(mealName))

    if (dayKey && mealId) {
      days[dayKey].push(mealId)
    }
  })

  return {
    id: createId('plan'),
    weekLabel: 'Imported weekly plan',
    notes: '',
    days,
    extraItems,
  }
}

import { createSlice } from '@reduxjs/toolkit'
import { initialProducts } from '../../store/sampleData.js'
import { createId, normalizeText } from '../../utils/helpers.js'

const getProductPayload = (payload) => {
  if (typeof payload === 'string') {
    return {
      id: createId(),
      name: payload,
      image: '',
    }
  }

  return {
    id: payload?.id ?? createId(),
    name: payload?.name ?? '',
    image: payload?.image ?? '',
  }
}

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: initialProducts,
    searchText: '',
  },
  reducers: {
    addProduct: (state, action) => {
      const { id, name, image } = getProductPayload(action.payload)
      const trimmedName = name.trim()
      const normalizedName = normalizeText(trimmedName)
      const exists = state.items.some((product) => normalizeText(product.name) === normalizedName)

      if (exists || !trimmedName) {
        return
      }

      state.items.unshift({
        id,
        name: trimmedName,
        image,
      })
    },
    updateProduct: (state, action) => {
      const { id } = action.payload
      const { name, image } = getProductPayload(action.payload)
      const trimmedName = name.trim()
      const targetProduct = state.items.find((product) => product.id === id)
      const duplicatedName = state.items.some(
        (product) => product.id !== id && normalizeText(product.name) === normalizeText(trimmedName),
      )

      if (!targetProduct || !trimmedName || duplicatedName) {
        return
      }

      targetProduct.name = trimmedName
      targetProduct.image = image
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter((product) => product.id !== action.payload)
    },
    setProductSearchText: (state, action) => {
      state.searchText = action.payload
    },
  },
})

export const { addProduct, updateProduct, deleteProduct, setProductSearchText } = productsSlice.actions
export const productsReducer = productsSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { initialProducts } from '../../store/sampleData.js'
import { createId, normalizeText } from '../../utils/helpers.js'

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: initialProducts,
    searchText: '',
  },
  reducers: {
    addProduct: (state, action) => {
      const name = action.payload.trim()
      const normalizedName = normalizeText(name)
      const exists = state.items.some((product) => normalizeText(product.name) === normalizedName)

      if (exists || !name) {
        return
      }

      state.items.unshift({
        id: createId('product'),
        name,
      })
    },
    updateProduct: (state, action) => {
      const { id, name } = action.payload
      const targetProduct = state.items.find((product) => product.id === id)

      if (!targetProduct) {
        return
      }

      targetProduct.name = name.trim()
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

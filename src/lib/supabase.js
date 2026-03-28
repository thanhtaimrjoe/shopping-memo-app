import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const productImagesBucket = 'product-images'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadProductImage({ productId, file }) {
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
  const filePath = `products/${productId}/${Date.now()}-${safeFileName}`

  const { error } = await supabase.storage.from(productImagesBucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from(productImagesBucket).getPublicUrl(filePath)
  return data.publicUrl
}

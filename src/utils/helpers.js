export const createId = (prefix) => `${prefix}-${crypto.randomUUID()}`

export const normalizeText = (value) => value.trim().toLowerCase()

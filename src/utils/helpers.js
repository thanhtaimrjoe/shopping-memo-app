export const createId = () => {
  const cryptoApi = globalThis.crypto

  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID()
  }

  if (cryptoApi?.getRandomValues) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const randomValue = cryptoApi.getRandomValues(new Uint8Array(1))[0] & 15
      const nextValue = char === 'x' ? randomValue : (randomValue & 3) | 8
      return nextValue.toString(16)
    })
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const randomValue = Math.floor(Math.random() * 16)
    const nextValue = char === 'x' ? randomValue : (randomValue & 3) | 8
    return nextValue.toString(16)
  })
}

export const normalizeText = (value) => value.trim().toLowerCase()

export const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

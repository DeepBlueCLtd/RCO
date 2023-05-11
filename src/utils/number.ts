export const isNumber = (number: any): boolean => {
  if (number === null || number === undefined) return false
  if (typeof number === 'string') {
    if (number === '') {
      return false
    }

    return !Number.isNaN(Number(number))
  }

  return !Number.isNaN(number)
}

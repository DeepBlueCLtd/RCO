export const isNumber = (number: any): boolean => {
  if (typeof number === 'string') {
    if (number === '') {
      return false
    }

    return !Number.isNaN(Number(number))
  }

  return !Number.isNaN(number)
}

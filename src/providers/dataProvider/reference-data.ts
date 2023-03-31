export const getReferenceData = (
  nameVal: string,
  length = 5
): Array<{ id: number; name: string }> => {
  return Array(length)
    .fill('')
    .map((_, index) => ({
      id: index + 1,
      name: nameVal + ':' + String(index + 1)
    }))
}

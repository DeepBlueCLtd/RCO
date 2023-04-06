export const getReferenceData = (
  nameVal: string,
  length = 5
): ReferenceItem[] => {
  return Array(length)
    .fill('')
    .map(
      (_, index): ReferenceItem => ({
        id: index + 1,
        name: nameVal + ':' + String(index + 1)
      })
    )
}

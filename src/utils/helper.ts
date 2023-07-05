export const transformProtectionValues = (
  data: Record<string, any>
): Record<string, any> => {
  const {
    catCave = '',
    pMarking = '',
    catCode = '',
    catHandling = '',
    ...rest
  } = data
  const item = {
    ...rest,
    protectionString: `${catCode} ${pMarking} ${catHandling} ${catCave}`
  }
  return item
}

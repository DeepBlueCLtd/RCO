export const transformProtectionValues = (
  data: Record<string, any>
): Record<string, any> => {
  const {
    catCave = '',
    pMarking = '',
    catCode = '',
    catHandle = '',
    ...rest
  } = data
  const item = {
    ...rest,
    protectionString: `${catCode} ${pMarking} ${catHandle} ${catCave}`
  }
  return item
}

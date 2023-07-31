export const transformProtectionValues = (
  data: Record<string, any>
): Record<string, any> => {
  const { catCave = '', catCode = '', catHandle = '', ...rest } = data
  const item = {
    ...rest,
    protectionString: `${catCode} ${catHandle} ${catCave}`
  }
  return item
}

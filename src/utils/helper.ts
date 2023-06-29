export const transformProtectionValues = (
  data: Record<string, any>
): Record<string, any> => {
  const { catCave = '', catCode = '', catHandling = '', ...rest } = data
  const item = {
    ...rest,
    protectionString: `${catCave}-${catCode}-${catHandling}`
  }
  return item
}

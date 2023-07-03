export const transformProtectionValues = (
  data: Record<string, any>
): Record<string, any> => {
  const {
    catCave = '',
    catCode = '',
    catHandling = '',
    protectiveMarking = '',
    ...rest
  } = data
  const item = {
    ...rest,
    protectionString: `${catCode}-${protectiveMarking}-${catHandling}-${catCave}`
  }
  return item
}

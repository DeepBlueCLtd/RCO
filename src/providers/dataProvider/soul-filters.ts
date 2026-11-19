/**
 * Builds soul-cli's `_filters` query value from a react-admin filter object
 * whose keys already carry soul operators (e.g. `createdAt__gte`).
 *
 * soul splits the value on commas (except inside `[...]`), then each part on
 * its first colon: `name:Big Box,id__lte:50,id:[1,2,3],loanedTo__null:`.
 * Values are written as-is, so spaces are kept. (The previous builder
 * stripped every space, quote and brace from the JSON, so a value such as
 * "Big Box" was sent as "BigBox" and never matched.)
 */
export const toSoulFilters = (filter: Record<string, unknown>): string =>
  Object.entries(filter)
    // as JSON.stringify did: undefined means "no filter"
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}:${formatValue(value)}`)
    .join(',')

const formatValue = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(String).join(',')}]`
  if (value === null) return ''
  return String(value)
}

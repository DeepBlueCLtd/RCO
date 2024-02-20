import * as constants from '../../constants'

export const getResourceName = (
  name: string,
  configData: ConfigData | undefined
): string => {
  const resourceNames = {
    [constants.R_DEPARTMENT]: 'Department',
    [constants.R_CAT_CODE]: configData?.catCode,
    [constants.R_CAT_CAVE]: configData?.catCave,
    [constants.R_CAT_HANDLE]: configData?.catHandle,
    [constants.R_ORGANISATION]: 'Organisation',
    [constants.R_PROTECTIVE_MARKING]: 'Protective Marking',
    [constants.R_MEDIA_TYPE]: 'Media type',
    [constants.R_VAULT]: 'Vault',
    [constants.R_PLATFORMS]: 'Platform',
    [constants.R_VAULT_LOCATION]: 'Vault Location'
  }

  return name !== undefined && name in resourceNames
    ? resourceNames[name as keyof typeof resourceNames] ?? 'resource'
    : name
}

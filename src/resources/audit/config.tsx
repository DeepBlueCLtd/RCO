import * as constants from '../../constants'

export const availableResources = [
  constants.R_USERS,
  constants.R_ITEMS,
  constants.R_BATCHES,
  constants.R_DESTRUCTION,
  constants.R_VAULT_LOCATION,
  constants.R_DISPATCH,
  constants.R_PROJECTS,
  constants.R_MEDIA_TYPE,
  constants.R_PLATFORMS
]
export const cosmeticLabels = {
  [constants.R_USERS]: 'User',
  [constants.R_ITEMS]: 'Item',
  [constants.R_BATCHES]: 'Batch',
  [constants.R_DESTRUCTION]: 'Destruction',
  [constants.R_VAULT_LOCATION]: 'Vault Location',
  [constants.R_DISPATCH]: 'Dispatch',
  [constants.R_PROJECTS]: 'Project',
  [constants.R_MEDIA_TYPE]: 'Media Type',
  [constants.R_PLATFORMS]: 'Platform'
}

import {
  Save,
  Layers,
  AccountTree,
  CreditScore,
  Notes
} from '@mui/icons-material'

export const LOCAL_STORAGE_DB_KEY = 'rco-'
export const DATE_FORMAT = 'yyyy-MM-dd'
export const DATETIME_FORMAT = 'dd/MMM/yyyy HH:mm'
export const TOKEN_KEY = 'rco-user'
export const SALT = 'salt'
// major table/resource names
export const R_USERS = 'users'
export const R_BATCHES = 'batches'
export const R_PROJECTS = 'projects'
export const R_PLATFORMS = 'platforms'
export const R_ITEMS = 'items'
export const R_AUDIT = 'audit'
export const R_VAULT_LOCATION = 'vaultLocation'
export const R_ORGANISATION = 'organisation'
export const R_LOANS = 'loans'

export type ResourceTypes =
  | typeof R_ITEMS
  | typeof R_AUDIT
  | typeof R_BATCHES
  | typeof R_USERS
  | typeof R_PROJECTS
  | typeof R_PLATFORMS

// preferences
export const LOGGING_ENABLED = 'LOGGING_ENABLED'

// icons
export const ICON_BATCH = Layers
export const ICON_ITEM = Save
export const ICON_PROJECT = AccountTree
export const ICON_LOAN = CreditScore

export const ICON_DETAILS = Notes

export const APP_VERSION = 'APP_VERSION'
export const DATA_VERSION = 'DATA_VERSION'

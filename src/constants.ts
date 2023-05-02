import {
  Save,
  Layers,
  AccountTree,
  CreditScore,
  Notes
} from '@mui/icons-material'

export const LOCAL_STORAGE_DB_KEY = 'rco-'
export const DATE_FORMAT = 'yyyy-MM-dd'
export const DATETIME_FORMAT = 'DD-MM-YYYY HH =mm =ss'
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
export const R_LOAN_ITEMS = 'loanItems'

// preferences
export const LOGGING_ENABLED = 'LOGGING_ENABLED'

// icons
export const ICON_BATCH = Layers
export const ICON_ITEM = Save
export const ICON_PROJECT = AccountTree
export const ICON_LOAN = CreditScore

export const ICON_DETAILS = Notes

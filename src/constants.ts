import {
  Save,
  Layers,
  AccountTree,
  CreditScore,
  Notes,
  DeleteSweepOutlined
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
export const R_PLATFORM_ORIGINATOR = 'platformOriginator'
export const R_PROTECTIVE_MARKING_AUTHORITY = 'protectiveMarkingAuthority'
export const R_PROTECTIVE_MARKING = 'protectiveMarking'
export const R_DEPARTMENT = 'department'
export const R_MEDIA_TYPE = 'mediaType'
export const R_DESTRUCTION = 'destruction'

export type ResourceTypes =
  | typeof R_ITEMS
  | typeof R_AUDIT
  | typeof R_BATCHES
  | typeof R_USERS
  | typeof R_PROJECTS
  | typeof R_PLATFORMS
  | typeof R_VAULT_LOCATION
  | typeof R_ORGANISATION
  | typeof R_LOANS
  | typeof R_MEDIA_TYPE
  | typeof R_DEPARTMENT
  | typeof R_PROTECTIVE_MARKING
  | typeof R_PROTECTIVE_MARKING_AUTHORITY
  | typeof R_PLATFORM_ORIGINATOR

// preferences
export const LOGGING_ENABLED = 'LOGGING_ENABLED'

// icons
export const ICON_BATCH = Layers
export const ICON_ITEM = Save
export const ICON_PROJECT = AccountTree
export const ICON_LOAN = CreditScore
export const ICON_DESTRUCTION = DeleteSweepOutlined

export const ICON_DETAILS = Notes

export const APP_VERSION = 'APP_VERSION'
export const DATA_VERSION = 'DATA_VERSION'

// mitt events
export const SAVE_EVENT = 'save'

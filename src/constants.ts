import {
  Save,
  Layers,
  AccountTree,
  CreditScore,
  Notes,
  Business,
  LocalShipping,
  DeleteSweepOutlined,
  SaveAs
} from '@mui/icons-material'

export const LOCAL_STORAGE_DB_KEY = 'rco-'
export const DATE_FORMAT = 'yyyy-MM-dd'
export const DATETIME_FORMAT = 'dd/MMM/yyyy HH:mm'
export const TOKEN_KEY = 'rco-user'
export const ACCESS_TOKEN_KEY = 'accessToken'
export const REFRESH_TOKEN_KEY = 'refreshToken'
export const MUTATION_MODE = 'optimistic'
// session storage value.
export const SESSION_LOGIN = 'login'

// major table/resource names
export const R_USERS = '_users'
export const R_BATCHES = 'batch'
export const R_PROJECTS = 'project'
export const R_PLATFORMS = 'platform'
export const R_ITEMS = 'item'
export const R_ALL_ITEMS = 'allItems'
export const R_AUDIT = 'audit'
export const R_VAULT_LOCATION = 'vaultLocation'
export const R_ORGANISATION = 'organisation'
export const R_LOANS = 'loan'
export const R_PROTECTIVE_MARKING = 'protectiveMarking'
export const R_CAT_CODE = 'catCode'
export const R_CAT_HANDLE = 'catHandle'
export const R_CAT_CAVE = 'catCave'
export const R_DEPARTMENT = 'department'
export const R_MEDIA_TYPE = 'mediaType'
export const R_ADDRESSES = 'address'
export const R_DISPATCH = 'dispatch'
export const R_DESTRUCTION = 'destruction'
export const R_CONFIG = 'configData'
export const R_ITEMS_CAVE = 'itemCave'
export const R_ITEMS_CODE = 'itemCode'
export const R_ITEMS_HANDLE = 'itemHandle'
export const R_BATCH_CAVE = 'batchCave'
export const R_BATCH_CODE = 'batchCode'
export const R_BATCH_HANDLE = 'batchHandle'
export const R_VAULT = 'vault'
export const R_RICH_ITEMS = 'richItem'
export const R_LOAN_USERS = 'loanUsers'

export const ID_FIX: Record<string, string> = {
  [R_CAT_CAVE]: 'catCave',
  [R_CAT_CODE]: 'catCode',
  [R_CAT_HANDLE]: 'catHandle',
  [R_DEPARTMENT]: 'department',
  [R_ORGANISATION]: 'organisation'
}

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
  | typeof R_CAT_CODE
  | typeof R_CAT_HANDLE
  | typeof R_CAT_CAVE
  | typeof R_DISPATCH
  | typeof R_ALL_ITEMS
  | typeof R_DESTRUCTION
  | typeof R_DISPATCH
  | typeof R_ADDRESSES
  | typeof R_CONFIG
  | typeof R_VAULT
  | typeof R_RICH_ITEMS
  | typeof R_LOAN_USERS

// preferences
export const LOGGING_ENABLED = 'LOGGING_ENABLED'
export const AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED'

// icons
export const ICON_BATCH = Layers
export const ICON_ITEM = SaveAs
export const ICON_ALL_ITEM = Save
export const ICON_PROJECT = AccountTree
export const ICON_LOAN = CreditScore
export const ICON_ADDRESSES = Business
export const ICON_DISPATCH = LocalShipping
export const ICON_DESTRUCTION = DeleteSweepOutlined

export const ICON_DETAILS = Notes

export const APP_VERSION = 'APP_VERSION'
export const DATA_VERSION = 'DATA_VERSION'

// mitt events
export const SAVE_EVENT = 'save'
export const ITEM_CLONE = 'item_clone'
export const ITEM_SAVE = 'item_save'

export const CHANGE_PASSWORD_EVENT = 'change_password'

export const cosmeticLabels = {
  [R_USERS]: 'User',
  [R_ITEMS]: 'Item',
  [R_BATCHES]: 'Batch',
  [R_DESTRUCTION]: 'Destruction',
  [R_VAULT_LOCATION]: 'Vault Location',
  [R_DISPATCH]: 'Dispatch',
  [R_PROJECTS]: 'Project',
  [R_MEDIA_TYPE]: 'Media Type',
  [R_PLATFORMS]: 'Platform',
  [R_ORGANISATION]: 'Organization',
  [R_CAT_CAVE]: 'Cat Cave',
  [R_CAT_CODE]: 'Cat Code',
  [R_CAT_HANDLE]: 'Cat Handle',
  [R_DEPARTMENT]: 'Department',
  [R_PROTECTIVE_MARKING]: 'Protective Marking'
}

export const PASSWORD_INSTRUCTION_TITLE =
  'The password should include these items:'
export const PASSWORD_VALIDATION_CRITERIA = [
  'At least 10 characters in length',
  'Upper and lower case letters',
  'At least one digit',
  'At least one special character'
]
export const PASSWORD_SPECIAL_CHARACTER =
  'Special character required - !@#$%^&*(),.?":{}|<>'

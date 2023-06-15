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
export const SALT = 'salt'
// major table/resource names
export const R_USERS = 'user'
export const R_BATCHES = 'batch'
export const R_PROJECTS = 'project'
export const R_PLATFORMS = 'platform'
export const R_ITEMS = 'item'
export const R_ALL_ITEMS = 'allItems'
export const R_AUDIT = 'audit'
export const R_VAULT_LOCATION = 'vaultLocation'
export const R_ORGANISATION = 'organisation'
export const R_LOANS = 'loan'
export const R_PLATFORM_ORIGINATOR = 'platformOriginator'
export const R_PROTECTIVE_MARKING = 'protectiveMarking'
export const R_CAT_CODE = 'catCode'
export const R_CAT_HANDLING = 'catHandling'
export const R_CAT_CAVE = 'catCave'
export const R_DEPARTMENT = 'department'
export const R_MEDIA_TYPE = 'mediaType'
export const R_ADDRESSES = 'address'
export const R_DISPATCH = 'dispatch'
export const R_DESTRUCTION = 'destruction'
export const R_CONFIG = 'configData'

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
  | typeof R_CAT_HANDLING
  | typeof R_CAT_CAVE
  | typeof R_PLATFORM_ORIGINATOR
  | typeof R_DISPATCH
  | typeof R_ALL_ITEMS

// preferences
export const LOGGING_ENABLED = 'LOGGING_ENABLED'

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

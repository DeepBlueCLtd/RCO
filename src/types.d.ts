interface CustomDataProvider {
  loanItems: (
    items: Array<Item['id']>,
    loanedTo: _Users['id'],
    date?: string
  ) => Promise<any>
  returnItems: (items: Array<Item['id']>, by?: _Users['id']) => Promise<any>
  getConfigData: (provider: DataProvider) => Promise<ConfigData | null>
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

type UserRole = 'rco-user' | 'rco-power-user'

interface Permission {
  read?: boolean
  write?: boolean
  delete?: boolean
}

/** the set of routes for a resource */
interface ResourceRoutes {
  create?: any
  edit?: any
  list?: any
  show?: any
}

type ResourcePermissions = Record<string, Permission>

/** properties common to a number of forms */
interface FormProps {
  /** if the form is currently in edit mode (rather than create mode),
   * since we may display a `Delete` button when in edit mode
   */
  isEdit?: boolean
  name?: string
}

// ------------------------
// -- SQL Data Types
// ------------------------

/** an entity, with an id unique to that table */
interface RCOResource {
  readonly id: number
}

type MediaType = RCOResource & {
  name: string
  active: boolean
  itemSize: number
}

/** a generic type, used for our assorted reference data lists. Once the
 * interface becomes more complex, introduce a type-specific interface
 */
interface ActiveItem {
  // human-readable name for this entity
  name: string
  // when false, the item should not be included in drop-downs
  // for `create` forms, though it should for `edit` forms
  active: boolean
}

type IntegerReferenceItem = ActiveItem & {
  id: number
}

type StringReferenceItem = ActiveItem & {
  id: string
}

/** an entity for which we track instance creation */
type ResourceWithCreation = RCOResource & {
  // ISO date value
  createdAt: string
  createdBy: _Users['id'] | null // allow null, since some legacy data doesn't have created by
}

type _Users = ResourceWithCreation & {
  name: string
  hashed_password?: string
  is_superuser: boolean
  username: string
  departedDate: string | null
  lastUpdatedAt: string | null
  lockoutAttempts: number
  updateBefore: string
}

type Audit = RCOResource & {
  // the user making the change
  user: _Users['id']
  // when this happened
  dateTime: string
  // the type of data being reported on (opt)
  resource: string | null
  // the id of the entity being reported on (opt)
  dataId: number | null
  // what kind of change was made (computer-friendly)
  activityType: AuditType // string
  // what kind of change was made (human-friendly)
  label: string
  // summary of change
  activityDetail: string | null
  // should this audit entry be included in security review?
  securityRelated: boolean | null
  // the "other" resource that this event relates to
  subjectId: string | number | null
  // the resource type of the subject
  subjectResource: string | null
  // the ip address of the client
  ip?: string
}

type Platform = RCOResource & {
  name: string
  active: boolean
}

type Project = ResourceWithCreation & {
  readonly id: number
  name: string
  remarks: string
  startDate: string
  endDate: string
  enduring: boolean | null
  active: boolean
}

type Department = StringReferenceItem
type Organisation = StringReferenceItem
type ProtectiveMarking = IntegerReferenceItem
type CatCode = StringReferenceItem
type CatHandle = StringReferenceItem
type CatCave = StringReferenceItem
type VaultLocation = IntegerReferenceItem & {
  shelfSize: number | null
}

type Vault = StringReferenceItem

interface ItemCode {
  id: number
  item: number
  catCode: CatCode['id']
}
interface ItemCave {
  id: number
  item: number
  catCave: CatCave['id']
}
interface ItemHandling {
  id: number
  item: number
  catHandle: CatHandle['id']
}

type Batch = ResourceWithCreation & {
  batchNumber: string
  yearOfReceipt: number
  department: Department['id'] | null
  project: Project['id'] | null
  platform: Platform['id'] | null
  organisation: Organisation['id'] | null
  remarks: string
  receiptNotes: string
  vault: Vault['id']
}

type Item = ResourceWithCreation & {
  mediaType: MediaType['id']
  legacyMediaType: MediaType['id'] | null
  startDate: string | null
  batch: Batch['id']
  itemNumber: string
  // originator reference number (consec) or number of sheets (optional)
  consecSheets: string | null
  endDate: string | null
  vaultLocation: VaultLocation['id'] | null
  remarks: string
  protectiveMarking: ProtectiveMarking['id']
  // temporarily removing for working with soul
  // project?: Project['id']
  // platform?: Platform['id']

  // notes relating to how this item is mustered
  musterRemarks: string
  // loan details
  loanedTo: _Users['id'] | null
  loanedDate: string | null
  // dispatch details
  dispatchJob: Dispatch['id'] | null
  dispatchedDate: string | null
  // destruction details
  destruction: Destruction['id'] | null
  destructionDate: string | null
  protectionString: string | null
}

type RichItem = Item & {
  project: Project['id']
  platform: Platform['id']
  vault: Vault['id']
  department: Department['id']
}

interface RCOStore {
  // lookup tables
  platform: Platform[]
  project: Project[]
  address: Address[]
  organisation: Organisation[]
  department: Department[]
  vaultLocation: VaultLocation[]
  mediaType: MediaType[]
  protectiveMarking: ProtectiveMarking[]
  catCode: CatCode[]
  catHandle: CatHandle[]
  catCave: CatCave[]
  // configuration data
  configData: ConfigData[]
  // business tables
  _users: _Users[]
  audit: Audit[]
  batch: Batch[]
  item: Item[]
  destruction: Destruction[]
  dispatch: Dispatch[]
  vault: Vault[]
  // bridging tables
  itemCode: ItemCode[]
  itemCave: ItemCave[]
  itemHandle: ItemHandling[]
  batchCode: BatchCode[]
  batchCave: BatchCave[]
  batchHandle: BatchHandling[]
  richItem: RichItem[]
}

interface Destruction {
  readonly id: number
  name: string | null
  vault: Vault['id']
  createdAt: string
  createdBy: _Users['id']
  finalisedAt: string | null
  finalisedBy: _Users['id'] | null
  remarks: string
  reportPrintedAt: string | null
}

interface ActivityType {
  name: string
  label: string
}

interface Address {
  readonly id: number
  createdAt: string
  fullAddress: string
  active: boolean
  remarks: string
}

interface Dispatch {
  id: number
  name: string
  vault: Vault['id']
  createdAt: string
  createdBy: _Users['id']
  remarks: string
  dispatchedAt: string | null
  toName: string
  toAddress: Address['id']
  receiptReceived: string | null
  lastHastenerSent: string | null
  reportPrintedAt: string | null
}

/** type of data returned from the `loanUser` view */
interface LoanUser {
  id: _Users['id']
  numItems: number // count of items this user has on loan
  username: _Users['username']
}

/** per instance config data. It is just intended to be one row deep */
type ConfigData = RCOResource & {
  /** singular name for project resource
   * test value: `Project`
   */
  projectName: string
  /** plural name for project resource
   * test value: `Projects`
   */
  projectsName: string
  /** fixed address
   * test value: `Some Dept, Some Org, Some Street, Some Town, Some Zip`
   */
  fromAddress: string
  /** label for group of controls that record item releasability
   * test value: `Protection`
   */
  protectionName: string
  /** label for cat-code element
   * test value: `Cat-Code`
   */
  catCode: string
  /** label for cat-handle element
   * test value: `Cat-Handle`
   */
  catHandle: string
  /** label for cat-cave element
   * test value: `Cat-Cave`
   */
  catCave: string
  /** prefix for reference numbers
   * on printed forms
   */
  reportPrefix: string
  /** text to go on header/footer of
   * muster sheets
   */
  headerMarking: string
}

type _UserWithRole = _Users & { userRole: string }

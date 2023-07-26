interface CustomDataProvider {
  loanItems: (
    items: Array<Item['id']>,
    loanedTo: User['id'],
    date?: string
  ) => Promise<any>
  returnItems: (items: Array<Item['id']>, by?: User['id']) => Promise<any>
  getConfigData: (provider: DataProvider) => Promise<ConfigData | null>
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

type UserRole = 'rco-user' | 'rco-power-user'

interface Permission {
  read?: boolean
  write?: boolean
  delete?: boolean
  all?: '*'
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

interface MediaType extends RCOResource {
  name: string
  active: boolean
  mediaCategory: MediaCategory
}

type MediaCategory = 'Paper' | 'Magnetic'

/** an entity, with an id unique to that table */
interface RCOResource {
  readonly id: number
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

interface IntegerReferenceItem extends ActiveItem {
  id: number
}

interface StringReferenceItem extends ActiveItem {
  id: string
}

/** an entity for which we track instance creation */
interface ResourceWithCreation extends RCOResource {
  // ISO date value
  createdAt: string
  createdBy: User['id']
}

interface User extends ResourceWithCreation {
  name: string
  password: string
  adminRights: boolean
  /** whether items can still be loaned to this user */
  active: boolean
  role: UserRole
  staffNumber: string
  departedDate?: string
}

interface Audit extends RCOResource {
  // the user making the change
  user: User['id']
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
  activityDetail?: string
  /** should this audit entry be included in security review? */
  securityRelated?: boolean
  // who this event relates to
  subject?: User['id']
}

interface Platform extends RCOResource {
  name: string
  active: boolean
}

interface Project extends ResourceWithCreation {
  readonly id: number
  name: string
  remarks: string
  startDate: string
  endDate: string
}

type Department = StringReferenceItem
type Organisation = StringReferenceItem
type ProtectiveMarking = IntegerReferenceItem
type CatCode = StringReferenceItem
type CatHandle = StringReferenceItem
type CatCave = StringReferenceItem
type VaultLocation = IntegerReferenceItem

type Vault = StringReferenceItem

interface ItemCode {
  id: number
  item: number
  catCode: number
}
interface ItemCave {
  id: number
  item: number
  catCave: number
}
interface ItemHandling {
  id: number
  item: number
  catHandle: number
}

interface BatchCode {
  id: number
  batch: number
  catCode: number
}
interface BatchCave {
  id: number
  batch: number
  catCave: number
}
interface BatchHandling {
  id: number
  batch: number
  catHandle: number
}

interface Batch extends ResourceWithCreation {
  startDate: string
  endDate: string
  batchNumber: string
  yearOfReceipt: string
  department: Department['id']
  project?: Project['id']
  platform?: Platform['id']
  organisation: Organisation['id']
  protectiveMarking: ProtectiveMarking['id']
  remarks: string
  receiptNotes: string
  protectionString?: string
  vault: Vault['id']
}

interface Item extends ResourceWithCreation {
  mediaType: MediaType['id']
  startDate: string
  batchId: Batch['id']
  itemNumber: string
  consecPages?: string
  endDate: string
  vaultLocation: VaultLocation['id']
  remarks: string
  protectiveMarking: ProtectiveMarking['id']
  // temporarily removing for working with soul
  // project?: Project['id']
  // platform?: Platform['id']

  // notes relating to how this item is mustered
  musterRemarks: string
  // loan details
  loanedTo?: User['id']
  loanedDate?: string
  // dispatch details
  dispatchJob?: Dispatch['id']
  dispatchedDate?: string
  // destruction details
  destruction?: Destruction['id']
  destructionDate?: string
  protectionString?: string
}

interface RCOStore {
  // lookup tables
  platform: Platform[]
  project: Project[]
  address: Address[]
  organisation: Organisation[]
  department: Department[]
  vaultLocation: VaultLocation[]
  mediaType: IntegerReferenceItem[]
  protectiveMarking: ProtectiveMarking[]
  catCode: CatCode[]
  catHandle: CatHandle[]
  catCave: CatCave[]
  // configuration data
  configData: ConfigData[]
  // business tables
  user: User[]
  audit: Audit[]
  batch: Batch[]
  item: Item[]
  destruction: Destruction[]
  dispatche: Dispatch[]
  vault: Vault[]
}

interface Destruction {
  readonly id: number
  reference: string
  createdAt: string
  createdBy: User['id']
  finalisedAt?: string
  finalisedBy?: User['id']
  remarks: string
  reportPrintedAt?: string
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
  Remarks: string
}

interface Dispatch {
  id: number
  reference: string
  createdAt: string
  createdBy: User['id']
  remarks: string
  dispatchedAt?: string
  toName: string
  toAddress: Address['id']
  receiptReceived?: string
  lastHastenerSent?: string
  reportPrintedAt?: string
}

/** per instance config data. It is just intended to be one row deep */
interface ConfigData extends RCOResource {
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
}

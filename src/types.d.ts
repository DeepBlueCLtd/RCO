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

/** an entity, with an id unique to that table */
interface RCOResource {
  readonly id: number
}

/** an entity for which we track instance creation */
interface ResourceWithCreation extends RCOResource {
  // ISO date value
  createdAt: string
  createdBy: User['id']
}

interface CatTypes {
  catCode?: ReferenceItem['id']
  catHandling?: ReferenceItem['id']
  catCave?: Array<ReferenceItem['id']>
}

interface User extends ResourceWithCreation {
  name: string
  password: string
  adminRights: boolean
  /** whether items can still be loaned to this user */
  active: boolean
  roles: UserRole[]
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
  activityType: AuditType
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
}

interface Batch extends ResourceWithCreation, CatTypes {
  name: string
  startDate: string
  endDate: string
  batchNumber: string
  yearOfReceipt: string
  department: ReferenceItem['id']
  project: Project['id']
  platform: Platform['id']
  organisation: ReferenceItem['id']
  protectiveMarking: ReferenceItem['id']
  // extra protection details. All are optional
  catCode: ReferenceItem['id'] | undefined
  catHandle: ReferenceItem['id'] | undefined
  catCave: Array<ReferenceItem['id']> | undefined
  remarks: string
  receiptNotes: string
}

/** a generic type, used for our assorted reference data lists. Once the
 * interface becomes more complex, introduce a type-specific interface
 */
interface ReferenceItem extends RCOResource {
  name: string
}

interface ActiveReferenceItem extends ReferenceItem {
  // when false, the item should not be included in drop-downs
  // for `create` forms, though it should for `edit` forms
  active: boolean
}

interface Item extends ResourceWithCreation, CatTypes {
  mediaType: MediaType
  start: string
  batchId: Batch['id']
  item_number: string
  consecPages?: string
  end: string
  vaultLocation: ReferenceItem['id']
  remarks: string
  protectiveMarking: ReferenceItem['id']
  // extra protection details
  catCode: ReferenceItem['id'] | undefined
  catHandle: ReferenceItem['id'] | undefined
  catCave: Array<ReferenceItem['id']> | undefined

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
}

type MediaType = 'DVD' | 'Tape' | 'Paper'

/** properties common to a number of forms */
interface FormProps {
  /** if the form is currently in edit mode (rather than create mode),
   * since we may display a `Delete` button when in edit mode
   */
  isEdit?: boolean
  name?: string
}

interface RCOStore {
  users: User[]
  audits: Audit[]
  platforms: Platform[]
  projects: Project[]
  batches: Batch[]
  items: Item[]
  destructions: Destruction[]
  dispatches: Dispatch[]
  addresses: Address[]
  organisation: ActiveReferenceItem[]
  department: ActiveReferenceItem[]
  vaultLocation: ActiveReferenceItem[]
  mediaType: ActiveReferenceItem[]
  protectiveMarking: ActiveReferenceItem[]
  protectiveMarkingAuthority: ActiveReferenceItem[]
  platformOriginator: ActiveReferenceItem[]
  catCode: ActiveReferenceItem[]
  catHandling: ActiveReferenceItem[]
  catCave: ActiveReferenceItem[]
  configData: ConfigData[]
}

interface Destruction {
  readonly id: number
  reference: string
  createdAt: string
  createdBy: User['id']
  finalisedAt?: string
  finalisedBy?: User['id']
  remarks: string
}

interface ActivityType {
  name: string
  label: string
}

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
}

/** per instance config data. It just intended to be one row deep */
interface ConfigData {
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
  cat_code: string
  /** label for cat-handle element
   * test value: `Cat-Handle`
   */
  cat_handle: string
  /** label for cat-cave element
   * test value: `Cat-Cave`
   */
  cat_cave: string
}

interface CustomDataProvider {
  loanItems: (items: Array<Item['id']>, loanedTo: User['id']) => Promise<any>
  returnItems: (items: Array<Item['id']>, by?: User['id']) => Promise<any>
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface User {
  readonly id: number
  name: string
  password: string
  adminRights: boolean
  /** whether items can still be loaned to this user */
  active: boolean
}

interface Audit {
  readonly id: number
  // the user making the change
  user: User['id']
  // the type of data being reported on (opt)
  resource: string | null
  // the id of the entity being reported on (opt)
  data_id: number | null
  activityType: AuditType
  dateTime: string
  label: string
  activityDetail?: string
  securityRelated?: boolean
  index?: number
}

interface Platform {
  readonly id: number
  name: string
  active: boolean
}

interface Project {
  readonly id: number
  name: string
  remarks: string
  createdAt: string
  createdBy: User['id']
}

interface Batch {
  readonly id: number
  name: string
  startDate: string
  endDate: string
  projectCode: string
  batchNumber: string
  yearOfReceipt: string
  department: ReferenceItem['id']
  project: Project['id']
  platform: Platform['id']
  organisation: ReferenceItem['id']
  maximumProtectiveMarking: ReferenceItem['id']
  remarks: string
  receiptNotes: string
  createdAt: string
  createdBy: User['id']
}

/** a generic type, used for our assorted reference data lists. Once the
 * interface becomes more complex, introduce a type-specific interface
 */
interface ReferenceItem {
  readonly id: number
  name: string
}

interface ActiveReferenceItem extends ReferenceItem {
  // when false, the item should not be included in drop-downs
  // for `create` forms, though it should for `edit` forms
  active: boolean
}

interface CoreMedia {
  readonly mediaType: MediaType
}
interface DVD extends CoreMedia {
  size: number
}

interface Tape extends CoreMedia {
  minutes: number
  brand: string
}

interface Item {
  readonly id: number
  mediaType: MediaType
  start: string
  batchId: Batch['id']
  item_number: string
  end: string
  vaultLocation: ReferenceItem['id']
  remarks: string
  protectiveMarking: ReferenceItem['id']
  magTape: Tape
  dvd: DVD
  paper: Paper
  // notes relating to how this item is mustered
  musterRemarks: string
  // the date this item was added
  createdAt: string
  // who added this item
  createdBy: User['id']
  // who this item is currently loaned to
  loanedTo?: User['id']
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
  batches: Batch[]
  items: Item[]
  platforms: Platform[]
  projects: Project[]
  organisation: ActiveReferenceItem[]
  department: ActiveReferenceItem[]
  vaultLocation: ActiveReferenceItem[]
  mediaType: ActiveReferenceItem[]
  protectiveMarking: ActiveReferenceItem[]
  protectiveMarkingAuthority: ActiveReferenceItem[]
  platformOriginator: ActiveReferenceItem[]
}

interface ActivityType {
  name: string
  label: string
}

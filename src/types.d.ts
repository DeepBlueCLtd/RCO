type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface User {
  readonly id: number
  name: string
  password: string
  adminRights: boolean
}

interface Audit {
  readonly id: number
  activityType: string
  dateTime: string
  activityDetail?: string
  securityRelated?: boolean
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
  department: ActiveReferenceItem['id']
  project: Project['id']
  platform: Platform['id']
  organisation: ActiveReferenceItem['id']
  // deprecated
  // protectiveMarkingAuthority: ReferenceItem['id']
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
  createdAt: string
  createdBy: User['id']
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
  vaultLocation: ReferenceItem[]
  mediaType: ReferenceItem[]
  protectiveMarking: ReferenceItem[]
  protectiveMarkingAuthority: ActiveReferenceItem[]
  platformOriginator: ReferenceItem[]
}

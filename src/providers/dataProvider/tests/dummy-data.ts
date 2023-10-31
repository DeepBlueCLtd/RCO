import { DateTime } from 'luxon'
import { type ResourceTypes } from '../../../constants'
import { type DataProvider } from 'react-admin'

const year: number = 2025

interface NewBatch extends Omit<Batch, 'id' | 'createdAt' | 'createdBy'> {
  readonly id?: number
}

interface NewItem
  extends Omit<Item, 'id' | 'createdAt' | 'createdBy' | 'itemNumber'> {
  readonly id?: number
}

interface Props {
  name?: string
  id?: number
}
export const generateDummyBatchForTesting = ({ id }: Props = {}): NewBatch => {
  return {
    ...(id !== undefined ? { id } : null),
    batchNumber: `1/${year}`,
    yearOfReceipt: year,
    department: '1-department',
    project: 1,
    platform: 1,
    organisation: '1-organisation',
    remarks: 'remarks-1',
    receiptNotes: 'receipt-notes-1',
    vault: 'VAULT'
  }
}

interface ItemProps {
  id?: number
  remarks?: string
  mediaType?: MediaType['id']
  toISO?: boolean
  batch?: Batch['id']
}

export const generateItemForTesting = ({
  id,
  remarks,
  mediaType,
  toISO,
  batch
}: ItemProps = {}): NewItem => {
  return {
    ...(id !== undefined ? { id } : null),
    mediaType: mediaType ?? 1,
    legacyMediaType: null,
    startDate:
      toISO === true
        ? new Date(DateTime.now().toFormat('yyyy-MM-dd')).toISOString()
        : DateTime.now().toFormat('yyyy-MM-dd'),
    endDate:
      toISO === true
        ? new Date(
            DateTime.now().plus({ day: 1 }).toFormat('yyyy-MM-dd')
          ).toISOString()
        : DateTime.now().plus({ day: 1 }).toFormat('yyyy-MM-dd'),

    batch: batch ?? 1,
    vaultLocation: 1,
    remarks: remarks ?? 'Dummy-Remarks-1',
    protectiveMarking: 1,
    consecSheets: 'consec-sheets-1',
    musterRemarks: 'muster-remarks-1',
    loanedDate: null,
    loanedTo: null,
    destruction: null,
    destructionDate: null,
    dispatchedDate: null,
    dispatchJob: null,
    protectionString: null
  }
}

interface ProjectProps {
  name?: string
  id?: number
}

export const generateProjectForTesting = ({
  name,
  id
}: ProjectProps = {}): Omit<Project, 'id' | 'createdAt'> => {
  return {
    ...(id !== undefined ? { id } : null),
    name: name ?? 'Dummy-Project',
    remarks: 'dummy-remarks-1',
    startDate: DateTime.now().toFormat('yyyy-MM-dd'),
    endDate: DateTime.now().plus({ day: 1 }).toFormat('yyyy-MM-dd'),
    createdBy: 1,
    enduring: false,
    active: true
  }
}

interface PlatformProps {
  name?: string
  id?: number
}

export const generatePlatformForTesting = ({
  id,
  name
}: PlatformProps = {}): Omit<Platform, 'id'> => {
  return {
    ...(id !== undefined ? { id } : null),
    name: name ?? 'Dummy-Platform',
    active: true
  }
}

interface UserProps {
  id?: number
  departedDate?: string
  name?: string
  password?: string
}

export const generateUserForTesting = ({
  id,
  name,
  departedDate,
  password = undefined
}: UserProps = {}): Omit<
  User,
  'id' | 'createdAt' | 'createdBy' | 'departedDate'
> => ({
  ...(id !== undefined ? { id } : null),
  name: name ?? 'Dummy-User',
  password: password ?? undefined,
  ...(departedDate ? { departedDate } : { departedDate: null }),
  role: 'rco-user',
  staffNumber: 'd-1'
})

interface VaultLocationProps {
  id?: number
  active?: boolean
  name?: string
}

export const generateVaultLocationForTesting = ({
  id,
  active,
  name
}: VaultLocationProps = {}): Omit<IntegerReferenceItem, 'id'> => ({
  ...(id !== undefined ? { id } : null),
  active: active ?? true,
  name: name ?? 'Dummy-Vault-Location-1'
})

interface ActiveReferenceItemProps {
  id?: number
  active?: boolean
}

export const generateActiveReferenceItemForTesting = (
  name: string,
  { id, active }: ActiveReferenceItemProps = {}
): Omit<IntegerReferenceItem, 'id'> => ({
  ...(id !== undefined ? { id } : null),
  active: active ?? true,
  name
})

export const clear =
  (provider: DataProvider) => async (resource: ResourceTypes) => {
    const list = await provider.getList<RCOResource>(resource, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    if (list.total !== undefined && list.total > 0) {
      await provider.deleteMany(resource, {
        ids: list.data.map((item) => item.id)
      })
    }
  }

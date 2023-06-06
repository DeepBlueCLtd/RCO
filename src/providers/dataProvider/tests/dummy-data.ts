import { DateTime } from 'luxon'
import { type ResourceTypes } from '../../../constants'
import { type DataProvider } from 'react-admin'

const year: number = 2025

interface NewBatch extends Omit<Batch, 'id' | 'createdAt' | 'createdBy'> {
  readonly id?: number
}

interface NewItem
  extends Omit<Item, 'id' | 'createdAt' | 'createdBy' | 'item_number'> {
  readonly id?: number
}

interface Props {
  name?: string
  id?: number
}
export const generateDummyBatchForTesting = ({
  name,
  id
}: Props = {}): NewBatch => {
  return {
    ...(id !== undefined ? { id } : null),
    name: name ?? 'Dummy-Batch',
    startDate: DateTime.now().toFormat('yyyy-MM-dd'),
    endDate: DateTime.now().plus({ day: 1 }).toFormat('yyyy-MM-dd'),
    projectCode: '1',
    batchNumber: `V01/${year}`,
    yearOfReceipt: String(year),
    department: 1,
    project: 1,
    platform: 1,
    organisation: 1,
    maximumProtectiveMarking: 1,
    remarks: 'remarks-1',
    receiptNotes: 'receipt-notes-1'
  }
}

interface ItemProps {
  id?: number
  remarks?: string
  mediaType?: MediaType
  toISO?: boolean
  batchId?: number
}

export const generateItemForTesting = ({
  id,
  remarks,
  mediaType,
  toISO,
  batchId
}: ItemProps = {}): NewItem => {
  return {
    ...(id !== undefined ? { id } : null),
    mediaType: mediaType ?? 'DVD',
    start:
      toISO === true
        ? new Date(DateTime.now().toFormat('yyyy-MM-dd')).toISOString()
        : DateTime.now().toFormat('yyyy-MM-dd'),
    end:
      toISO === true
        ? new Date(
            DateTime.now().plus({ day: 1 }).toFormat('yyyy-MM-dd')
          ).toISOString()
        : DateTime.now().plus({ day: 1 }).toFormat('yyyy-MM-dd'),

    batchId: batchId ?? 1,
    vaultLocation: 1,
    remarks: remarks ?? 'Dummy-Remarks-1',
    protectiveMarking: 1,
    consecPages: 'consec-pages-1',
    musterRemarks: 'muster-remarks-1'
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
    createdBy: 1
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
  adminRights?: boolean
  active?: boolean
  name?: string
}

export const generateUserForTesting = ({
  id,
  name,
  adminRights,
  active
}: UserProps = {}): Omit<User, 'id' | 'createdAt' | 'createdBy'> => ({
  ...(id !== undefined ? { id } : null),
  name: name ?? 'Dummy-User',
  password: 'abcd',
  adminRights: adminRights ?? true,
  active: active ?? true,
  roles: ['rco-user'],
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
}: VaultLocationProps = {}): Omit<ActiveReferenceItem, 'id'> => ({
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
): Omit<ActiveReferenceItem, 'id'> => ({
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

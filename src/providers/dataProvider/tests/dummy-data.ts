import { DateTime } from 'luxon'

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
    magTape: {
      minutes: 1,
      brand: 'dummy-brand-1',
      mediaType: 'DVD'
    },
    dvd: {
      mediaType: 'DVD',
      size: 1
    },
    paper: 'paper',
    musterRemarks: 'muster-remarks-1'
  }
}

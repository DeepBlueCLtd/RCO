import { type DataProvider } from 'react-admin'
import { LOCAL_STORAGE_DB_KEY, R_BATCHES } from '../../constants'
import { DateTime } from 'luxon'
import localForageDataProvider from 'ra-data-local-forage'

const year: number = 2025

interface NewBatch extends Omit<Batch, 'id'> {
  readonly id?: number
}

interface Props {
  name?: string
  id?: number
}

const generateDummyBatchForTesting = ({ name, id }: Props = {}): NewBatch => {
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
    receiptNotes: 'receipt-notes-1',
    createdAt: DateTime.now().toFormat('yyyy-MM-dd'),
    createdBy: 1
  }
}

describe('CRUD operations on each resource', () => {
  let provider: DataProvider
  let batch: Batch

  beforeEach(async () => {
    provider = await localForageDataProvider({
      prefixLocalForageKey: LOCAL_STORAGE_DB_KEY
    })
    // note: next block to be refactored, so we
    // declare array of resource names, then loop through them,
    // clearing each resource
    const list = await provider.getList<Batch>(R_BATCHES, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    if (list.total !== undefined && list.total > 0) {
      await provider.deleteMany(R_BATCHES, {
        ids: list.data.map((item) => item.id)
      })
    }
  })

  describe('CRUD operation on Batch', () => {
    it('should create a batch', async () => {
      const list = await provider.getList<Batch>(R_BATCHES, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: {}
      })
      expect(list.total).toBe(0)
      const result = await provider.create<Batch>(R_BATCHES, {
        data: generateDummyBatchForTesting()
      })
      const createId = result.data.id
      expect(createId).toBeDefined()
      const createdBatch = await provider.getOne<Batch>(R_BATCHES, {
        id: createId
      })
      expect(createdBatch).toBeDefined()
      expect(createId).toEqual(createdBatch.data.id)
    })

    it('should update the batch', async () => {
      const createdBatch = await provider.create<Batch>(R_BATCHES, {
        data: generateDummyBatchForTesting()
      })
      const createId = createdBatch.data.id
      await provider.update<Batch>(R_BATCHES, {
        id: createId,
        previousData: batch,
        data: {
          name: 'dummy-batch',
          createdAt: DateTime.now().toFormat('yyyy-MM-dd')
        }
      })
      const shouldMatchBatch = generateDummyBatchForTesting({
        name: 'dummy-batch',
        id: createId
      })
      const updatedBatch = await provider.getOne<Batch>(R_BATCHES, {
        id: createId
      })
      const expectedResult = updatedBatch.data
      expect(expectedResult).toMatchObject(shouldMatchBatch)
    })

    it('should delete the batch', async () => {
      const created = await provider.create<Batch>(R_BATCHES, {
        data: generateDummyBatchForTesting()
      })
      const listBefore = await provider.getList<Batch>(R_BATCHES, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: {}
      })
      expect(listBefore.total).toBe(1)
      await expect(
        provider.delete<Batch>(R_BATCHES, { id: created.data.id })
      ).resolves.toBeTruthy()

      const listAfter = await provider.getList<Batch>(R_BATCHES, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: {}
      })
      expect(listAfter.total).toBe(0)
    })
  })
})

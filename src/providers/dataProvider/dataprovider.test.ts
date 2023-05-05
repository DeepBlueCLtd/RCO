import { type DataProvider } from 'react-admin'
import { getDataProvider } from '.'
import { R_BATCHES } from '../../constants'
import { DateTime } from 'luxon'

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
  let id: number
  let batch: Batch
  beforeAll(async () => {
    provider = await getDataProvider(false)
  })

  beforeEach(async () => {
    if (id !== undefined)
      await provider.delete(R_BATCHES, {
        id
      })
  })

  describe('CRUD Operation on Batch', () => {
    it('should create a batch', async () => {
      const result = await provider.create<Batch>(R_BATCHES, {
        data: generateDummyBatchForTesting()
      })
      id = result.data.id
      batch = result.data
      expect(id).toBeDefined()
      expect(batch).toBeDefined()
    })

    it('should get the batch', async () => {
      const createdBatch = await provider.create<Batch>(R_BATCHES, {
        data: generateDummyBatchForTesting()
      })
      id = createdBatch.data.id
      const result = await provider.getOne<Batch>(R_BATCHES, {
        id
      })
      const shouldMatchBatch = generateDummyBatchForTesting({ id })
      const expectedResult = result.data
      expect(expectedResult).toMatchObject(shouldMatchBatch)
    })

    it('should update the batch', async () => {
      const createdBatch = await provider.create<Batch>(R_BATCHES, {
        data: generateDummyBatchForTesting()
      })
      id = createdBatch.data.id
      const result = await provider.update<Batch>(R_BATCHES, {
        id,
        previousData: batch,
        data: {
          name: 'dummy-batch',
          createdAt: DateTime.now().toFormat('yyyy-MM-dd')
        }
      })
      const shouldMatchBatch = generateDummyBatchForTesting({
        name: 'dummy-batch',
        id
      })
      const expectedResult = result.data
      expect(expectedResult).toMatchObject(shouldMatchBatch)
    })

    it('should delete the batch', async () => {
      const created = await provider.create<Batch>(R_BATCHES, {
        data: generateDummyBatchForTesting()
      })
      id = created.data.id
      await expect(
        provider.delete<Batch>(R_BATCHES, { id })
      ).resolves.toBeTruthy()
    })
  })
})

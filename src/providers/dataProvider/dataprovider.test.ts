import { type DataProvider } from 'react-admin'
import { getDataProvider } from '.'
import { R_BATCHES } from '../../constants'
import { DateTime } from 'luxon'

const year: number = 2023

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
    batchNumber: 'V01/2023',
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
  beforeAll(async () => {
    provider = await getDataProvider(false)
  })

  describe('CRUD Operation on Batch', () => {
    let id: number
    let batch: Batch

    it('should create a batch', async () => {
      const data = generateDummyBatchForTesting()
      const result = await provider.create<Batch>(R_BATCHES, {
        data
      })
      id = result.data.id
      batch = result.data
      expect(id).toBeDefined()
      expect(batch).toBeDefined()
    })

    it('should get the batch', async () => {
      const data = generateDummyBatchForTesting({ id })
      const result = await provider.getOne<Batch>(R_BATCHES, { id })
      const expectedResult = result.data
      expect(expectedResult).toMatchObject(data)
    })

    it('should update the batch', async () => {
      const updatedValue = generateDummyBatchForTesting({
        name: 'dummy-batch',
        id
      })
      const result = await provider.update<Batch>(R_BATCHES, {
        id,
        previousData: batch,
        data: {
          name: 'dummy-batch',
          createdAt: DateTime.now().toFormat('yyyy-MM-dd')
        }
      })
      const expectedResult = result.data
      expect(expectedResult).toMatchObject(updatedValue)
    })

    it('should delete the batch', async () => {
      await expect(
        provider.delete<Batch>(R_BATCHES, { id })
      ).resolves.toBeTruthy()
    })

    it('should try to get the deleted batch and fail', async () => {
      await expect(provider.getOne<Batch>(R_BATCHES, { id })).rejects.toThrow()
    })
  })
})

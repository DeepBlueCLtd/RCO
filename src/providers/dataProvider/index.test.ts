import * as constants from '../../constants'
import { describe, it, beforeAll } from '@jest/globals'
import { getDataProvider, generateBatchId } from '.'
import { type DataProvider } from 'react-admin'
interface BatchType {
  data: Batch[]
}

const batches: Record<string, BatchType> = {
  [constants.R_BATCHES]: { data: [] }
}
const year = '2025'

const mockProvider = {
  async getList(resource: string, filter: any) {
    const data = batches[resource].data.filter(
      (d) => d.yearOfReceipt === filter.filter.yearOfReceipt
    )
    return { data, total: data.length }
  },

  async create(resource: string, params: { data: Batch }) {
    batches[resource].data.push({ ...params.data })
    return batches
  },

  async clear(resource: string) {
    batches[resource].data = []
  },

  async deleteMany(resource: string, toDelete: { ids: number[] }) {
    batches[resource].data = batches[resource].data.filter(
      (b) => !toDelete.ids.includes(b.id)
    )
  }
}

jest.mock('.', () => {
  const originalModule = jest.requireActual('.')
  return {
    ...originalModule,
    async getDataProvider() {
      return mockProvider
    }
  }
})

const generateBatch = async (
  id: number,
  provider: DataProvider,
  year: string,
  batchNumber?: string
) => {
  const obj: Batch = {
    id,
    createdAt: Date.now().toString(),
    name: `batch-${year}`,
    batchNumber: `V${batchNumber ?? id}/${year}`,
    vault: id,
    yearOfReceipt: year,
    department: id,
    project: id,
    platform: id,
    organisation: id,
    protectiveMarkingAuthority: id,
    maximumProtectiveMarking: id,
    remarks: `remarks-batch-${year}`
  }

  await provider.create(constants.R_BATCHES, { data: { ...obj } })
  id++
}

describe('generateBatchId', () => {
  let provider: DataProvider
  let id: number

  beforeAll(async () => {
    provider = await getDataProvider()
  })

  beforeEach(() => {
    id = 1
    provider.clear(constants.R_BATCHES)
  })

  describe('when there are no batches in the specified year', () => {
    it('should return 00', async () => {
      const result = await generateBatchId(provider, year)
      expect(result).toBe('00')
    })
  })

  describe('when there is one batch in the specified year', () => {
    it('should return 02', async () => {
      await generateBatch(id, provider, year)
      const result = await generateBatchId(provider, year)
      expect(result).toBe('02')
    })
  })

  describe('when there are multiple batches in the specified year', () => {
    it('should return 03', async () => {
      await generateBatch(id++, provider, year)
      await generateBatch(id, provider, year)
      const result = await generateBatchId(provider, year)
      expect(result).toBe('03')
    })
  })

  describe('when an invalid value is provided for year (non-integer)', () => {
    it('should throw a TypeError', async () => {
      const year = 'aaa'
      await expect(
        async () => await generateBatchId(provider, year)
      ).rejects.toThrow(TypeError)
    })
  })
})

describe('generateBatchId for values greater than 9', () => {
  let provider: DataProvider

  beforeAll(async () => {
    provider = await getDataProvider()
    for (let i = 0; i < 20; i++) {
      await generateBatch(
        i,
        provider,
        year,
        await generateBatchId(provider, year)
      )
    }
  })

  describe('validate batch numbers', () => {
    it('should validate first 20 batchNumber and delete first 10 entries', async () => {
      const batchData = await provider.getList(constants.R_BATCHES, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: { yearOfReceipt: year }
      })
      for (let i = 0; i < batchData.data.length; i++) {
        expect(batchData.data[i].batchNumber).toBe(
          `V${i.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
          })}/${year}`
        )
      }
      // deleting first 10 entries
      const ids = Array(10)
        .fill(null)
        .map((_, i) => i)
      await provider.deleteMany(constants.R_BATCHES, { ids })

      // inserting new 10 entries
      for (let i = 0; i < 10; i++) {
        await generateBatch(
          i,
          provider,
          year,
          await generateBatchId(provider, year)
        )
      }

      const batchData1 = await provider.getList(constants.R_BATCHES, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: { yearOfReceipt: year }
      })

      for (let i = 20; i < batchData1.data.length; i++) {
        expect(batchData1.data[i].batchNumber).toBe(
          `V${i.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
          })}/${year}`
        )
      }
    })
  })
})

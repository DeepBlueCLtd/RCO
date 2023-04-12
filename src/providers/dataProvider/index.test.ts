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
let id: number = 0

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

const generateBatch = async (provider: DataProvider, year: string) => {
  const obj: Batch = {
    id,
    createdAt: Date.now().toString(),
    name: `batch-${year}`,
    batchNumber: `V${id}/${year}`,
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

  beforeAll(async () => {
    provider = await getDataProvider()
  })

  describe('when there are no batches in the specified year', () => {
    it('should return 00', async () => {
      provider.clear(constants.R_BATCHES)
      const result = await generateBatchId(provider, year)
      expect(result).toBe(`0${id}`)
    })
  })

  describe('when there is one batch in the specified year', () => {
    it('should return 01', async () => {
      provider.clear(constants.R_BATCHES)
      await generateBatch(provider, year)
      const result = await generateBatchId(provider, year)
      expect(result).toBe(`0${id}`)
    })
  })

  describe('when there are multiple batches in the specified year', () => {
    it('should return 02', async () => {
      provider.clear(constants.R_BATCHES)
      await generateBatch(provider, year)
      await generateBatch(provider, year)
      const result = await generateBatchId(provider, year)
      expect(result).toBe(`0${id}`)
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

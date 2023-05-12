import { type AuditFunctionType, withCreatedByAt } from '../dataprovider-utils'
import {
  type CreateResult,
  type DataProvider,
  type UpdateParams
} from 'ra-core'
import { AuditType } from '../../../utils/activity-types'
import { R_BATCHES } from '../../../constants'
import { type ResourceCallbacks } from 'react-admin'
import { isNumber } from '../../../utils/number'

const compareVersions = (v1: string, v2: string): number => {
  const s1 = parseInt(v1.substring(1))
  const s2 = parseInt(v2.substring(1))
  if (isNaN(s1) || isNaN(s2)) return NaN
  if (s1 < s2) {
    return -1
  } else if (s1 > s2) {
    return 1
  } else {
    return 0
  }
}

export const generateBatchId = async (
  provider: DataProvider,
  year: string
): Promise<string> => {
  if (!isNumber(year)) throw new TypeError('Year invalid')
  const batches = await provider.getList(R_BATCHES, {
    sort: { field: 'id', order: 'ASC' },
    pagination: { page: 1, perPage: 1000 },
    filter: { yearOfReceipt: year }
  })

  if (batches.data.length === 0) {
    return '00'
  }

  if (batches.data.length === 1) {
    return '01'
  }
  const greatestBatch = batches.data.reduce((prev, current) =>
    compareVersions(prev.batchNumber, current.batchNumber) === -1
      ? current
      : prev
  )

  return (parseInt(greatestBatch.batchNumber.substring(1)) + 1).toLocaleString(
    'en-US',
    {
      minimumIntegerDigits: 2,
      useGrouping: false
    }
  )
}

export default (
  audit: AuditFunctionType,
  provider: DataProvider
): ResourceCallbacks<any> => ({
  resource: R_BATCHES,
  beforeUpdate: async (record: UpdateParams<Batch>) => {
    await audit({
      type: AuditType.EDIT_BATCH,
      activityDetail: `Batch updated (${String(record.data.id)})`,
      securityRelated:
        record.previousData.maximumProtectiveMarking !==
        record.data.maximumProtectiveMarking,
      resource: R_BATCHES,
      dataId: record.previousData.id
    })
    return record
  },
  beforeCreate: async (record: CreateResult<Batch>) => {
    return withCreatedByAt(record)
  },
  afterCreate: async (
    record: CreateResult<Batch>,
    dataProvider: DataProvider
  ) => {
    try {
      const { data } = record
      const { id, yearOfReceipt: year } = data
      const yearVal: string = year
      const idVal: string = await generateBatchId(provider, year)
      const batchNumber = `V${idVal}/${yearVal}`
      await dataProvider.update<Batch>(R_BATCHES, {
        id,
        previousData: data,
        data: {
          batchNumber
        }
      })
      await audit({
        type: AuditType.CREATE_BATCH,
        activityDetail: `Batch created (${String(id)})`,
        resource: R_BATCHES,
        dataId: record.data.id
      })
      return record
    } catch (error) {
      return record
    }
  }
})

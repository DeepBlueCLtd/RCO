import {
  type AuditFunctionType,
  withCreatedByAt,
  extendLifeCycle
} from '../dataprovider-utils'
import { type CreateResult, type DataProvider } from 'ra-core'
import { AuditType } from '../../../utils/activity-types'
import { R_BATCHES } from '../../../constants'
import {
  type UpdateParams,
  type ResourceCallbacks,
  type CreateParams
} from 'react-admin'
import { isNumber } from '../../../utils/number'

const compareVersions = (v1: string, v2: string): number => {
  const s1 = parseInt(v1, 10)
  const s2 = parseInt(v2, 10)
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
  year: number
): Promise<string> => {
  if (!isNumber(year)) throw new TypeError('Year invalid')
  const batches = await provider.getList(R_BATCHES, {
    sort: { field: 'id', order: 'ASC' },
    pagination: { page: 1, perPage: 1000 },
    filter: { yearOfReceipt: year }
  })

  if (batches.data.length === 0) {
    return '0'
  }

  if (batches.data.length === 1) {
    return '1'
  }

  const greatestBatch = batches.data.reduce((prev, current) => {
    // get the first number in the sequence, taken from here:
    // https://stackoverflow.com/a/609588/92441

    if (!current.batchNumber) return prev

    const previousBatchIndex = prev.batchNumber.match(/\d+/)[0]
    const currentBatchIndex = current.batchNumber.match(/\d+/)[0]

    return compareVersions(previousBatchIndex, currentBatchIndex) === -1
      ? current
      : prev
  })
  const newId = greatestBatch.batchNumber.match(/\d+/)[0]
  return (parseInt(newId, 10) + 1).toLocaleString('en-US', {
    useGrouping: false
  })
}

const lifeCycles = (
  provider: DataProvider,
  audit: AuditFunctionType
): Omit<ResourceCallbacks<any>, 'resource'> => ({
  beforeCreate: async (record: CreateParams<Batch>) => {
    const createdByAt = withCreatedByAt(record)
    return createdByAt
  },
  afterCreate: async (
    record: CreateResult<Batch>,
    dataProvider: DataProvider
  ) => {
    const { data } = record
    const { id, yearOfReceipt: year } = data
    const yearVal = year
    const idVal: string = await generateBatchId(provider, year)
    const batchNumber = `${idVal}/${yearVal}`
    const withRef = await dataProvider.update<Batch>(R_BATCHES, {
      id,
      previousData: data,
      data: {
        batchNumber
      }
    })

    await audit({
      activityType: AuditType.CREATE,
      resource: R_BATCHES,
      dataId: record.data.id,
      subjectId: null,
      subjectResource: null,
      securityRelated: null,
      activityDetail: null
    })
    return { ...record, data: withRef.data }
  }
})

const securityRelated = (record: UpdateParams<any>): boolean =>
  record.previousData.protectiveMarking !== record.data.protectiveMarking

export default (
  audit: AuditFunctionType,
  provider: DataProvider
): ResourceCallbacks<any> => {
  return extendLifeCycle(
    R_BATCHES,
    audit,
    securityRelated,
    lifeCycles(provider, audit)
  )
}

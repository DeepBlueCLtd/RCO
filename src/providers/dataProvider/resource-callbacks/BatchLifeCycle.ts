import {
  type AuditFunctionType,
  generateBatchId,
  withCreatedByAt
} from '../dataprovider-utils'
import {
  type CreateResult,
  type DataProvider,
  type UpdateParams
} from 'ra-core'
import { AuditType } from '../../../utils/activity-types'
import { R_BATCHES } from '../../../constants'
import { type ResourceCallbacks } from 'react-admin'

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
      id: record.previousData.id
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
        id: record.data.id
      })
      return record
    } catch (error) {
      return record
    }
  }
})

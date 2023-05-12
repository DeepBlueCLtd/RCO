import {
  type CreateResult,
  type DataProvider,
  type ResourceCallbacks,
  type UpdateParams
} from 'ra-core'

import {
  convertDateToISO,
  withCreatedByAt,
  auditForUpdatedChanges,
  type AuditFunctionType
} from '../dataprovider-utils'
import { AuditType } from '../../../utils/activity-types'
import { R_BATCHES, R_ITEMS } from '../../../constants'

export default (audit: AuditFunctionType): ResourceCallbacks<any> => ({
  resource: R_ITEMS,
  beforeCreate: async (record: CreateResult<Item>) => {
    convertDateToISO<Item>(record.data, ['start', 'end'])
    record.data.start = new Date(record.data.start).toISOString()
    record.data.end = new Date(record.data.end).toISOString()
    return withCreatedByAt(record)
  },
  beforeUpdate: async (record: UpdateParams<Item>) => {
    const securityRelated =
      record.previousData.protectiveMarking !== record.data.protectiveMarking
    return await auditForUpdatedChanges(
      record,
      R_ITEMS,
      {
        type: AuditType.EDIT_ITEM,
        securityRelated
      },
      audit
    )
  },
  afterCreate: async (
    record: CreateResult<Item>,
    dataProvider: DataProvider
  ) => {
    try {
      const { data } = record
      const { batchId, id } = data
      const { data: batch } = await dataProvider.getOne<Batch>(R_BATCHES, {
        id: batchId
      })
      const idCtr: number = id
      const idVal: string = (idCtr + 1).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })
      const batchNumber: string = batch.batchNumber
      const itemNumber = `${batchNumber}/${idVal}`

      await dataProvider.update<Item>(R_ITEMS, {
        id,
        previousData: data,
        data: {
          item_number: itemNumber
        }
      })
      await audit({
        type: AuditType.CREATE_ITEM,
        resource: R_ITEMS,
        dataId: id
      })
      return record
    } catch (error) {
      console.log({ error })
      return record
    }
  }
})

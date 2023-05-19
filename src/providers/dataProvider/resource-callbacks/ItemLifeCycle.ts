import {
  type CreateResult,
  type DataProvider,
  type ResourceCallbacks
} from 'ra-core'

import {
  convertDateToISO,
  withCreatedByAt,
  type AuditFunctionType,
  extendLifeCycle
} from '../dataprovider-utils'
import { AuditType } from '../../../utils/activity-types'
import { R_BATCHES, R_ITEMS } from '../../../constants'
import { type UpdateParams } from 'react-admin'

const lifeCycles = (
  audit: AuditFunctionType
): Omit<ResourceCallbacks<any>, 'resource'> => ({
  beforeCreate: async (record: CreateResult<Item>) => {
    convertDateToISO<Item>(record.data, ['start', 'end'])
    record.data.start = new Date(record.data.start).toISOString()
    record.data.end = new Date(record.data.end).toISOString()
    return withCreatedByAt(record)
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
        type: AuditType.CREATE,
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

const securityRelated: (record: UpdateParams<any>) => boolean = (record) => {
  return record.previousData.protectiveMarking !== record.data.protectiveMarking
}

export default (audit: AuditFunctionType): ResourceCallbacks<any> => {
  return extendLifeCycle(R_ITEMS, audit, securityRelated, lifeCycles(audit))
}

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
import { R_BATCHES, R_ITEMS, SAVE_EVENT } from '../../../constants'
import { type CreateParams, type UpdateParams } from 'react-admin'
import { emitter } from '../../../resources/items/ItemForm/ItemFormToolbar'

const lifeCycles = (
  audit: AuditFunctionType
): Omit<ResourceCallbacks<any>, 'resource'> => ({
  beforeCreate: async (
    record: CreateParams<Item>
    // dataProvider: DataProvider
  ) => {
    const fields: Array<keyof Item> = ['startDate', 'endDate']
    convertDateToISO<Item>(record.data, fields)
    // TODO: This feature is only necessary for mock backend. It should be deleted for SQL backend.
    // const {
    //   data: { project, platform }
    // } = await dataProvider.getOne<Batch>(R_BATCHES, {
    //   id: record.data.batch
    // })
    // record.data.project = project
    // record.data.platform = platform
    return withCreatedByAt(record)
  },
  afterCreate: async (
    record: CreateResult<Item>,
    dataProvider: DataProvider
  ) => {
    try {
      const { data } = record
      const { batch, id } = data
      const { data: batchObj } = await dataProvider.getOne<Batch>(R_BATCHES, {
        id: batch
      })

      const items = await dataProvider.getList<Item>(R_ITEMS, {
        filter: { batch },
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 }
      })
      const idVal: string = (
        items.total !== undefined ? items.total : 1
      ).toLocaleString('en-US', {
        useGrouping: false
      })
      const batchNumber: string = batchObj.batchNumber
      const itemNumber = `${batchNumber}/${idVal}`
      const withItemRef = await dataProvider.update<Item>(R_ITEMS, {
        id,
        previousData: data,
        data: {
          itemNumber
        }
      })
      await audit({
        activityType: AuditType.CREATE,
        resource: R_ITEMS,
        dataId: id,
        subjectId: null,
        subjectResource: null,
        securityRelated: null,
        activityDetail: null
      })
      emitter.emit(SAVE_EVENT, itemNumber)
      return { ...record, data: withItemRef.data }
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

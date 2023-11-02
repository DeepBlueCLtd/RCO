import { type CreateResult, type ResourceCallbacks } from 'ra-core'

import {
  withCreatedByAt,
  type AuditFunctionType,
  generateReference
} from '../dataprovider-utils'
import { AuditType } from '../../../utils/activity-types'
import { R_DESTRUCTION } from '../../../constants'
import { type DataProvider, type CreateParams } from 'react-admin'

export default (audit: AuditFunctionType): ResourceCallbacks<any> => ({
  resource: R_DESTRUCTION,
  beforeCreate: async (record: CreateParams<Destruction>) => {
    return withCreatedByAt(record)
  },
  afterCreate: async (
    record: CreateResult<Destruction>,
    dataProvider: DataProvider
  ) => {
    const { data } = record
    const { id } = data
    await audit({
      activityType: AuditType.CREATE,
      resource: R_DESTRUCTION,
      dataId: id,
      subjectId: null,
      subjectResource: null,
      activityDetail: null,
      securityRelated: null
    })
    const year = new Date().getFullYear().toString()

    const name = await generateReference<Destruction>(
      dataProvider,
      year,
      R_DESTRUCTION,
      'name',
      undefined,
      'DC'
    )

    await dataProvider.update<Dispatch>(R_DESTRUCTION, {
      id,
      previousData: data,
      data: {
        name,
        ...(process.env.MOCK ? { finalisedAt: 'null' } : null)
      }
    })
    return record
  }
})

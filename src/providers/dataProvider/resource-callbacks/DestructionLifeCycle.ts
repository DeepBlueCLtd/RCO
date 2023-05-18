import { type CreateResult, type ResourceCallbacks } from 'ra-core'

import { withCreatedByAt, type AuditFunctionType } from '../dataprovider-utils'
import { AuditType } from '../../../utils/activity-types'
import { R_DESTRUCTION } from '../../../constants'

export default (audit: AuditFunctionType): ResourceCallbacks<any> => ({
  resource: R_DESTRUCTION,
  beforeCreate: async (record: CreateResult<Destruction>) => {
    return withCreatedByAt(record)
  },
  afterCreate: async (record: CreateResult<Destruction>) => {
    try {
      const { data } = record
      const { id } = data
      await audit({
        type: AuditType.CREATE,
        resource: R_DESTRUCTION,
        dataId: id
      })
      return record
    } catch (error) {
      console.log({ error })
      return record
    }
  }
})

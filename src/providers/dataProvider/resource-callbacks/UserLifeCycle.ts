import { AuditType } from '../../../utils/activity-types'
import {
  type CreateResult,
  type ResourceCallbacks,
  type UpdateParams
} from 'ra-core'
import {
  auditForUpdatedChanges,
  type AuditFunctionType,
  withCreatedByAt
} from '../dataprovider-utils'
import { R_USERS } from '../../../constants'

export default (audit: AuditFunctionType): ResourceCallbacks<any> => ({
  resource: R_USERS,
  beforeCreate: async (record: CreateResult<User>) => {
    return withCreatedByAt(record)
  },
  afterCreate: async (record: CreateResult<User>) => {
    await audit({
      type: AuditType.CREATE,
      resource: R_USERS,
      dataId: record.data.id
    })
    return record
  },
  beforeUpdate: async (record: UpdateParams<User>) => {
    const departed =
      record.previousData.active === true && record.data.active === false
    // all user changes are security related
    const securityRelated = true
    return await auditForUpdatedChanges(
      record,
      R_USERS,
      {
        type: departed === true ? AuditType.USER_DEPARTED : AuditType.EDIT,
        securityRelated
      },
      audit
    )
  }
})

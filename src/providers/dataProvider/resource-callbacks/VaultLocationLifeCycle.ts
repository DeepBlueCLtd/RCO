import { AuditType } from '../../../utils/activity-types'
import {
  type CreateResult,
  type ResourceCallbacks,
  type UpdateParams
} from 'ra-core'
import {
  auditForUpdatedChanges,
  type AuditFunctionType
} from '../dataprovider-utils'
import { R_VAULT_LOCATION } from '../../../constants'

export default (audit: AuditFunctionType): ResourceCallbacks<any> => ({
  resource: R_VAULT_LOCATION,
  afterCreate: async (record: CreateResult<User>) => {
    await audit({
      type: AuditType.CREATE,
      resource: R_VAULT_LOCATION,
      dataId: record.data.id
    })
    return record
  },
  beforeUpdate: async (record: UpdateParams<User>) => {
    return await auditForUpdatedChanges(
      record,
      R_VAULT_LOCATION,
      {
        type: AuditType.EDIT,
        securityRelated: false
      },
      audit
    )
  }
})

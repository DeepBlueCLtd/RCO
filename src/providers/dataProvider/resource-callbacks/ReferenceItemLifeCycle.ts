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
import { type ResourceTypes } from '../../../constants'

export default (
  audit: AuditFunctionType,
  resource: ResourceTypes
): ResourceCallbacks<any> => ({
  resource,
  afterCreate: async (record: CreateResult<User>) => {
    await audit({
      type: AuditType.CREATE,
      resource,
      dataId: record.data.id
    })
    return record
  },
  beforeUpdate: async (record: UpdateParams<User>) => {
    return await auditForUpdatedChanges(
      record,
      resource,
      {
        type: AuditType.EDIT
      },
      audit
    )
  }
})

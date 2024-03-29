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
  resource: ResourceTypes,
  securityRelated?: (record: UpdateParams<RCOResource>) => boolean
): ResourceCallbacks<any> => ({
  resource,
  afterCreate: async (record: CreateResult<RCOResource>) => {
    await audit({
      activityType: AuditType.CREATE,
      resource,
      dataId: record.data.id,
      subjectId: null,
      subjectResource: null,
      activityDetail: null,
      securityRelated: null
    })
    return record
  },
  beforeUpdate: async (record: UpdateParams<RCOResource>) => {
    return await auditForUpdatedChanges(
      record,
      resource,
      {
        activityType: AuditType.EDIT,
        ...(securityRelated !== undefined
          ? { securityRelated: securityRelated(record) }
          : null)
      },
      audit
    )
  }
})

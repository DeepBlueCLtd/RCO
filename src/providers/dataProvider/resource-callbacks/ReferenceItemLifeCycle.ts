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
import { R_BATCHES, R_ITEMS, type ResourceTypes } from '../../../constants'

export default (
  audit: AuditFunctionType,
  resource: ResourceTypes,
  checkSecurityRelated?: boolean
): ResourceCallbacks<any> => ({
  resource,
  afterCreate: async (record: CreateResult<RCOResource>) => {
    await audit({
      type: AuditType.CREATE,
      resource,
      dataId: record.data.id
    })
    return record
  },
  beforeUpdate: async (record: UpdateParams<RCOResource>) => {
    let securityRelated: boolean | undefined
    if (checkSecurityRelated === true) {
      securityRelated = getSecurityRelated(resource, record as UpdateParams)
    }

    return await auditForUpdatedChanges(
      record,
      resource,
      {
        type: AuditType.EDIT,
        ...(securityRelated !== undefined ? { securityRelated } : null)
      },
      audit
    )
  }
})

const getSecurityRelated = <T extends ResourceTypes>(
  resource: T,
  record: UpdateParams<T>
): boolean => {
  switch (resource) {
    case R_BATCHES:
      return checkBatchSecurityRelated(record as UpdateParams)
    case R_ITEMS:
      return checkItemSecurityRelated(record as UpdateParams)
    default:
      return false
  }
}

const checkBatchSecurityRelated = (record: UpdateParams<Batch>): boolean => {
  return (
    record.previousData.maximumProtectiveMarking !==
    record.data.maximumProtectiveMarking
  )
}

const checkItemSecurityRelated = (record: UpdateParams<Item>): boolean =>
  record.previousData.protectiveMarking !== record.data.protectiveMarking

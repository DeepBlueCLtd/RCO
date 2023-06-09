import {
  type AuditFunctionType,
  withCreatedByAt,
  extendLifeCycle,
  auditForUpdatedChanges
} from '../dataprovider-utils'
import { R_USERS } from '../../../constants'
import { AuditType } from '../../../utils/activity-types'
import {
  type CreateParams,
  type ResourceCallbacks,
  type UpdateParams
} from 'react-admin'

const lifeCycles = (
  audit: AuditFunctionType
): Omit<ResourceCallbacks<any>, 'resource'> => ({
  beforeCreate: async (record: CreateParams<User>) => {
    return withCreatedByAt(record)
  },
  beforeUpdate: async (record: UpdateParams<User>) => {
    const departed = record.previousData.active && record.data.active === false
    const returned =
      record.previousData.departedDate !== undefined &&
      record.data.departedDate === undefined
    // all user changes are security related
    const securityRelated = true
    return await auditForUpdatedChanges(
      record,
      R_USERS,
      {
        type: departed
          ? AuditType.USER_DEPARTED
          : returned
          ? AuditType.USER_RETURNED
          : AuditType.EDIT,
        securityRelated
      },
      audit,
      record.id as number
    )
  }
})

const securityRelated = (): boolean => true

export default (audit: AuditFunctionType): ResourceCallbacks<any> => {
  return extendLifeCycle(R_USERS, audit, securityRelated, lifeCycles(audit))
}

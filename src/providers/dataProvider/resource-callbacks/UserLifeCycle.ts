import {
  type AuditFunctionType,
  withCreatedByAt,
  extendLifeCycle,
  auditForUpdatedChanges
} from '../dataprovider-utils'
import { R_USERS } from '../../../constants'
import { AuditType } from '../../../utils/activity-types'
import {
  type UpdateResult,
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
    const departed =
      record.previousData.departedDate === null &&
      record.data.departedDate !== null
    const returned =
      record.previousData.departedDate !== undefined &&
      record.data.departedDate === undefined
    // all user changes are security related
    const securityRelated = true
    return await auditForUpdatedChanges(
      record,
      R_USERS,
      {
        activityType: departed
          ? AuditType.USER_DEPARTED
          : returned
          ? AuditType.USER_RETURNED
          : AuditType.EDIT,
        securityRelated
      },
      audit
    )
  },
  afterUpdate: async (result: UpdateResult<User>) => {
    const { id } = result.data
    const auditObj = {
      resource: R_USERS,
      activityType: AuditType.EDIT,
      activityDetail: 'Password assigned',
      securityRelated: true,
      dataId: id,
      subjectId: null,
      subjectResource: null
    }

    audit(auditObj).catch(console.log)

    return result
  }
})

const securityRelated = (): boolean => true

export default (audit: AuditFunctionType): ResourceCallbacks<any> => {
  return extendLifeCycle(R_USERS, audit, securityRelated, lifeCycles(audit))
}

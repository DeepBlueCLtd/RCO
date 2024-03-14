import {
  type AuditFunctionType,
  withCreatedByAt,
  extendLifeCycle
} from '../dataprovider-utils'
import { R_USERS } from '../../../constants'
import { AuditType } from '../../../utils/activity-types'
import {
  type UpdateResult,
  type CreateParams,
  type ResourceCallbacks,
  type UpdateParams
} from 'react-admin'
import { DateTime } from 'luxon'

const lifeCycles = (
  audit: AuditFunctionType
): Omit<ResourceCallbacks<any>, 'resource'> => {
  let passwordAssigned = false
  return {
    beforeCreate: async (record: CreateParams<User>) => {
      record.data.departedDate = DateTime.now()
        .plus({ years: 10 })
        .toJSDate()
        .toISOString()
      return withCreatedByAt(record)
    },
    beforeUpdate: async (record: UpdateParams<User>) => {
      passwordAssigned =
        (record.previousData.hashed_password === null ||
          record.previousData.hashed_password === undefined) &&
        record.data.hashed_password !== null &&
        record.data.hashed_password !== undefined

      return record
    },
    afterUpdate: async (result: UpdateResult<User>) => {
      if (passwordAssigned) {
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
      }

      return result
    }
  }
}

const securityRelated = (): boolean => true

export default (audit: AuditFunctionType): ResourceCallbacks<any> => {
  return extendLifeCycle(R_USERS, audit, securityRelated, lifeCycles(audit))
}

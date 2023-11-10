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
  type UpdateParams,
  type CreateResult,
  type DataProvider
} from 'react-admin'
import { DateTime } from 'luxon'

const lifeCycles = (
  audit: AuditFunctionType
): Omit<ResourceCallbacks<any>, 'resource'> => {
  let passwordAssigned = false
  return {
    beforeCreate: async (record: CreateParams<User>) => {
      return withCreatedByAt(record)
    },
    beforeUpdate: async (record: UpdateParams<User>) => {
      passwordAssigned =
        (record.previousData.password === null ||
          record.previousData.password === undefined) &&
        record.data.password !== null &&
        record.data.password !== undefined

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
    },
    afterCreate: async (
      result: CreateResult<User>,
      dataProvider: DataProvider
    ): Promise<CreateResult<User>> => {
      await dataProvider.update<User>(R_USERS, {
        id: result.data.id,
        data: { departedDate: DateTime.local().plus({ years: 10 }) },
        previousData: result.data
      })
      return result
    }
  }
}

const securityRelated = (): boolean => true

export default (audit: AuditFunctionType): ResourceCallbacks<any> => {
  return extendLifeCycle(R_USERS, audit, securityRelated, lifeCycles(audit))
}

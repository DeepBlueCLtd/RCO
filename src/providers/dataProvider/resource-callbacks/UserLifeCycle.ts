import { AuditType } from '../../../utils/activity-types'
import {
  type CreateResult,
  type ResourceCallbacks,
  type UpdateResult
} from 'ra-core'
import { type AuditFunctionType } from '../dataprovider-utils'
import { R_USERS } from '../../../constants'

export default (audit: AuditFunctionType): ResourceCallbacks<any> => ({
  resource: R_USERS,
  afterCreate: async (record: CreateResult<User>) => {
    await audit({
      type: AuditType.CREATE_USER,
      activityDetail: `User created (${record.data.id})`,
      resource: R_USERS,
      id: record.data.id
    })
    return record
  },
  afterUpdate: async (record: UpdateResult<User>) => {
    await audit({
      type: AuditType.EDIT_USER,
      activityDetail: `User updated (${record.data.id})`,
      resource: R_USERS,
      id: record.data.id
    })
    return record
  }
})

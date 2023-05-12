import { type AuditFunctionType, withCreatedByAt } from '../dataprovider-utils'
import { AuditType } from '../../../utils/activity-types'
import {
  type ResourceCallbacks,
  type CreateResult,
  type UpdateResult
} from 'ra-core'
import { R_PROJECTS } from '../../../constants'

export default (audit: AuditFunctionType): ResourceCallbacks<any> => ({
  resource: R_PROJECTS,
  beforeCreate: async (record: CreateResult<Project>) => {
    return withCreatedByAt(record)
  },
  afterCreate: async (record: CreateResult<Project>) => {
    await audit({
      type: AuditType.CREATE_PROJECT,
      activityDetail: `Project created (${String(record.data.id)})`,
      resource: R_PROJECTS,
      dataId: record.data.id
    })
    return record
  },
  afterUpdate: async (record: UpdateResult<Project>) => {
    await audit({
      type: AuditType.EDIT_PROJECT,
      activityDetail: `Project updated (${String(record.data.id)})`,
      resource: R_PROJECTS,
      dataId: record.data.id
    })
    return record
  }
})

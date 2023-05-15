import {
  type AuditFunctionType,
  withCreatedByAt,
  auditForUpdatedChanges
} from '../dataprovider-utils'
import { AuditType } from '../../../utils/activity-types'
import { type ResourceCallbacks, type CreateResult } from 'ra-core'
import { R_PROJECTS } from '../../../constants'
import { type UpdateParams } from 'react-admin'

export default (audit: AuditFunctionType): ResourceCallbacks<any> => ({
  resource: R_PROJECTS,
  beforeCreate: async (record: CreateResult<Project>) => {
    return withCreatedByAt(record)
  },
  afterCreate: async (record: CreateResult<Project>) => {
    await audit({
      type: AuditType.CREATE_PROJECT,
      resource: R_PROJECTS,
      dataId: record.data.id
    })
    return record
  },
  beforeUpdate: async (record: UpdateParams<Batch>) => {
    return await auditForUpdatedChanges(
      record,
      R_PROJECTS,
      {
        type: AuditType.EDIT_PROJECT
      },
      audit
    )
  }
})

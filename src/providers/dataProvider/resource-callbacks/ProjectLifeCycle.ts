import {
  type AuditFunctionType,
  withCreatedByAt,
  extendLifeCycle
} from '../dataprovider-utils'
import { AuditType } from '../../../utils/activity-types'
import {
  type ResourceCallbacks,
  type CreateResult,
  type UpdateResult
} from 'ra-core'
import { R_PROJECTS } from '../../../constants'

const lifeCycles = (
  audit: AuditFunctionType
): Omit<ResourceCallbacks<any>, 'resource'> => ({
  beforeCreate: async (record: CreateResult<Project>) => {
    return withCreatedByAt(record)
  },
  afterUpdate: async (record: UpdateResult<Project>) => {
    await audit({
      type: AuditType.EDIT,
      resource: R_PROJECTS,
      dataId: record.data.id
    })
    return record
  }
})

export default (audit: AuditFunctionType): ResourceCallbacks<any> => {
  return extendLifeCycle(R_PROJECTS, audit, false, lifeCycles(audit))
}

import {
  type AuditFunctionType,
  withCreatedByAt,
  extendLifeCycle
} from '../dataprovider-utils'
import { type ResourceCallbacks, type CreateResult } from 'ra-core'
import { R_PROJECTS } from '../../../constants'

const lifeCycles = (): Omit<ResourceCallbacks<any>, 'resource'> => ({
  beforeCreate: async (record: CreateResult<Project>) => {
    return withCreatedByAt(record)
  }
})

export default (audit: AuditFunctionType): ResourceCallbacks<any> => {
  return extendLifeCycle(R_PROJECTS, audit, false, lifeCycles())
}

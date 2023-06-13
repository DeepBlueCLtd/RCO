import {
  type AuditFunctionType,
  withCreatedByAt,
  extendLifeCycle
} from '../dataprovider-utils'
import { type ResourceCallbacks } from 'ra-core'
import { R_PROJECTS } from '../../../constants'
import { type CreateParams } from 'react-admin'

const lifeCycles = (): Omit<ResourceCallbacks<any>, 'resource'> => ({
  beforeCreate: async (record: CreateParams<Project>) => {
    return withCreatedByAt(record)
  }
})

export default (audit: AuditFunctionType): ResourceCallbacks<any> => {
  return extendLifeCycle(R_PROJECTS, audit, undefined, lifeCycles())
}

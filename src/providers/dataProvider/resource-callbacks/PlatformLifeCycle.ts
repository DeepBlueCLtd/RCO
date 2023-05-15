import {
  type AuditFunctionType,
  auditForUpdatedChanges
} from '../dataprovider-utils'
import { AuditType } from '../../../utils/activity-types'
import { type ResourceCallbacks } from 'ra-core'
import { R_PLATFORMS } from '../../../constants'
import { type UpdateParams } from 'react-admin'

export default (audit: AuditFunctionType): ResourceCallbacks<any> => ({
  resource: R_PLATFORMS,
  beforeUpdate: async (record: UpdateParams<Batch>) => {
    return await auditForUpdatedChanges(
      record,
      R_PLATFORMS,
      {
        type: AuditType.EDIT_PLATFROM
      },
      audit
    )
  }
})

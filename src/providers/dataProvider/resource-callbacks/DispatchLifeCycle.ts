import {
  type AuditFunctionType,
  withCreatedByAt,
  extendLifeCycle,
  generateReference
} from '../dataprovider-utils'
import { type CreateResult, type DataProvider } from 'ra-core'
import { AuditType } from '../../../utils/activity-types'
import { R_DISPATCH } from '../../../constants'
import {
  type UpdateParams,
  type ResourceCallbacks,
  type CreateParams
} from 'react-admin'

const lifeCycles = (
  provider: DataProvider,
  audit: AuditFunctionType
): Omit<ResourceCallbacks<any>, 'resource'> => ({
  beforeCreate: async (record: CreateParams<Batch>) => {
    const createdByAt = withCreatedByAt(record)
    return createdByAt
  },
  afterCreate: async (
    record: CreateResult<Dispatch>,
    dataProvider: DataProvider
  ) => {
    try {
      const { data } = record
      const { id } = data

      const year: string = new Date().getFullYear().toString()

      const reference: string = await generateReference<Dispatch>(
        provider,
        year,
        R_DISPATCH,
        'reference'
      )

      const withRef = await dataProvider.update<Dispatch>(R_DISPATCH, {
        id,
        previousData: data,
        data: {
          reference
        }
      })
      await audit({
        type: AuditType.CREATE,
        resource: R_DISPATCH,
        dataId: record.data.id
      })
      return { ...record, data: withRef.data }
    } catch (error) {
      return record
    }
  }
})

const securityRelated = (record: UpdateParams<any>): boolean =>
  record.previousData.maximumProtectiveMarking !==
  record.data.maximumProtectiveMarking

export default (
  audit: AuditFunctionType,
  provider: DataProvider
): ResourceCallbacks<any> => {
  return extendLifeCycle(
    R_DISPATCH,
    audit,
    securityRelated,
    lifeCycles(provider, audit)
  )
}

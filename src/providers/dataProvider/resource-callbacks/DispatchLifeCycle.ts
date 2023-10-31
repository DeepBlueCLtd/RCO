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
  afterCreate: async function afterCreate(
    record: CreateResult<Dispatch>,
    dataProvider: DataProvider
  ) {
    try {
      const { data } = record
      const { id } = data

      const configData = await provider.configData()

      const year: string = new Date().getFullYear().toString()

      const name: string = await generateReference<Dispatch>(
        provider,
        year,
        R_DISPATCH,
        'name',
        undefined,
        `${configData.reportPrefix}/V`
      )

      const withRef = await dataProvider.update<Dispatch>(R_DISPATCH, {
        id,
        previousData: data,
        data: {
          name,
          ...(process.env.MOCK ? { dispatchedAt: 'null' } : null)
        }
      })
      await audit({
        activityType: AuditType.CREATE,
        resource: R_DISPATCH,
        dataId: record.data.id,
        subjectId: null,
        subjectResource: null,
        securityRelated: null,
        activityDetail: null
      })
      return { ...record, data: withRef.data }
    } catch (error) {
      return record
    }
  }
})

const securityRelated = (record: UpdateParams<any>): boolean =>
  record.previousData.protectiveMarking !== record.data.protectiveMarking

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

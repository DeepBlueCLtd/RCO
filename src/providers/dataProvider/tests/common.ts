import { withLifecycleCallbacks, type DataProvider } from 'react-admin'
import { R_AUDIT, type ResourceTypes } from '../../../constants'
import { AuditType } from '../../../utils/activity-types'
import { clear, type generateActiveReferenceItemForTesting } from './dummy-data'
import localForageDataProvider from 'ra-data-local-forage'
import { lifecycleCallbacks } from '..'
import { trackEvent } from '../../../utils/audit'

const TEST_STORAGE_KEY = 'rco-test'

interface CommonReturnType {
  checkEmptyAuditList: (provider: DataProvider) => Promise<void>
  checkAuditListForFirstEntry: (
    createdResource: IntegerReferenceItem
  ) => Promise<void>
  checkAuditListForSecondEntry: (
    createdResource: IntegerReferenceItem
  ) => Promise<void>
  createResource: (
    dummyDataGenerate: typeof generateActiveReferenceItemForTesting,
    resource: ResourceTypes
  ) => Promise<IntegerReferenceItem>
  checkListBeforeCreate: () => Promise<void>
  checkListAfterCreate: () => Promise<void>
}

const common = (
  provider: DataProvider,
  resource: ResourceTypes
): CommonReturnType => {
  return {
    checkEmptyAuditList: async (provider: DataProvider): Promise<void> => {
      const auditList = await provider.getList<Audit>(R_AUDIT, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: {}
      })

      expect(auditList.total).toBe(0)
    },
    checkAuditListForFirstEntry: async (
      createdResource: IntegerReferenceItem
    ): Promise<void> => {
      const auditList = await provider.getList<Audit>(R_AUDIT, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: {}
      })
      expect(auditList.total).toBe(1)
      if (auditList.data.length === 0) {
        const firstAuditEntry = auditList.data[0]
        expect(firstAuditEntry.dataId).toBe(createdResource.id)
        expect(firstAuditEntry.activityType).toBe(AuditType.CREATE)
        expect(firstAuditEntry.resource).toBe(resource)
      }
    },

    checkAuditListForSecondEntry: async (
      createdResource: IntegerReferenceItem
    ): Promise<void> => {
      const auditList = await provider.getList<Audit>(R_AUDIT, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: {}
      })
      expect(auditList.total).toBe(2)
      if (auditList.data.length > 0) {
        const secondAuditEntry = auditList.data[1]
        expect(secondAuditEntry.dataId).toBe(createdResource.id)
        expect(secondAuditEntry.activityType).toBe(AuditType.EDIT)
        expect(secondAuditEntry.resource).toBe(resource)
      }
    },
    createResource: async (
      dummyDataGenerate: typeof generateActiveReferenceItemForTesting,
      resource: ResourceTypes
    ): Promise<IntegerReferenceItem> => {
      const createdResource = (
        await provider.create<IntegerReferenceItem>(resource, {
          data: dummyDataGenerate(`Dummy-${(resource as string).toUpperCase()}`)
        })
      ).data

      expect(createdResource).not.toBeUndefined()
      expect(createdResource.id).toBeDefined()

      return createdResource
    },

    checkListBeforeCreate: async (): Promise<void> => {
      const listBeforeCreate = await provider.getList<IntegerReferenceItem>(
        resource,
        {
          sort: { field: 'id', order: 'ASC' },
          pagination: { page: 1, perPage: 1000 },
          filter: {}
        }
      )
      expect(listBeforeCreate.total).toBe(0)
    },

    checkListAfterCreate: async (): Promise<void> => {
      const listAfterCreate = await provider.getList<IntegerReferenceItem>(
        resource,
        {
          sort: { field: 'id', order: 'ASC' },
          pagination: { page: 1, perPage: 1000 },
          filter: {}
        }
      )
      expect(listAfterCreate.total).toBe(1)
    }
  }
}

const commonBeforeEach = async (TO_CLEAR: any[]): Promise<DataProvider> => {
  const withOutLifecycleProvider = await localForageDataProvider({
    prefixLocalForageKey: TEST_STORAGE_KEY
  })
  const provider = withLifecycleCallbacks(
    withOutLifecycleProvider,
    lifecycleCallbacks(
      trackEvent(withOutLifecycleProvider),
      withOutLifecycleProvider
    )
  )
  const clearLists = clear(provider)
  for (const resource of TO_CLEAR) {
    await clearLists(resource)
  }
  return provider
}

export { common, commonBeforeEach }

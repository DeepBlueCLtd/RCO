import {
  type AuthProvider,
  type DataProvider,
  withLifecycleCallbacks
} from 'react-admin'
import {
  R_AUDIT,
  R_PLATFORMS,
  R_USERS,
  type ResourceTypes
} from '../../../constants'
import { lifecycleCallbacks } from '..'
import { trackEvent } from '../../../utils/audit'
import { encryptedUsers } from '../../../utils/init-data'
import authProvider from '../../authProvider'
import { clear, generatePlatformForTesting } from './dummy-data'
import localForageDataProvider from 'ra-data-local-forage'
import { AuditType } from '../../../utils/activity-types'

const TEST_STORAGE_KEY = 'rco-test'
const TO_CLEAR: ResourceTypes[] = [R_PLATFORMS, R_AUDIT]

describe('CRUD operations on Platform Resource', () => {
  let provider: DataProvider
  let auth: AuthProvider

  beforeAll(async () => {
    const provider = await localForageDataProvider({
      prefixLocalForageKey: TEST_STORAGE_KEY
    })
    for (const user of encryptedUsers()) {
      await provider.create<_Users>(R_USERS, { data: { ...user } })
    }
    auth = authProvider(provider)
    await auth.login({ staffNumber: 'd-1', password: process.env.PASSWORD })
  })

  beforeEach(async () => {
    const withOutLifecycleProvider = await localForageDataProvider({
      prefixLocalForageKey: TEST_STORAGE_KEY
    })
    provider = withLifecycleCallbacks(
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
  })

  it('should create platform', async () => {
    const listBeforeCreate = await provider.getList<Platform>(R_PLATFORMS, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(listBeforeCreate.total).toBe(0)

    const createdPlatform = (
      await provider.create<Platform>(R_PLATFORMS, {
        data: generatePlatformForTesting()
      })
    ).data

    expect(createdPlatform).toBeDefined()

    const expectedResult = (
      await provider.getOne<Platform>(R_PLATFORMS, {
        id: createdPlatform.id
      })
    ).data

    expect(expectedResult).toBeDefined()
    expect(expectedResult.id).toBe(createdPlatform.id)

    const listAfterCreate = await provider.getList<Platform>(R_PLATFORMS, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(listAfterCreate.total).toBe(1)
    expect(listAfterCreate.data[0].id).toBe(createdPlatform.id)

    const shouldMatchPlatform = generatePlatformForTesting({
      id: createdPlatform.id
    })

    expect(expectedResult).toMatchObject(shouldMatchPlatform)
  })

  it('should update platform', async () => {
    const createdPlatform = (
      await provider.create<Platform>(R_PLATFORMS, {
        data: generatePlatformForTesting()
      })
    ).data

    expect(createdPlatform.id).toBeDefined()

    await provider.update<Platform>(R_PLATFORMS, {
      id: createdPlatform.id,
      previousData: createdPlatform,
      data: generatePlatformForTesting({
        name: 'dummy-platform-1',
        id: createdPlatform.id
      })
    })

    const expectedResult = (
      await provider.getOne<Platform>(R_PLATFORMS, {
        id: createdPlatform.id
      })
    ).data

    const shouldMatchPlatform = generatePlatformForTesting({
      name: 'dummy-platform-1'
    })

    expect(expectedResult).toMatchObject(shouldMatchPlatform)
  })

  it('should test after create', async () => {
    const auditListBeforeCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListBeforeCreate.total).toBe(0)

    const createdPlatform = (
      await provider.create<Platform>(R_PLATFORMS, {
        data: generatePlatformForTesting()
      })
    ).data

    expect(createdPlatform).toBeDefined()
    expect(createdPlatform.id).toBeDefined()

    const auditListAfterCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(auditListAfterCreate.total).toBe(1)
    const firstAuditEntry = auditListAfterCreate.data[0]
    expect(firstAuditEntry.dataId).toBe(createdPlatform.id)
    expect(firstAuditEntry.activityType).toBe(AuditType.CREATE)
    expect(firstAuditEntry.resource).toBe(R_PLATFORMS)
  })

  it('should test before update', async () => {
    const auditListBeforeCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListBeforeCreate.total).toBe(0)

    const createdPlatform = (
      await provider.create<Platform>(R_PLATFORMS, {
        data: generatePlatformForTesting()
      })
    ).data

    expect(createdPlatform).toBeDefined()
    expect(createdPlatform.id).toBeDefined()

    const auditListAfterCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListAfterCreate.total).toBe(1)

    const firstAuditEntry = auditListAfterCreate.data[0]

    expect(firstAuditEntry.dataId).toBe(createdPlatform.id)
    expect(firstAuditEntry.resource).toBe(R_PLATFORMS)
    expect(firstAuditEntry.activityType).toBe(AuditType.CREATE)

    await provider.update<Platform>(R_PLATFORMS, {
      id: createdPlatform.id,
      previousData: createdPlatform,
      data: generatePlatformForTesting({ name: 'dummy-platform' })
    })

    const auditListAfterUpdate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(auditListAfterUpdate.total).toBe(2)

    const secondAuditEntry = auditListAfterUpdate.data[1]

    expect(secondAuditEntry.dataId).toBe(createdPlatform.id)
    expect(secondAuditEntry.resource).toBe(R_PLATFORMS)
    expect(secondAuditEntry.activityType).toBe(AuditType.EDIT)
  })
})

import {
  withLifecycleCallbacks,
  type AuthProvider,
  type DataProvider
} from 'react-admin'
import { R_AUDIT, R_USERS, type ResourceTypes } from '../../../constants'
import localForageDataProvider from 'ra-data-local-forage'
import { encryptedUsers } from '../../../utils/init-data'
import authProvider from '../../authProvider'
import { lifecycleCallbacks } from '..'
import { trackEvent } from '../../../utils/audit'
import { clear, generateUserForTesting } from './dummy-data'
import { AuditType } from '../../../utils/activity-types'
import { generateRandomDate } from '../../../utils/generateData'

const TEST_STORAGE_KEY = 'rco-test'
const TO_CLEAR: ResourceTypes[] = [R_USERS, R_AUDIT]
describe('CRUD operations on User', () => {
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

  it('should create user', async () => {
    const userListBeforeCreate = await provider.getList<_Users>(R_USERS, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(userListBeforeCreate.total).toBe(0)

    const createdUser = (
      await provider.create<_Users>(R_USERS, {
        data: generateUserForTesting()
      })
    ).data

    const randomDepartDate = createdUser.departedDate as string

    expect(createdUser).toBeDefined()

    const userListAfterCreate = await provider.getList<_Users>(R_USERS, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(userListAfterCreate.total).toBe(1)

    const fetchedUser = (
      await provider.getOne<_Users>(R_USERS, {
        id: createdUser.id
      })
    ).data

    expect(fetchedUser.id).toBeDefined()
    expect(fetchedUser).toBeDefined()

    const shouldMatchUser = generateUserForTesting({
      id: createdUser.id,
      departedDate: randomDepartDate
    })
    expect(fetchedUser).toMatchObject(shouldMatchUser)
  })

  it('should update user', async () => {
    const randomDepartDate = generateRandomDate()[0].toString()

    const createdUser = (
      await provider.create<_Users>(R_USERS, {
        data: generateUserForTesting()
      })
    ).data

    expect(createdUser).toBeDefined()

    await provider.update<_Users>(R_USERS, {
      id: createdUser.id,
      previousData: createdUser,
      data: generateUserForTesting({
        id: createdUser.id,
        name: 'dummy-user',
        departedDate: randomDepartDate
      })
    })
    const fetchedUser = (
      await provider.getOne<_Users>(R_USERS, {
        id: createdUser.id
      })
    ).data

    const shouldMatchUser = generateUserForTesting({
      id: createdUser.id,
      name: 'dummy-user',
      departedDate: randomDepartDate
    })

    expect(fetchedUser).toMatchObject(shouldMatchUser)
  })

  it('should delete user', async () => {
    const createdUser = (
      await provider.create<_Users>(R_USERS, {
        data: generateUserForTesting()
      })
    ).data

    const listAfterCreate = await provider.getList<_Users>(R_USERS, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(listAfterCreate.total).toBe(1)

    await provider.delete<_Users>(R_USERS, { id: createdUser.id })

    const listAfterDelete = await provider.getList<_Users>(R_USERS, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(listAfterDelete.total).toBe(0)
  })

  it('should test before create', async () => {
    const createdUser = (
      await provider.create<_Users>(R_USERS, { data: generateUserForTesting() })
    ).data

    const fetchedUser = (
      await provider.getOne<_Users>(R_USERS, {
        id: createdUser.id
      })
    ).data
    expect(fetchedUser.createdAt).not.toBeUndefined()
    expect(fetchedUser.createdBy).not.toBeUndefined()

    const shouldMatchUser = generateUserForTesting({ id: fetchedUser.id })
    expect(fetchedUser).toMatchObject(shouldMatchUser)
  })

  it('should test after create', async () => {
    const auditListBeforeCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListBeforeCreate.total).toBe(0)

    const createdUser = (
      await provider.create<_Users>(R_USERS, {
        data: generateUserForTesting()
      })
    ).data

    expect(createdUser).toBeDefined()
    expect(createdUser.id).toBeDefined()

    const auditListAfterCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListAfterCreate.total).toBe(1)
    const firstAuditEntry = auditListAfterCreate.data[0]

    expect(firstAuditEntry.dataId).toBe(createdUser.id)
    expect(firstAuditEntry.resource).toBe(R_USERS)
    expect(firstAuditEntry.activityType).toBe(AuditType.CREATE)
  })

  it('should test before update', async () => {
    const auditListBeforeCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListBeforeCreate.total).toBe(0)

    const createdUser = (
      await provider.create<_Users>(R_USERS, { data: generateUserForTesting() })
    ).data

    expect(createdUser.id).toBeDefined()
    expect(createdUser).toBeDefined()

    const auditListAfterCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListAfterCreate.total).toBe(1)
    const firstAuditEntry = auditListAfterCreate.data[0]
    expect(firstAuditEntry.dataId).toBe(createdUser.id)
    expect(firstAuditEntry.resource).toBe(R_USERS)
    expect(firstAuditEntry.activityType).toBe(AuditType.CREATE)

    await provider.update<_Users>(R_USERS, {
      id: createdUser.id,
      previousData: createdUser,
      data: generateUserForTesting({
        id: createdUser.id,
        name: 'dummy-user',
        password: 'abd'
      })
    })

    const auditListAfterUpdate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListAfterUpdate.total).toBe(2)

    const secondAuditEntry = auditListAfterUpdate.data[1]
    expect(secondAuditEntry.dataId).toBe(createdUser.id)
    expect(secondAuditEntry.resource).toBe(R_USERS)
    expect(secondAuditEntry.activityType).toBe(AuditType.EDIT)
    expect(secondAuditEntry.securityRelated).toBe(true)
  })

  it('should test after update', async () => {
    const auditListBeforeCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListBeforeCreate.total).toBe(0)

    const createdUser = (
      await provider.create<_Users>(R_USERS, { data: generateUserForTesting() })
    ).data

    expect(createdUser.id).toBeDefined()
    expect(createdUser).toBeDefined()

    const auditListAfterCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListAfterCreate.total).toBe(1)

    await provider.update<_Users>(R_USERS, {
      id: createdUser.id,
      previousData: createdUser,
      data: generateUserForTesting({
        id: createdUser.id,
        name: 'dummy-user',
        password: 'abd'
      })
    })

    const auditListAfterUpdate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListAfterUpdate.total).toBe(2)

    const thirdAuditEntry = auditListAfterUpdate.data[1]
    expect(thirdAuditEntry.dataId).toBe(createdUser.id)
    expect(thirdAuditEntry.resource).toBe(R_USERS)
    expect(thirdAuditEntry.activityType).toBe(AuditType.EDIT)
    expect(thirdAuditEntry.securityRelated).toBe(true)
  })
})

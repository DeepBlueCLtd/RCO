import {
  withLifecycleCallbacks,
  type DataProvider,
  type AuthProvider
} from 'react-admin'
import { R_AUDIT, R_BATCHES, R_USERS } from '../../../constants'
import { DateTime } from 'luxon'
import localForageDataProvider from 'ra-data-local-forage'
import { lifecycleCallbacks } from '..'
import { trackEvent } from '../../../utils/audit'
import authProvider from '../../authProvider'
import { encryptedUsers } from '../../../utils/init-data'
import { AuditType } from '../../../utils/activity-types'
import {
  type ResourceType,
  clear,
  generateDummyBatchForTesting
} from './dummy-data'

const TEST_STORAGE_KEY = 'rco-test'
const resources: ResourceType[] = [R_AUDIT, R_BATCHES]

describe('CRUD operations on Batch Resource', () => {
  let provider: DataProvider
  let auth: AuthProvider
  beforeAll(async () => {
    const provider = await localForageDataProvider({
      prefixLocalForageKey: TEST_STORAGE_KEY
    })
    for (const user of encryptedUsers) {
      await provider.create<User>(R_USERS, { data: { ...user } })
    }
    auth = authProvider(provider)
    await auth.login({ username: 'ian', password: process.env.PASSWORD })
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
    for (const resource of resources) {
      await clearLists(resource)
    }
  })

  it('should create a batch', async () => {
    const list = await provider.getList<Batch>(R_BATCHES, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(list.total).toBe(0)
    const result = await provider.create<Batch>(R_BATCHES, {
      data: generateDummyBatchForTesting()
    })
    const createId = result.data.id
    expect(createId).toBeDefined()
    const createdBatch = await provider.getOne<Batch>(R_BATCHES, {
      id: createId
    })
    expect(createdBatch).toBeDefined()
    expect(createId).toEqual(createdBatch.data.id)
  })

  it('should update the batch', async () => {
    const createdBatch = await provider.create<Batch>(R_BATCHES, {
      data: generateDummyBatchForTesting()
    })
    const createId = createdBatch.data.id
    await provider.update<Batch>(R_BATCHES, {
      id: createId,
      previousData: createdBatch,
      data: {
        name: 'dummy-batch',
        createdAt: DateTime.now().toFormat('yyyy-MM-dd')
      }
    })
    const shouldMatchBatch = generateDummyBatchForTesting({
      name: 'dummy-batch',
      id: createId
    })
    const updatedBatch = await provider.getOne<Batch>(R_BATCHES, {
      id: createId
    })
    const expectedResult = updatedBatch.data
    expect(expectedResult).toMatchObject(shouldMatchBatch)
  })

  it('should delete the batch', async () => {
    const created = await provider.create<Batch>(R_BATCHES, {
      data: generateDummyBatchForTesting()
    })
    const listBefore = await provider.getList<Batch>(R_BATCHES, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(listBefore.total).toBe(1)
    await expect(
      provider.delete<Batch>(R_BATCHES, { id: created.data.id })
    ).resolves.toBeTruthy()

    const listAfter = await provider.getList<Batch>(R_BATCHES, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(listAfter.total).toBe(0)
  })

  it('should test before update', async () => {
    const beforeUpdateList = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(beforeUpdateList.total).toBe(0)
    const dummyBatch = generateDummyBatchForTesting()
    expect(dummyBatch.id).toBeUndefined()
    const createdBatch = await provider.create<Batch>(R_BATCHES, {
      data: dummyBatch
    })
    expect(createdBatch.data.id).not.toBeUndefined()
    expect(createdBatch.data.createdAt).not.toBeUndefined()
    expect(createdBatch.data.createdBy).not.toBeUndefined()
    const createId = createdBatch.data.id
    const auditListAfterCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(auditListAfterCreate.total).toBe(1)
    const firstAuditEntry = auditListAfterCreate.data[0]
    expect(firstAuditEntry.dataId).toEqual(createId)
    expect(firstAuditEntry.resource).toEqual(R_BATCHES)
    expect(firstAuditEntry.activityType).toEqual(AuditType.CREATE_BATCH)
    await provider.update<Batch>(R_BATCHES, {
      id: createId,
      previousData: createdBatch.data,
      data: {
        name: 'dummy-batch',
        createdAt: DateTime.now().toFormat('yyyy-MM-dd')
      }
    })
    const auditListAfterUpdate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(auditListAfterUpdate.total).toBe(2)
    const secondAuditEntry = auditListAfterUpdate.data[1]
    expect(secondAuditEntry.dataId).toEqual(createId)
    expect(secondAuditEntry.resource).toEqual(R_BATCHES)
    expect(secondAuditEntry.activityType).toEqual(AuditType.EDIT_BATCH)
  })

  it('should test before create', async () => {
    const createdBatch = await provider.create<Batch>(R_BATCHES, {
      data: generateDummyBatchForTesting()
    })
    const createId = createdBatch.data.id

    const fetchedBatch = (
      await provider.getOne<Batch>(R_BATCHES, {
        id: createId
      })
    ).data
    expect(fetchedBatch.createdAt).not.toBeUndefined()
    expect(fetchedBatch.createdBy).not.toBeUndefined()
  })

  it('should test after create', async () => {
    const beforeCreateList = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(beforeCreateList.total).toBe(0)
    const createdBatch = await provider.create<Batch>(R_BATCHES, {
      data: generateDummyBatchForTesting()
    })
    const auditListAfterCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(auditListAfterCreate.total).toBe(1)
    const audit = auditListAfterCreate.data[0]
    expect(audit.activityType).toEqual(AuditType.CREATE_BATCH)
    expect(audit.resource).toEqual(R_BATCHES)
    expect(audit.dataId).toEqual(createdBatch.data.id)
  })
})

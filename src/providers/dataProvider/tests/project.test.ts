import {
  withLifecycleCallbacks,
  type AuthProvider,
  type DataProvider
} from 'react-admin'
import localForageDataProvider from 'ra-data-local-forage'
import authProvider from '../../authProvider'
import { encryptedUsers } from '../../../utils/init-data'
import {
  R_AUDIT,
  R_PROJECTS,
  R_USERS,
  type ResourceTypes
} from '../../../constants'
import { lifecycleCallbacks } from '..'
import { trackEvent } from '../../../utils/audit'
import { clear, generateProjectForTesting } from './dummy-data'
import { AuditType } from '../../../utils/activity-types'

const TEST_STORAGE_KEY = 'rco-test'
const TO_CLEAR: ResourceTypes[] = [R_PROJECTS, R_AUDIT]

describe('CRUD operation on Project Resource', () => {
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
    await auth.login({ username: 'd-1', password: process.env.PASSWORD })
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

  it('should create a project', async () => {
    const projectList = await provider.getList<Project>(R_PROJECTS, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(projectList.total).toBe(0)

    const createdProjectId = (
      await provider.create<Project>(R_PROJECTS, {
        data: generateProjectForTesting()
      })
    ).data.id

    const createdProject = (
      await provider.getOne<Project>(R_PROJECTS, {
        id: createdProjectId
      })
    ).data

    expect(createdProject).toBeDefined()
    expect(createdProjectId).toEqual(createdProject.id)

    const projectListAfterCreation = await provider.getList<Project>(
      R_PROJECTS,
      {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: {}
      }
    )
    expect(projectListAfterCreation.total).toBe(1)
  })

  it('should update the project', async () => {
    const createdProject = await provider.create<Project>(R_PROJECTS, {
      data: generateProjectForTesting()
    })

    const createdId = createdProject.data.id

    await provider.update<Project>(R_PROJECTS, {
      id: createdId,
      previousData: createdProject,
      data: generateProjectForTesting({ name: 'dummy-project-1' })
    })

    const shouldMatchProject = generateProjectForTesting({
      id: createdId,
      name: 'dummy-project-1'
    })

    const expectedResult = (
      await provider.getOne<Project>(R_PROJECTS, {
        id: createdId
      })
    ).data

    expect(expectedResult).toMatchObject(shouldMatchProject)
  })

  it('should delete the project', async () => {
    const createdProject = (
      await provider.create<Project>(R_PROJECTS, {
        data: generateProjectForTesting()
      })
    ).data

    const listBefore = await provider.getList<Project>(R_PROJECTS, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(listBefore.total).toBe(1)

    await expect(
      provider.delete<Item>(R_PROJECTS, { id: createdProject.id })
    ).resolves.toBeTruthy()

    const listAfter = await provider.getList<Project>(R_PROJECTS, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(listAfter.total).toBe(0)
  })

  it('should test before create', async () => {
    const createdId = (
      await provider.create<Project>(R_PROJECTS, {
        data: generateProjectForTesting()
      })
    ).data.id

    const fetchedProject = (
      await provider.getOne<Project>(R_PROJECTS, { id: createdId })
    ).data

    const shouldMatchProject = generateProjectForTesting({
      id: createdId
    })
    expect(fetchedProject).toMatchObject(shouldMatchProject)
    expect(fetchedProject.createdAt).toBeDefined()
    expect(fetchedProject.createdBy).toBeDefined()
  })

  it('should test after create', async () => {
    const auditListBeforeCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListBeforeCreate.total).toBe(0)

    const createdProject = (
      await provider.create<Project>(R_PROJECTS, {
        data: generateProjectForTesting()
      })
    ).data

    expect(createdProject.createdAt).toBeDefined()
    expect(createdProject.id).toBeDefined()
    expect(createdProject.createdBy).toBeDefined()

    const auditListAfterCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListAfterCreate.total).toBe(1)
    const secondAuditEntry = auditListAfterCreate.data[0]
    expect(secondAuditEntry.resource).toBe(R_PROJECTS)
    expect(secondAuditEntry.dataId).toBe(createdProject.id)
    expect(secondAuditEntry.activityType).toBe(AuditType.CREATE)
  })

  it('should test after update', async () => {
    const auditListBeforeCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })
    expect(auditListBeforeCreate.total).toBe(0)

    const createdProject = (
      await provider.create<Project>(R_PROJECTS, {
        data: generateProjectForTesting()
      })
    ).data

    expect(createdProject.createdAt).toBeDefined()
    expect(createdProject.id).toBeDefined()
    expect(createdProject.createdBy).toBeDefined()

    const auditListAfterCreate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListAfterCreate.total).toBe(1)
    const firstAuditEntry = auditListAfterCreate.data[0]
    expect(firstAuditEntry.resource).toBe(R_PROJECTS)
    expect(firstAuditEntry.activityType).toBe(AuditType.CREATE)
    expect(firstAuditEntry.dataId).toBe(createdProject.id)

    await provider.update<Project>(R_PROJECTS, {
      id: createdProject.id,
      previousData: createdProject,
      data: generateProjectForTesting({ name: 'dummy-project-1' })
    })

    const auditListAfterUpdate = await provider.getList<Audit>(R_AUDIT, {
      sort: { field: 'id', order: 'ASC' },
      pagination: { page: 1, perPage: 1000 },
      filter: {}
    })

    expect(auditListAfterUpdate.total).toBe(2)
    const secondAuditEntry = auditListAfterUpdate.data[1]
    expect(secondAuditEntry.dataId).toBe(createdProject.id)
    expect(secondAuditEntry.resource).toBe(R_PROJECTS)
    expect(secondAuditEntry.activityType).toBe(AuditType.EDIT)
  })
})

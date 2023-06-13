import { type DataProvider, type AuthProvider } from 'react-admin'
import {
  R_AUDIT,
  R_DEPARTMENT,
  R_PLATFORMS,
  R_USERS,
  type ResourceTypes
} from '../../../constants'
import { encryptedUsers } from '../../../utils/init-data'
import authProvider from '../../authProvider'
import { generateActiveReferenceItemForTesting } from './dummy-data'
import localForageDataProvider from 'ra-data-local-forage'
import referenceItemTests from './reference-item'
import { common, commonBeforeEach } from './common'

const TEST_STORAGE_KEY = 'rco-test'
const TO_CLEAR: ResourceTypes[] = [R_PLATFORMS, R_AUDIT]

describe('CRUD operation on department', () => {
  let provider: DataProvider
  let auth: AuthProvider
  let checkListAfterCreate: () => Promise<void>,
    checkListBeforeCreate: () => Promise<void>,
    createResource: (
      dummyDataGenerate: typeof generateActiveReferenceItemForTesting,
      resource: ResourceTypes
    ) => Promise<ActiveReferenceItem>

  beforeAll(async () => {
    const provider = await localForageDataProvider({
      prefixLocalForageKey: TEST_STORAGE_KEY
    })
    for (const user of encryptedUsers()) {
      await provider.create<User>(R_USERS, { data: { ...user } })
    }
    auth = authProvider(provider)
    await auth.login({ username: 'ian', password: process.env.PASSWORD })
  })

  beforeEach(async () => {
    provider = await commonBeforeEach(TO_CLEAR)
    const commonChecks = common(provider, R_DEPARTMENT)
    checkListAfterCreate = commonChecks.checkListAfterCreate
    checkListBeforeCreate = commonChecks.checkListBeforeCreate
    createResource = commonChecks.createResource
  })

  it('should create a department', async () => {
    await checkListBeforeCreate()
    await createResource(generateActiveReferenceItemForTesting, R_DEPARTMENT)
    await checkListAfterCreate()
  })

  it('should update the department', async () => {
    const createdDepartment = await createResource(
      generateActiveReferenceItemForTesting,
      R_DEPARTMENT
    )

    await provider.update<ActiveReferenceItem>(R_DEPARTMENT, {
      id: createdDepartment.id,
      previousData: createdDepartment,
      data: {
        id: createdDepartment.id,
        name: 'dummy-department-1',
        active: false
      }
    })

    const fetchedDepartment = (
      await provider.getOne<ActiveReferenceItem>(R_DEPARTMENT, {
        id: createdDepartment.id
      })
    ).data

    const shouldMatchDepartment = generateActiveReferenceItemForTesting(
      'dummy-department-1',
      {
        id: createdDepartment.id,

        active: false
      }
    )
    expect(fetchedDepartment).toMatchObject(shouldMatchDepartment)
  })

  it('should test before create ', async () => {
    await referenceItemTests(
      provider,
      R_DEPARTMENT,
      generateActiveReferenceItemForTesting
    )[0]()
  })

  it('should test before afterUpdate', async () => {
    await referenceItemTests(
      provider,
      R_DEPARTMENT,
      generateActiveReferenceItemForTesting
    )[1]()
  })
})

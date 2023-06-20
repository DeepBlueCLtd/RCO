import { type DataProvider, type AuthProvider } from 'react-admin'
import {
  R_AUDIT,
  R_PLATFORM_ORIGINATOR,
  R_USERS,
  type ResourceTypes
} from '../../../constants'
import localForageDataProvider from 'ra-data-local-forage'
import authProvider from '../../authProvider'
import { encryptedUsers } from '../../../utils/init-data'
import { common, commonBeforeEach } from './common'
import { generateActiveReferenceItemForTesting } from './dummy-data'
import referenceItemTests from './reference-item'

const TEST_STORAGE_KEY = 'rco-test'
const TO_CLEAR: ResourceTypes[] = [R_AUDIT, R_PLATFORM_ORIGINATOR]

describe('CRUD operation on Platform Originator Resource', () => {
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
    const commonChecks = common(provider, R_PLATFORM_ORIGINATOR)
    ;({ checkListAfterCreate, checkListBeforeCreate, createResource } =
      commonChecks)
  })

  it('should create a platform originator', async () => {
    await checkListBeforeCreate()
    await createResource(
      generateActiveReferenceItemForTesting,
      R_PLATFORM_ORIGINATOR
    )
    await checkListAfterCreate()
  })

  it('should update the platform originator', async () => {
    const createdPlatformOriginator = await createResource(
      generateActiveReferenceItemForTesting,
      R_PLATFORM_ORIGINATOR
    )

    await provider.update<ActiveReferenceItem>(R_PLATFORM_ORIGINATOR, {
      id: createdPlatformOriginator.id,
      previousData: createdPlatformOriginator,
      data: {
        id: createdPlatformOriginator.id,
        name: 'dummy-platform-originator-1',
        active: false
      }
    })

    const fetchedPlatformOriginator = (
      await provider.getOne<ActiveReferenceItem>(R_PLATFORM_ORIGINATOR, {
        id: createdPlatformOriginator.id
      })
    ).data

    const shouldMatchPlatformOriginator = generateActiveReferenceItemForTesting(
      'dummy-platform-originator-1',
      {
        id: createdPlatformOriginator.id,
        active: false
      }
    )
    expect(fetchedPlatformOriginator).toMatchObject(
      shouldMatchPlatformOriginator
    )
  })

  it('should test before create ', async () => {
    await referenceItemTests(
      provider,
      R_PLATFORM_ORIGINATOR,
      generateActiveReferenceItemForTesting
    )[0]()
  })

  it('should test before Update', async () => {
    await referenceItemTests(
      provider,
      R_PLATFORM_ORIGINATOR,
      generateActiveReferenceItemForTesting
    )[1]()
  })
})

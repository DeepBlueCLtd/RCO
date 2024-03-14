import { type DataProvider, type AuthProvider } from 'react-admin'
import {
  R_AUDIT,
  R_PROTECTIVE_MARKING,
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
const TO_CLEAR: ResourceTypes[] = [R_AUDIT, R_PROTECTIVE_MARKING]

describe('CRUD operation on Media Type Resource', () => {
  let provider: DataProvider
  let auth: AuthProvider
  let checkListAfterCreate: () => Promise<void>,
    checkListBeforeCreate: () => Promise<void>,
    createResource: (
      dummyDataGenerate: typeof generateActiveReferenceItemForTesting,
      resource: ResourceTypes
    ) => Promise<IntegerReferenceItem>

  beforeAll(async () => {
    const provider = await localForageDataProvider({
      prefixLocalForageKey: TEST_STORAGE_KEY
    })
    for (const user of encryptedUsers()) {
      await provider.create<User>(R_USERS, { data: { ...user } })
    }
    auth = authProvider(provider)
    await auth.login({ username: 'd-1', password: process.env.PASSWORD })
  })

  beforeEach(async () => {
    provider = await commonBeforeEach(TO_CLEAR)
    const commonChecks = common(provider, R_PROTECTIVE_MARKING)
    ;({ checkListAfterCreate, checkListBeforeCreate, createResource } =
      commonChecks)
  })

  it('should create a protective marking', async () => {
    await checkListBeforeCreate()
    await createResource(
      generateActiveReferenceItemForTesting,
      R_PROTECTIVE_MARKING
    )
    await checkListAfterCreate()
  })

  it('should update the protective marking', async () => {
    const createdProtectiveMarking = await createResource(
      generateActiveReferenceItemForTesting,
      R_PROTECTIVE_MARKING
    )

    await provider.update<IntegerReferenceItem>(R_PROTECTIVE_MARKING, {
      id: createdProtectiveMarking.id,
      previousData: createdProtectiveMarking,
      data: {
        id: createdProtectiveMarking.id,
        name: 'dummy-protective-marking-1',
        active: false
      }
    })

    const fetchedProtectiveMarking = (
      await provider.getOne<IntegerReferenceItem>(R_PROTECTIVE_MARKING, {
        id: createdProtectiveMarking.id
      })
    ).data

    const shouldMatchProtectiveMarking = generateActiveReferenceItemForTesting(
      'dummy-protective-marking-1',
      {
        id: createdProtectiveMarking.id,
        active: false
      }
    )
    expect(fetchedProtectiveMarking).toMatchObject(shouldMatchProtectiveMarking)
  })

  it('should test before create ', async () => {
    await referenceItemTests(
      provider,
      R_PROTECTIVE_MARKING,
      generateActiveReferenceItemForTesting
    )[0]()
  })

  it('should test before Update', async () => {
    await referenceItemTests(
      provider,
      R_PROTECTIVE_MARKING,
      generateActiveReferenceItemForTesting
    )[1]()
  })
})

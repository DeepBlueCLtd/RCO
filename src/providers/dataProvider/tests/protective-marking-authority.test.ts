import { type DataProvider, type AuthProvider } from 'react-admin'
import {
  R_AUDIT,
  R_PROTECTIVE_MARKING_AUTHORITY,
  R_USERS,
  type ResourceTypes
} from '../../../constants'
import localForageDataProvider from 'ra-data-local-forage'
import authProvider from '../../authProvider'
import { encryptedUsers } from '../../../utils/init-data'
import { common, commonBeforeEach } from './common'
import referenceItemTests from './reference-item'
import { generateActiveReferenceItemForTesting } from './dummy-data'

const TEST_STORAGE_KEY = 'rco-test'
const TO_CLEAR: ResourceTypes[] = [R_AUDIT, R_PROTECTIVE_MARKING_AUTHORITY]

describe('CRUD operation on Protective Marking Authority Resource', () => {
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
    for (const user of encryptedUsers) {
      await provider.create<User>(R_USERS, { data: { ...user } })
    }
    auth = authProvider(provider)
    await auth.login({ username: 'ian', password: process.env.PASSWORD })
  })

  beforeEach(async () => {
    provider = await commonBeforeEach(TO_CLEAR)
    const commonChecks = common(provider, R_PROTECTIVE_MARKING_AUTHORITY)
    checkListAfterCreate = commonChecks.checkListAfterCreate
    checkListBeforeCreate = commonChecks.checkListBeforeCreate
    createResource = commonChecks.createResource
  })

  it('should create a protective marking authority', async () => {
    await checkListBeforeCreate()
    await createResource(
      generateActiveReferenceItemForTesting,
      R_PROTECTIVE_MARKING_AUTHORITY
    )
    await checkListAfterCreate()
  })

  it('should update the protective marking authority', async () => {
    const createdPMA = await createResource(
      generateActiveReferenceItemForTesting,
      R_PROTECTIVE_MARKING_AUTHORITY
    )

    await provider.update<ActiveReferenceItem>(R_PROTECTIVE_MARKING_AUTHORITY, {
      id: createdPMA.id,
      previousData: createdPMA,
      data: {
        id: createdPMA.id,
        name: 'dummy-pma-1',
        active: false
      }
    })

    const fetchedPMA = (
      await provider.getOne<ActiveReferenceItem>(
        R_PROTECTIVE_MARKING_AUTHORITY,
        {
          id: createdPMA.id
        }
      )
    ).data

    const shouldMatchPMA = generateActiveReferenceItemForTesting(
      'dummy-pma-1',
      {
        id: createdPMA.id,
        active: false
      }
    )
    expect(fetchedPMA).toMatchObject(shouldMatchPMA)
  })

  it('should test before create ', async () => {
    await referenceItemTests(
      provider,
      R_PROTECTIVE_MARKING_AUTHORITY,
      generateActiveReferenceItemForTesting
    )[0]()
  })

  it('should test before Update', async () => {
    await referenceItemTests(
      provider,
      R_PROTECTIVE_MARKING_AUTHORITY,
      generateActiveReferenceItemForTesting
    )[1]()
  })
})

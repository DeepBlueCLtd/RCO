import { type DataProvider, type AuthProvider } from 'react-admin'
import {
  R_AUDIT,
  R_ORGANISATION,
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
const TO_CLEAR: ResourceTypes[] = [R_AUDIT, R_ORGANISATION]

describe('CRUD operation on Organisation Resource', () => {
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
    await auth.login({ staffNumber: 'd-1', password: process.env.PASSWORD })
  })

  beforeEach(async () => {
    provider = await commonBeforeEach(TO_CLEAR)
    const commonChecks = common(provider, R_ORGANISATION)
    ;({ checkListAfterCreate, checkListBeforeCreate, createResource } =
      commonChecks)
  })

  it('should create a organisation', async () => {
    await checkListBeforeCreate()
    await createResource(generateActiveReferenceItemForTesting, R_ORGANISATION)
    await checkListAfterCreate()
  })

  it('should update the organisation', async () => {
    const createdOrganisation = await createResource(
      generateActiveReferenceItemForTesting,
      R_ORGANISATION
    )

    await provider.update<IntegerReferenceItem>(R_ORGANISATION, {
      id: createdOrganisation.id,
      previousData: createdOrganisation,
      data: {
        id: createdOrganisation.id,
        name: 'dummy-organisation-1',
        active: false
      }
    })

    const fetchedOrganisation = (
      await provider.getOne<IntegerReferenceItem>(R_ORGANISATION, {
        id: createdOrganisation.id
      })
    ).data

    const shouldMatchOrganisation = generateActiveReferenceItemForTesting(
      'dummy-organisation-1',
      {
        id: createdOrganisation.id,
        active: false
      }
    )
    expect(fetchedOrganisation).toMatchObject(shouldMatchOrganisation)
  })

  it('should test before create ', async () => {
    await referenceItemTests(
      provider,
      R_ORGANISATION,
      generateActiveReferenceItemForTesting
    )[0]()
  })

  it('should test before Update', async () => {
    await referenceItemTests(
      provider,
      R_ORGANISATION,
      generateActiveReferenceItemForTesting
    )[1]()
  })
})

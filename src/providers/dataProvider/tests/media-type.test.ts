import { type DataProvider, type AuthProvider } from 'react-admin'
import {
  R_AUDIT,
  R_MEDIA_TYPE,
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
const TO_CLEAR: ResourceTypes[] = [R_AUDIT, R_MEDIA_TYPE]

describe('CRUD operation on Media Type Resource', () => {
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
    const commonChecks = common(provider, R_MEDIA_TYPE)
    ;({ checkListAfterCreate, checkListBeforeCreate, createResource } =
      commonChecks)
  })

  it('should create a media type', async () => {
    await checkListBeforeCreate()
    await createResource(generateActiveReferenceItemForTesting, R_MEDIA_TYPE)
    await checkListAfterCreate()
  })

  it('should update the media type', async () => {
    const createdMediaType = await createResource(
      generateActiveReferenceItemForTesting,
      R_MEDIA_TYPE
    )

    await provider.update<ActiveReferenceItem>(R_MEDIA_TYPE, {
      id: createdMediaType.id,
      previousData: createdMediaType,
      data: {
        id: createdMediaType.id,
        name: 'dummy-media-type-1',
        active: false
      }
    })

    const fetchedMediaType = (
      await provider.getOne<ActiveReferenceItem>(R_MEDIA_TYPE, {
        id: createdMediaType.id
      })
    ).data

    const shouldMatchMediaType = generateActiveReferenceItemForTesting(
      'dummy-media-type-1',
      {
        id: createdMediaType.id,
        active: false
      }
    )
    expect(fetchedMediaType).toMatchObject(shouldMatchMediaType)
  })

  it('should test before create ', async () => {
    await referenceItemTests(
      provider,
      R_MEDIA_TYPE,
      generateActiveReferenceItemForTesting
    )[0]()
  })

  it('should test before Update', async () => {
    await referenceItemTests(
      provider,
      R_MEDIA_TYPE,
      generateActiveReferenceItemForTesting
    )[1]()
  })
})

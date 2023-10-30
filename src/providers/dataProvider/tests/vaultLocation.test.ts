import {
  type AuthProvider,
  type DataProvider,
  withLifecycleCallbacks
} from 'react-admin'
import { lifecycleCallbacks } from '..'
import {
  type ResourceTypes,
  R_AUDIT,
  R_USERS,
  R_VAULT_LOCATION
} from '../../../constants'
import { trackEvent } from '../../../utils/audit'
import { encryptedUsers } from '../../../utils/init-data'
import authProvider from '../../authProvider'
import { clear, generateVaultLocationForTesting } from './dummy-data'
import localForageDataProvider from 'ra-data-local-forage'

const TEST_STORAGE_KEY = 'rco-test'
const TO_CLEAR: ResourceTypes[] = [R_USERS, R_AUDIT, R_VAULT_LOCATION]

describe('CRUD operations vault location', () => {
  let provider: DataProvider
  let auth: AuthProvider

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

  it('should create vault location', async () => {
    const vaultLocationListBeforeCreate =
      await provider.getList<IntegerReferenceItem>(R_VAULT_LOCATION, {
        sort: { field: 'id', order: 'ASC' },
        pagination: { page: 1, perPage: 1000 },
        filter: {}
      })

    expect(vaultLocationListBeforeCreate.total).toBe(0)

    const createdVault = (
      await provider.create<IntegerReferenceItem>(R_VAULT_LOCATION, {
        data: generateVaultLocationForTesting()
      })
    ).data

    expect(createdVault.id).toBeDefined()
    expect(createdVault).not.toBeUndefined()
  })

  it('should update vault location', async () => {
    const createdVault = (
      await provider.create<IntegerReferenceItem>(R_VAULT_LOCATION, {
        data: generateVaultLocationForTesting()
      })
    ).data

    expect(createdVault).not.toBeUndefined()
    expect(createdVault.id).toBeDefined()

    await provider.update<IntegerReferenceItem>(R_VAULT_LOCATION, {
      id: createdVault.id,
      previousData: createdVault,
      data: { id: createdVault.id, name: 'dummy-vault-1', active: false }
    })

    const fetchedVault = (
      await provider.getOne<IntegerReferenceItem>(R_VAULT_LOCATION, {
        id: createdVault.id
      })
    ).data

    const shouldMatchVault = generateVaultLocationForTesting({
      id: createdVault.id,
      name: 'dummy-vault-1',
      active: false
    })
    expect(fetchedVault).toMatchObject(shouldMatchVault)
  })
})

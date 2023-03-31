import localForageDataProvider from 'ra-data-local-forage'
import {
  withLifecycleCallbacks,
  type DeleteResult,
  type CreateResult,
  type UpdateResult,
  type DataProvider
} from 'react-admin'
import constants from '../../constants'
import { AuditType, trackEvent } from '../../utils/audit'
import platforms from './platforms'
import users from './users'
import { getReferenceData } from './reference-data'
import localForage from 'localforage'
import { encryptData, generateSalt } from '../../utils/ecnryption'

export const getDataProvider = async (): Promise<DataProvider<string>> => {
  const defaultData: Record<string, any> = {
    platforms,
    organisation: getReferenceData('Organisation'),
    department: getReferenceData('Department'),
    vault: getReferenceData('Vault'),
    'protective-marking': getReferenceData('Protective Marking'),
    'protective-marking-authority': getReferenceData(
      'Protective Marking Authority'
    ),
    'platform-originator': getReferenceData('Platform Originator')
  }

  const provider = await localForageDataProvider({
    prefixLocalForageKey: constants.LOCAL_STORAGE_DB_KEY,
    defaultData
  })

  const encryptedUsers = users.map((user) => {
    const salt = generateSalt()
    const updatedUser = {
      ...user,
      salt,
      password: encryptData(`${user.password}${salt}`)
    }
    return updatedUser
  })
  await localForage.setItem(
    `${constants.LOCAL_STORAGE_DB_KEY}users`,
    encryptedUsers
  )
  // in the localForage, the data doesn't get pushed to
  // indexedDB until it's modified. But, that means the app
  // loses the default values on restart (since the database
  // doesn't have ALL of the tables).  So, push the data to localForage
  await Promise.all(
    Object.keys(defaultData).map(async (key) => {
      const values = defaultData[key]
      await localForage.setItem(
        `${constants.LOCAL_STORAGE_DB_KEY}${key}`,
        values
      )
    })
  )
  const providerWithCustomMethods = { ...provider }
  const audit = trackEvent(providerWithCustomMethods)
  return withLifecycleCallbacks(providerWithCustomMethods, [
    {
      resource: 'users',
      afterDelete: async (record: DeleteResult<User>) => {
        await audit(AuditType.DELETE_USER, `User deleted (${record.data.id})`)
        return record
      },
      afterCreate: async (record: CreateResult<User>) => {
        await audit(AuditType.CREATE_USER, `User created (${record.data.id})`)
        return record
      },
      afterUpdate: async (record: UpdateResult<User>) => {
        await audit(AuditType.EDIT_USER, `User updated (${record.data.id})`)
        return record
      }
    },
    {
      resource: 'projects',
      afterDelete: async (record: DeleteResult<Project>) => {
        await audit(
          AuditType.DELETE_PROJECT,
          `Project deleted (${String(record.data.id)})`
        )
        return record
      },
      afterCreate: async (record: CreateResult<Project>) => {
        await audit(
          AuditType.CREATE_PROJECT,
          `Project created (${String(record.data.id)})`
        )
        return record
      },
      afterUpdate: async (record: UpdateResult<Project>) => {
        await audit(
          AuditType.EDIT_PROJECT,
          `Project updated (${String(record.data.id)})`
        )
        return record
      }
    }
  ])
}

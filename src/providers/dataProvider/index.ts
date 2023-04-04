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
import { encryptData, generateSalt } from '../../utils/encryption'

export const getDataProvider = async (): Promise<DataProvider<string>> => {
  const defaultData: Record<string, any> = {
    platforms,
    organisation: getReferenceData('Organisation'),
    department: getReferenceData('Department'),
    'vault-location': getReferenceData('Vault Location'),
    'media-type': getReferenceData('Media'),
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
    const salt: string = generateSalt()
    const userPassword: string = user.password
    const updatedUser = {
      ...user,
      salt,
      password: encryptData(`${userPassword}${salt}`)
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
    },
    {
      resource: 'batches',
      afterCreate: async (
        record: CreateResult<Batch>,
        dataProvider: DataProvider
      ) => {
        try {
          const { data } = record
          const { id, year_of_receipt: year } = data
          const yearVal: string = year
          const idCtr: number = id
          const idVal: string = (idCtr + 1).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
          })
          const batchNumber = `V${idVal}/${yearVal}`

          await dataProvider.update<Batch>('batches', {
            id,
            previousData: data,
            data: { batch_number: batchNumber }
          })
          await audit(AuditType.CREATE_BATCH, `Batch created (${String(id)})`)
          return record
        } catch (error) {
          console.log({ error })
          return record
        }
      },
      afterUpdate: async (record: UpdateResult<Batch>) => {
        await audit(
          AuditType.EDIT_BATCH,
          `Batch updated (${String(record.data.id)})`
        )
        return record
      },
      afterDelete: async (record: DeleteResult<Batch>) => {
        await audit(
          AuditType.DELETE_BATCH,
          `Batch deleted (${String(record.data.id)})`
        )
        return record
      }
    },
    {
      resource: 'items',
      afterCreate: async (
        record: CreateResult<Item>,
        dataProvider: DataProvider
      ) => {
        try {
          const { data } = record
          const { batch_id: batchId, id } = data
          const { data: batch } = await dataProvider.getOne<Batch>('batches', {
            id: batchId
          })
          const idCtr: number = id
          const idVal: string = (idCtr + 1).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
          })
          const itemNumber = `${batch.batch_number}/${idVal}`

          await dataProvider.update<Item>('items', {
            id,
            previousData: data,
            data: { item_number: itemNumber }
          })
          await audit(AuditType.CREATE_ITEM, `Item created (${String(id)})`)
          return record
        } catch (error) {
          console.log({ error })
          return record
        }
      },
      afterUpdate: async (record: UpdateResult<Item>) => {
        await audit(
          AuditType.EDIT_ITEM,
          `Item updated (${String(record.data.id)})`
        )
        return record
      },
      afterDelete: async (record: DeleteResult<Item>) => {
        await audit(
          AuditType.DELETE_ITEM,
          `Item deleted (${String(record.data.id)})`
        )
        return record
      }
    }
  ])
}

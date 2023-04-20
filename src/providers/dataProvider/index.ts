import localForageDataProvider from 'ra-data-local-forage'
import {
  withLifecycleCallbacks,
  type DeleteResult,
  type CreateResult,
  type UpdateResult,
  type DataProvider,
  type UpdateParams
} from 'react-admin'
import * as constants from '../../constants'
import { AuditType, trackEvent } from '../../utils/audit'
import { DateTime } from 'luxon'
import '../../types.d'
import { isNumber } from '../../utils/number'
import localForage from 'localforage'
import loadDefaultData from '../../utils/init-data'

export const nowDate = (): string => {
  return DateTime.now().toFormat('yyyy-MM-dd')
}

const compareVersions = (v1: string, v2: string): number => {
  const s1 = parseInt(v1.substring(1))
  const s2 = parseInt(v2.substring(1))
  if (s1 < s2) {
    return -1
  } else if (s1 > s2) {
    return 1
  } else {
    return 0
  }
}

export const generateBatchId = async (
  provider: DataProvider,
  year: string
): Promise<string> => {
  if (!isNumber(year)) throw new TypeError('Year invalid')
  const batches = await provider.getList(constants.R_BATCHES, {
    sort: { field: 'id', order: 'ASC' },
    pagination: { page: 1, perPage: 1000 },
    filter: { yearOfReceipt: year }
  })

  if (batches.data.length === 0) {
    return '00'
  }

  const greatestBatch = batches.data.reduce((prev, current) =>
    compareVersions(prev.batchNumber, current.batchNumber) === -1
      ? current
      : prev
  )

  return (parseInt(greatestBatch.batchNumber.substring(1)) + 1).toLocaleString(
    'en-US',
    {
      minimumIntegerDigits: 2,
      useGrouping: false
    }
  )
}

export const getDataProvider = async (): Promise<DataProvider<string>> => {
  const provider = await localForageDataProvider({
    loggingEnabled: true,
    prefixLocalForageKey: constants.LOCAL_STORAGE_DB_KEY
  })

  const localForageData = await localForage.keys()
  if (localForageData.length === 0) {
    await loadDefaultData()
  }

  const providerWithCustomMethods = { ...provider }
  const audit = trackEvent(providerWithCustomMethods)

  return withLifecycleCallbacks(providerWithCustomMethods, [
    {
      resource: constants.R_USERS,
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
      resource: constants.R_PROJECTS,
      afterDelete: async (record: DeleteResult<Project>) => {
        await audit(
          AuditType.DELETE_PROJECT,
          `Project deleted (${String(record.data.id)})`
        )
        return record
      },
      afterCreate: async (
        record: CreateResult<Project>,
        dataProvider: DataProvider
      ) => {
        const { data } = record
        const { id } = data
        await audit(
          AuditType.CREATE_PROJECT,
          `Project created (${String(record.data.id)})`
        )
        await dataProvider.update<Project>(constants.R_PROJECTS, {
          id,
          previousData: data,
          data: { createdAt: nowDate() }
        })
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
      resource: constants.R_BATCHES,
      beforeUpdate: async (record: UpdateParams<Batch>) => {
        await audit(
          AuditType.EDIT_BATCH,
          `Batch updated (${String(record.data.id)})`,
          record.previousData.maximumProtectiveMarking !==
            record.data.maximumProtectiveMarking
        )
        return record
      },
      afterCreate: async (
        record: CreateResult<Batch>,
        dataProvider: DataProvider
      ) => {
        try {
          const { data } = record
          const { id, yearOfReceipt: year } = data
          const yearVal: string = year
          const idVal: string = await generateBatchId(provider, year)
          const batchNumber = `V${idVal}/${yearVal}`
          await dataProvider.update<Batch>(constants.R_BATCHES, {
            id,
            previousData: data,
            data: {
              batchNumber,
              createdAt: nowDate()
            }
          })
          await audit(AuditType.CREATE_BATCH, `Batch created (${String(id)})`)
          return record
        } catch (error) {
          console.log({ error })
          return record
        }
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
      resource: constants.R_ITEMS,
      beforeUpdate: async (record: UpdateParams<Item>) => {
        await audit(
          AuditType.EDIT_ITEM,
          `Item updated (${String(record.data.id)})`,
          record.previousData.protectiveMarking !==
            record.data.protectiveMarking
        )
        return record
      },
      afterCreate: async (
        record: CreateResult<Item>,
        dataProvider: DataProvider
      ) => {
        try {
          const { data } = record
          const { batchId, id } = data
          const { data: batch } = await dataProvider.getOne<Batch>(
            constants.R_BATCHES,
            {
              id: batchId
            }
          )
          const idCtr: number = id
          const idVal: string = (idCtr + 1).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
          })
          const batchNumber: string = batch.batchNumber
          const itemNumber = `${batchNumber}/${idVal}`

          await dataProvider.update<Item>(constants.R_ITEMS, {
            id,
            previousData: data,
            data: {
              item_number: itemNumber,
              createdAt: nowDate()
            }
          })
          await audit(AuditType.CREATE_ITEM, `Item created (${String(id)})`)
          return record
        } catch (error) {
          console.log({ error })
          return record
        }
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

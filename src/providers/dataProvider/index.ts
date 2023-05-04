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
import { trackEvent } from '../../utils/audit'
import { AuditType } from '../../utils/activity-types'
import { DateTime } from 'luxon'
import '../../types.d'
import { isNumber } from '../../utils/number'
import localForage from 'localforage'
import loadDefaultData from '../../utils/init-data'
import { getUser } from '../authProvider'

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

  if (batches.data.length === 1) {
    return '01'
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

const withCreatedBy = (
  record: CreateResult<Item | Batch | Project>
): CreateResult<Batch | Project | Item> => {
  const user = getUser()
  if (user !== undefined) {
    record.data.createdBy = user.id
  }
  return record
}

const customMethods = (provider: DataProvider): CustomDataProvider => {
  return {
    loanItems: async (
      items: Array<Item['id']>,
      recipient: User['id'],
      loan: Loan['id']
    ) => {
      const promisees = items.map(async (item) => {
        const data: Partial<LoanItem> = {
          receivedBy: recipient,
          loan,
          item,
          createdAt: nowDate()
        }
        await provider.create<LoanItem>(constants.R_LOAN_ITEMS, {
          data
        })
      })
      await Promise.all(promisees)
    },
    returnItems: async (items: Array<Item['id']>) => {
      const data: Partial<LoanItem> = {
        returnedDate: DateTime.now().toFormat(constants.DATE_FORMAT)
      }
      await provider.updateMany<LoanItem>(constants.R_LOAN_ITEMS, {
        ids: items,
        data
      })
    }
  }
}

export const getDataProvider = async (
  loggingEnabled: boolean
): Promise<DataProvider<string>> => {
  const localForageData = await localForage.keys()
  if (localForageData.length === 0) {
    await loadDefaultData()
  }

  const provider = await localForageDataProvider({
    prefixLocalForageKey: constants.LOCAL_STORAGE_DB_KEY,
    loggingEnabled
  })

  const providerWithCustomMethods = { ...provider, ...customMethods(provider) }
  const audit = trackEvent(providerWithCustomMethods)

  return withLifecycleCallbacks(providerWithCustomMethods, [
    {
      resource: constants.R_USERS,
      afterDelete: async (record: DeleteResult<User>) => {
        await audit({
          type: AuditType.DELETE_USER,
          activityDetail: `User deleted (${record.data.id})`,
          resource: constants.R_USERS,
          id: record.data.id
        })
        return record
      },
      afterCreate: async (record: CreateResult<User>) => {
        await audit({
          type: AuditType.CREATE_USER,
          activityDetail: `User created (${record.data.id})`,
          resource: constants.R_USERS,
          id: record.data.id
        })
        return record
      },
      afterUpdate: async (record: UpdateResult<User>) => {
        await audit({
          type: AuditType.EDIT_USER,
          activityDetail: `User updated (${record.data.id})`,
          resource: constants.R_USERS,
          id: record.data.id
        })
        return record
      }
    },
    {
      resource: constants.R_PROJECTS,
      beforeCreate: async (record: CreateResult<Project>) => {
        return withCreatedBy(record)
      },
      afterDelete: async (record: DeleteResult<Project>) => {
        await audit({
          type: AuditType.DELETE_PROJECT,
          activityDetail: `Project deleted (${String(record.data.id)})`,
          resource: constants.R_PROJECTS,
          id: record.data.id
        })
        return record
      },
      afterCreate: async (
        record: CreateResult<Project>,
        dataProvider: DataProvider
      ) => {
        const { data } = record
        const { id } = data
        await audit({
          type: AuditType.CREATE_PROJECT,
          activityDetail: `Project created (${String(record.data.id)})`,
          resource: constants.R_PROJECTS,
          id: record.data.id
        })
        await dataProvider.update<Project>(constants.R_PROJECTS, {
          id,
          previousData: data,
          data: { createdAt: nowDate() }
        })
        return record
      },
      afterUpdate: async (record: UpdateResult<Project>) => {
        await audit({
          type: AuditType.EDIT_PROJECT,
          activityDetail: `Project updated (${String(record.data.id)})`,
          resource: constants.R_PROJECTS,
          id: record.data.id
        })
        return record
      }
    },
    {
      resource: constants.R_BATCHES,
      beforeUpdate: async (record: UpdateParams<Batch>) => {
        await audit({
          type: AuditType.EDIT_BATCH,
          activityDetail: `Batch updated (${String(record.data.id)})`,
          securityRelated:
            record.previousData.maximumProtectiveMarking !==
            record.data.maximumProtectiveMarking,
          resource: constants.R_BATCHES,
          id: record.previousData.id
        })
        return record
      },
      beforeCreate: async (record: CreateResult<Batch>) => {
        return withCreatedBy(record)
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
          await audit({
            type: AuditType.CREATE_BATCH,
            activityDetail: `Batch created (${String(id)})`,
            resource: constants.R_BATCHES,
            id: record.data.id
          })
          return record
        } catch (error) {
          console.log({ error })
          return record
        }
      },
      afterDelete: async (record: DeleteResult<Batch>) => {
        await audit({
          type: AuditType.DELETE_BATCH,
          activityDetail: `Batch deleted (${String(record.data.id)})`,
          resource: constants.R_BATCHES,
          id: record.data.id
        })
        return record
      }
    },
    {
      resource: constants.R_ITEMS,
      beforeCreate: async (record: CreateResult<Item>) => {
        return withCreatedBy(record)
      },
      beforeUpdate: async (record: UpdateParams<Item>) => {
        await audit({
          type: AuditType.EDIT_ITEM,
          activityDetail: `Item updated (${String(record.data.id)})`,
          securityRelated:
            record.previousData.protectiveMarking !==
            record.data.protectiveMarking,
          resource: constants.R_ITEMS,
          id: record.previousData.id
        })
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
          await audit({
            type: AuditType.CREATE_ITEM,
            activityDetail: `Item created (${String(id)})`,
            resource: constants.R_ITEMS,
            id
          })
          return record
        } catch (error) {
          console.log({ error })
          return record
        }
      },
      afterDelete: async (record: DeleteResult<Item>) => {
        await audit({
          type: AuditType.DELETE_ITEM,
          activityDetail: `Item deleted (${String(record.data.id)})`,
          resource: constants.R_ITEMS,
          id: record.data.id
        })
        return record
      }
    },
    {
      resource: constants.R_LOANS,
      beforeCreate: async (record: CreateResult<Project>) => {
        return withCreatedBy(record)
      },
      afterDelete: async (record: DeleteResult<Loan>) => {
        await audit({
          type: AuditType.DELETE_LOAN,
          activityDetail: `Loan deleted (${String(record.data.id)})`,
          resource: constants.R_LOANS,
          id: record.data.id
        })
        return record
      },
      afterUpdate: async (record: UpdateResult<Loan>) => {
        await audit({
          type: AuditType.EDIT_LOAN,
          activityDetail: `Loan updated (${String(record.data.id)})`,
          resource: constants.R_LOANS,
          id: record.data.id
        })
        return record
      },
      afterCreate: async (record: CreateResult<Loan>) => {
        await audit({
          type: AuditType.CREATE_LOAN,
          activityDetail: `Loan created (${String(record.data.id)})`,
          resource: constants.R_LOANS,
          id: record.data.id
        })
        return record
      }
    },
    {
      resource: constants.R_LOAN_ITEMS,
      afterDelete: async (record: DeleteResult<LoanItem>) => {
        await audit({
          type: AuditType.DELETE_LOAN_ITEM,
          activityDetail: `Loan Item deleted (${String(record.data.id)})`,
          resource: constants.R_LOAN_ITEMS,
          id: record.data.id
        })
        return record
      },
      afterUpdate: async (record: UpdateResult<LoanItem>) => {
        await audit({
          type: AuditType.EDIT_LOAN_ITEM,
          activityDetail: `Loan Item updated (${String(record.data.id)})`,
          resource: constants.R_LOAN_ITEMS,
          id: record.data.id
        })
        return record
      },
      afterCreate: async (record: CreateResult<LoanItem>) => {
        await audit({
          type: AuditType.CREATE_LOAN_ITEM,
          activityDetail: `Loan Item created (${String(record.data.id)})`,
          resource: constants.R_LOAN_ITEMS,
          id: record.data.id
        })
        return record
      }
    }
  ])
}

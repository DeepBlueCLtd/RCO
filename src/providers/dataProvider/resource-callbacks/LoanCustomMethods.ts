import { type DataProvider } from 'ra-core'
import { trackEvent } from '../../../utils/audit'
import { nowDate } from '../dataprovider-utils'
import { R_ITEMS, R_USERS } from '../../../constants'
import { AuditType } from '../../../utils/activity-types'

export const customMethods = (
  provider: DataProvider
): Omit<CustomDataProvider, 'getConfigData'> => {
  const audit = trackEvent(provider)

  return {
    loanItems: async (items: Array<Item['id']>, holder: number) => {
      await provider.updateMany<Item>(R_ITEMS, {
        ids: items,
        data: {
          loanedTo: holder,
          loanedDate: nowDate()
        }
      })

      const {
        data: { id }
      } = await provider.getOne<User>(R_USERS, {
        id: holder
      })

      const promisees = items.map(async (item) => {
        await audit({
          activityType: AuditType.LOAN,
          activityDetail: 'Item loaned',
          resource: R_ITEMS,
          dataId: item,
          subjectId: id,
          subjectResource: R_USERS,
          securityRelated: null
        })
      })
      await Promise.all(promisees)
    },
    returnItems: async (items: Array<Item['id']>) => {
      const userById: Record<number, User> = {}
      const { data: itemsData } = await provider.getMany<Item>(R_ITEMS, {
        ids: items
      })
      const usersIds = itemsData.map((item) => item.loanedTo) as number[]
      const { data: usersData } = await provider.getMany<User>(R_USERS, {
        ids: usersIds
      })

      usersData.forEach((user) => {
        userById[user.id] = user
      })

      const promisees = itemsData.map(async (item) => {
        const { loanedTo, id } = item

        if (loanedTo) {
          await audit({
            dataId: id,
            activityType: AuditType.RETURN,
            activityDetail: 'Item returned',
            resource: R_ITEMS,
            subjectId: loanedTo,
            subjectResource: R_USERS,
            securityRelated: null
          })
        }
      })
      await provider.updateMany(R_ITEMS, {
        ids: items,
        data: {
          loanedTo: null,
          loanedDate: null
        }
      })

      await Promise.all(promisees)
    }
  }
}

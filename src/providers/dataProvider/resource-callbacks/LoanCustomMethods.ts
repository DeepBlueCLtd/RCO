import { type DataProvider } from 'ra-core'
import { trackEvent } from '../../../utils/audit'
import { nowDate } from '../dataprovider-utils'
import { R_ITEMS, R_LOAN_USERS, R_USERS } from '../../../constants'
import { AuditType } from '../../../utils/activity-types'

export const customMethods = (
  provider: DataProvider
): Omit<CustomDataProvider, 'getConfigData'> => {
  const audit = trackEvent(provider)

  return {
    loanItems: async function (
      this: DataProvider,
      items: Array<Item['id']>,
      holder: number
    ) {
      await this.updateMany<Item>(R_ITEMS, {
        ids: items,
        data: {
          loanedTo: holder,
          loanedDate: nowDate()
        }
      })

      const {
        data: { id, username }
      } = await this.getOne<User>(R_USERS, {
        id: holder
      })

      if (process.env.MOCK) {
        const { data } = await this.getMany<LoanUser>(R_LOAN_USERS, {
          ids: [holder]
        })
        if (data.length) {
          await this.update<LoanUser>(R_LOAN_USERS, {
            id: holder,
            data: { numItems: data[0].numItems + items.length },
            previousData: data
          })
        } else {
          await this.create<LoanUser>(R_LOAN_USERS, {
            data: { id: holder, numItems: items.length, username }
          })
        }
      }

      const promisees = items.map(async (item) => {
        // TODO: TAHA - we should also include an audit for the `R_USER` where the item is the subject.
        // TODO: so, on the user page history we will see a history of what they have loaned

        const auditLoan = {
          activityType: AuditType.LOAN,
          activityDetail: 'Item loaned',
          resource: R_ITEMS,
          dataId: item,
          subjectId: id,
          subjectResource: R_USERS,
          securityRelated: null
        }

        await audit(auditLoan)
        await audit({
          ...auditLoan,
          resource: R_USERS,
          subjectId: item,
          subjectResource: R_ITEMS,
          dataId: holder
        })
      })
      await Promise.all(promisees)
    },
    returnItems: async function (this: DataProvider, items: Array<Item['id']>) {
      const userById: Record<number, User> = {}
      const { data: itemsData } = await this.getMany<Item>(R_ITEMS, {
        ids: items
      })
      const usersIds = itemsData.map((item) => item.loanedTo) as number[]
      const { data: usersData } = await this.getMany<User>(R_USERS, {
        ids: usersIds
      })

      usersData.forEach((user) => {
        userById[user.id] = user
      })

      const promisees = itemsData.map(async (item) => {
        const { loanedTo, id } = item

        if (loanedTo) {
          // TODO: TAHA - we should also include an audit for the `R_USER` where the item is the subject.
          const loanReturnAudit = {
            dataId: id,
            activityType: AuditType.RETURN,
            activityDetail: 'Item returned',
            resource: R_ITEMS,
            subjectId: loanedTo,
            subjectResource: R_USERS,
            securityRelated: null
          }

          await audit(loanReturnAudit)
          await audit({
            ...loanReturnAudit,
            dataId: loanedTo,
            resource: R_USERS,
            subjectId: id,
            subjectResource: R_ITEMS
          })
        }
      })

      if (process.env.MOCK) {
        const users = itemsData
          .filter((item) => item.loanedTo !== null)
          .map((item) => item.loanedTo)
          .filter((user) => user !== null) as number[]

        users.forEach((user) => {
          const fn = async (): Promise<void> => {
            const { data: loaned } = await this.getOne<LoanUser>(R_LOAN_USERS, {
              id: user
            })
            let count = 0

            for (let i = 0; i < itemsData.length; i++) {
              if (itemsData[i].loanedTo === user) {
                count++
              }
            }

            if (loaned.numItems - count !== 0)
              await this.update<LoanUser>(R_LOAN_USERS, {
                id: user,
                data: { numItems: loaned.numItems - count },
                previousData: loaned
              })
            else await this.delete<LoanUser>(R_LOAN_USERS, { id: user })
          }

          fn().catch(console.log)
        })
      }

      await this.updateMany(R_ITEMS, {
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

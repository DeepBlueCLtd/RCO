import { type DataProvider } from 'react-admin'
import { getUser } from '../providers/authProvider'
import * as constants from '../constants'
import { getActivityTypeLabel, type AuditType } from './activity-types'

interface Props {
  type: AuditType
  activityDetail: string
  securityRelated?: boolean
  resource: string | null
  item: number | null
}
export const trackEvent =
  (dataProvider: DataProvider) =>
  async ({ type, activityDetail, securityRelated, resource, item }: Props) => {
    try {
      const user = getUser()
      if (user !== undefined) {
        await dataProvider.create<Audit>(constants.R_AUDIT, {
          data: {
            user: user.id,
            resource,
            item,
            activityType: type,
            dateTime: new Date().toISOString(),
            activityDetail,
            label: getActivityTypeLabel(type),
            securityRelated:
              securityRelated !== undefined ? securityRelated : false
          }
        })
      }
    } catch (error) {}
  }

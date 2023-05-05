import { type DataProvider } from 'react-admin'
import { getUser } from '../providers/authProvider'
import * as constants from '../constants'
import { getActivityTypeLabel, type AuditType } from './activity-types'
export const trackEvent =
  (dataProvider: DataProvider) =>
  async (
    type: AuditType,
    activityDetail?: string,
    securityRelated?: boolean,
    previousData?: Record<string, any>,
    index?: number
  ) => {
    try {
      const user = getUser()
      if (user !== undefined) {
        await dataProvider.create<Audit>(constants.R_AUDIT, {
          data: {
            user_id: user.id,
            activityType: type,
            dateTime: new Date().toISOString(),
            activityDetail,
            label: getActivityTypeLabel(type),
            securityRelated:
              securityRelated !== undefined ? securityRelated : false,
            previousData,
            index
          }
        })
      }
    } catch (error) {}
  }

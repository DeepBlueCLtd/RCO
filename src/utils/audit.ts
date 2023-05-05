import { type DataProvider } from 'react-admin'
import { getUser } from '../providers/authProvider'
import * as constants from '../constants'
import { getActivityTypeLabel, type AuditType } from './activity-types'

interface Props {
  type: AuditType
  activityDetail: string
  securityRelated?: boolean
  resource: string | null
  id: number | null
  previousValue?: Record<string, any>
  index?: number
}
export const trackEvent =
  (dataProvider: DataProvider) =>
  async ({
    type,
    activityDetail,
    securityRelated,
    resource,
    id,
    previousValue,
    index
  }: Props) => {
    try {
      const user = getUser()
      if (user !== undefined) {
        const audit: Omit<Audit, 'id'> = {
          user: user.id,
          resource,
          data_id: id,
          activityType: type,
          dateTime: new Date().toISOString(),
          activityDetail,
          label: getActivityTypeLabel(type),
          securityRelated:
            securityRelated !== undefined ? securityRelated : false,
          previousValue,
          index
        }
        await dataProvider.create<Audit>(constants.R_AUDIT, {
          data: audit
        })
      }
    } catch (error) {}
  }

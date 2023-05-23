import { type DataProvider } from 'react-admin'
import { getUser } from '../providers/authProvider'
import * as constants from '../constants'
import { getActivityTypeLabel, type AuditType } from './activity-types'

interface Props {
  type: AuditType
  activityDetail?: string
  securityRelated?: boolean
  resource: string | null
  dataId: number | null
  index?: number
  label?: string
  subject?: User['id']
}
/**
 * @param  {string=} activityDetail - Deprecated
 */
export const trackEvent =
  (dataProvider: DataProvider) =>
  async ({
    type,
    activityDetail = '',
    securityRelated,
    resource,
    dataId,
    subject
  }: Props) => {
    try {
      const user = getUser()
      if (user !== undefined) {
        const audit: Omit<Audit, 'id'> = {
          user: user.id,
          resource,
          dataId,
          activityType: type,
          dateTime: new Date().toISOString(),
          activityDetail,
          label: getActivityTypeLabel(type),
          securityRelated:
            securityRelated !== undefined ? securityRelated : false,
          subject: subject !== undefined ? subject : undefined
        }
        await dataProvider.create<Audit>(constants.R_AUDIT, {
          data: audit
        })
      }
    } catch (error) {}
  }

import { type DataProvider } from 'react-admin'
import { getUser } from '../providers/authProvider'
import * as constants from '../constants'
import { getActivityTypeLabel } from './activity-types'
import { getClientIp } from './helper'

/** minimal set of data for Audit, to be supplemented
 * with other metadata when stored
 */
export type AuditData = Omit<Audit, 'id' | 'user' | 'dateTime' | 'label'>

/**
 * @param  {string=} activityDetail - Deprecated
 */
export const trackEvent =
  (dataProvider: DataProvider) =>
  async ({
    activityType,
    activityDetail = '',
    securityRelated,
    resource,
    dataId,
    subjectId,
    subjectResource
  }: AuditData) => {
    const user = getUser()
    if (user !== undefined) {
      const audit: Omit<Audit, 'id'> = {
        user: user.id,
        resource,
        dataId,
        activityType,
        dateTime: new Date().toISOString(),
        activityDetail,
        label: getActivityTypeLabel(activityType),
        securityRelated:
          securityRelated !== undefined ? securityRelated : false,
        subjectId,
        subjectResource,
        ip: getClientIp()
      }
      await dataProvider.create<Audit>(constants.R_AUDIT, {
        data: audit
      })
    }
  }

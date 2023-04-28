import { type DataProvider } from 'react-admin'
import { getUser } from '../providers/authProvider'
import * as constants from '../constants'

export enum AuditType {
  LOGIN = 'login',
  LOGOUT = 'logout',

  CREATE_USER = 'create_user',
  DELETE_USER = 'delete_user',
  EDIT_USER = 'edit_user',

  CREATE_PROJECT = 'create_project',
  DELETE_PROJECT = 'delete_project',
  EDIT_PROJECT = 'edit_project',

  CREATE_BATCH = 'create_batch',
  DELETE_BATCH = 'delete_batch',
  EDIT_BATCH = 'edit_batch',

  CREATE_ITEM = 'create_item',
  DELETE_ITEM = 'delete_item',
  EDIT_ITEM = 'edit_item',

  CREATE_LOAN = 'create_loan',
  DELETE_LOAN = 'delete_loan',
  EDIT_LOAN = 'edit_loan'
}

export const trackEvent =
  (dataProvider: DataProvider) =>
  async (
    type: AuditType,
    activityDetail?: string,
    securityRelated?: boolean
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
            securityRelated:
              securityRelated !== undefined ? securityRelated : false
          }
        })
      }
    } catch (error) {}
  }

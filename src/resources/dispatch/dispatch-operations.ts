import { type UpdateParams } from 'react-admin'
import { type AuditData } from '../../utils/audit'
import { AuditType } from '../../utils/activity-types'
import * as constants from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'

export type UpdateFunction = (resource: string, params: UpdateParams) => Promise<any>
export type UpdateManyFunction = (resource: string, params: { ids: number[]; data: any }) => Promise<any>
export type AuditFunction = (data: AuditData) => Promise<void>
export type NotifyFunction = (message: any, options?: any) => void

/**
 * Executes dispatch workflow for all items in a dispatch job.
 * This function processes ALL items regardless of batch size by:
 * 1. Creating an audit entry for the dispatch job
 * 2. Updating the dispatch record
 * 3. Setting dispatchedDate on all items via updateMany
 * 4. Creating individual audit entries for each item
 *
 * @param items - All items to be dispatched
 * @param dispatchId - ID of the dispatch job
 * @param recordId - ID of the dispatch record
 * @param data - Update parameters for the dispatch record
 * @param update - React-admin update function
 * @param updateMany - React-admin updateMany function
 * @param audit - Audit function
 * @param notify - Notification function
 */
// eslint-disable-next-line max-params
export const executeDispatch = async (
  items: Item[],
  dispatchId: number,
  recordId: number,
  data: UpdateParams,
  update: UpdateFunction,
  updateMany: UpdateManyFunction,
  audit: AuditFunction,
  notify: NotifyFunction
): Promise<void> => {

  // Audit the dispatch job itself
  await audit({
    activityType: AuditType.SENT,
    activityDetail: 'Dispatch Sent',
    securityRelated: false,
    resource: constants.R_DISPATCH,
    dataId: dispatchId,
    subjectId: null,
    subjectResource: null
  })

  // Extract all item IDs for batch update
  const ids = items.map((item) => item.id)

  // Update the dispatch record
  await update(constants.R_DISPATCH, data)

  // Update all items with dispatch date
  await updateMany(constants.R_ITEMS, {
    ids,
    data: {
      dispatchedDate: nowDate()
    }
  })

  // Create audit entry for each item
  await Promise.all(
    ids.map(async (itemId) => {
      await audit({
        activityType: AuditType.SENT,
        activityDetail: 'Dispatch Sent',
        securityRelated: false,
        resource: constants.R_ITEMS,
        dataId: itemId,
        subjectId: recordId,
        subjectResource: constants.R_DISPATCH
      })
    })
  )

  notify('Element dispatched', { type: 'success' })
}

import { type UpdateParams } from 'react-admin'
import { type AuditData } from '../../utils/audit'
import { AuditType } from '../../utils/activity-types'
import * as constants from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'

/**
 * Executes destruction workflow for all items in a destruction job.
 * This function processes ALL items regardless of batch size by:
 * 1. Creating an audit entry for the destruction job
 * 2. Updating the destruction record
 * 3. Setting destructionDate on all items via updateMany
 * 4. Creating individual audit entries for each item
 *
 * @param items - All items to be destroyed
 * @param destructionId - ID of the destruction job
 * @param recordId - ID of the destruction record
 * @param data - Update parameters for the destruction record
 * @param update - React-admin update function
 * @param updateMany - React-admin updateMany function
 * @param audit - Audit function
 * @param notify - Notification function
 */
export const executeDestruction = async (
  items: Item[],
  destructionId: number,
  recordId: number,
  data: UpdateParams,
  update: (resource: string, params: UpdateParams) => Promise<any>,
  updateMany: (
    resource: string,
    params: { ids: number[]; data: any }
  ) => Promise<any>,
  audit: (data: AuditData) => Promise<void>,
  notify: (message: string, options: { type: string }) => void
): Promise<void> => {

  // Audit the destruction job itself
  await audit({
    activityType: AuditType.DESTROY,
    activityDetail: 'Destroyed',
    securityRelated: false,
    resource: constants.R_DESTRUCTION,
    dataId: destructionId,
    subjectId: destructionId,
    subjectResource: constants.R_ITEMS
  })

  // Extract all item IDs for batch update
  const ids = items.map((item: Item) => item.id)

  // Update the destruction record
  await update(constants.R_DESTRUCTION, data)

  // Update all items with destruction date
  await updateMany(constants.R_ITEMS, {
    ids,
    data: {
      destructionDate: nowDate()
    }
  })

  // Create audit entry for each item
  await Promise.all(
    ids.map(async (itemId) => {
      await audit({
        activityType: AuditType.DESTROY,
        activityDetail: 'Destroyed',
        securityRelated: false,
        resource: constants.R_ITEMS,
        dataId: itemId,
        subjectId: recordId,
        subjectResource: constants.R_DESTRUCTION
      })
    })
  )

  notify('Element destroyed', { type: 'success' })
}

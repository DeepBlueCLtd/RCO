import { type UpdateParams } from 'react-admin'
import { type AuditData } from '../../utils/audit'
import { AuditType } from '../../utils/activity-types'
import * as constants from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'

export type UpdateFunction = (resource: string, params: UpdateParams) => Promise<any>
export type UpdateManyFunction = (resource: string, params: { ids: number[]; data: any }) => Promise<any>
export type AuditFunction = (data: AuditData) => Promise<void>
export type NotifyFunction = (message: any, options?: any) => void
export interface DataProvider {
  updateMany: (resource: string, params: { ids: number[]; data: any }) => Promise<any>
}

/**
 * Adds items to a destruction job.
 * This function:
 * 1. Filters items by loan/destruction status
 * 2. Creates bidirectional audit entries for each item
 * 3. Updates items with destruction ID
 *
 * @param items - All selected items
 * @param itemIds - IDs of items to add
 * @param destructionJobId - ID of the destruction job
 * @param dataProvider - Data provider for updating items
 * @param audit - Audit function
 * @param notify - Notification function
 */
export const addItemsToDestruction = async (
  items: Item[],
  itemIds: number[],
  destructionJobId: number,
  dataProvider: DataProvider,
  audit: AuditFunction,
  notify: NotifyFunction
): Promise<void> => {
  // Filter items that can be added to destruction
  const eligibleItems = items.filter(({ loanedDate, loanedTo, destructionDate, id }) => {
    return (
      itemIds.includes(id) &&
      (loanedTo === null || loanedTo === undefined) &&
      (loanedDate === null || loanedDate === undefined) &&
      (destructionDate === null || destructionDate === undefined)
    )
  })

  // Create audit entries for each item
  const auditPromises = eligibleItems.map(async (item) => {
    const auditData = {
      activityType: AuditType.EDIT,
      activityDetail: 'Item added to destruction',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: item.id,
      subjectId: destructionJobId,
      subjectResource: constants.R_DESTRUCTION
    }

    // Bidirectional audit: item -> destruction
    await audit(auditData)

    // Bidirectional audit: destruction -> item
    await audit({
      ...auditData,
      resource: constants.R_DESTRUCTION,
      dataId: destructionJobId,
      subjectId: item.id,
      subjectResource: constants.R_ITEMS
    })

    return item.id
  })

  const eligibleItemIds = await Promise.all(auditPromises)

  // Update items with destruction ID
  await dataProvider.updateMany(constants.R_ITEMS, {
    ids: eligibleItemIds,
    data: {
      destruction: destructionJobId
    }
  })

  notify(`${itemIds.length} items marked for destruction`, { type: 'success' })
}

/**
 * Adds items to a dispatch job.
 * This function:
 * 1. Filters items by ID
 * 2. Creates bidirectional audit entries for each item
 * 3. Updates items with dispatch job ID
 *
 * @param items - All selected items
 * @param itemIds - IDs of items to add
 * @param dispatchJobId - ID of the dispatch job
 * @param dataProvider - Data provider for updating items
 * @param audit - Audit function
 * @param notify - Notification function
 */
export const addItemsToDispatch = async (
  items: Item[],
  itemIds: number[],
  dispatchJobId: number,
  dataProvider: DataProvider,
  audit: AuditFunction,
  notify: NotifyFunction
): Promise<void> => {
  // Filter items by ID
  const eligibleItems = items.filter(({ id }) => itemIds.includes(id))

  // Create audit entries for each item
  const auditPromises = eligibleItems.map(async (item) => {
    const auditData = {
      activityType: AuditType.EDIT,
      activityDetail: 'Item added to dispatch',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: item.id,
      subjectId: dispatchJobId,
      subjectResource: constants.R_DISPATCH
    }

    // Bidirectional audit: item -> dispatch
    await audit(auditData)

    // Bidirectional audit: dispatch -> item
    await audit({
      ...auditData,
      resource: constants.R_DISPATCH,
      dataId: dispatchJobId,
      subjectId: item.id,
      subjectResource: constants.R_ITEMS
    })

    return item.id
  })

  const eligibleItemIds = await Promise.all(auditPromises)

  // Update items with dispatch job ID
  await dataProvider.updateMany(constants.R_ITEMS, {
    ids: eligibleItemIds,
    data: {
      dispatchJob: dispatchJobId
    }
  })

  notify(`${eligibleItems.length} items added to dispatch`, { type: 'success' })
}

/**
 * Removes items from a destruction job.
 * This function:
 * 1. Creates bidirectional audit entries for each item
 * 2. Clears destruction references via updateMany
 *
 * @param items - Items to remove from destruction
 * @param itemIds - IDs of items to remove
 * @param dataProvider - Data provider for updating items
 * @param audit - Audit function
 * @param notify - Notification function
 */
export const removeItemsFromDestruction = async (
  items: Item[],
  itemIds: number[],
  dataProvider: DataProvider,
  audit: AuditFunction,
  notify: NotifyFunction
): Promise<void> => {
  // Create audit entries for each item
  const auditPromises = items.map(async (item) => {
    const { id, destruction } = item

    // Audit: destruction -> item
    await audit({
      activityType: AuditType.EDIT,
      activityDetail: 'Remove item from destruction',
      securityRelated: false,
      dataId: destruction,
      resource: constants.R_DESTRUCTION,
      subjectId: id,
      subjectResource: constants.R_ITEMS
    })

    // Audit: item -> destruction
    await audit({
      activityType: AuditType.EDIT,
      activityDetail: 'Remove item from destruction',
      securityRelated: false,
      dataId: id,
      resource: constants.R_ITEMS,
      subjectId: destruction,
      subjectResource: constants.R_DESTRUCTION
    })
  })

  await Promise.all(auditPromises)

  // Clear destruction references
  await dataProvider.updateMany(constants.R_ITEMS, {
    ids: itemIds,
    data: {
      destruction: null,
      destructionDate: null
    }
  })

  notify(`${itemIds.length} items removed from destruction`)
}

/**
 * Records that a receipt has been received for a dispatch.
 *
 * @param dispatchId - ID of the dispatch
 * @param previousData - Previous dispatch record data
 * @param update - Update function
 * @param notify - Notification function
 */
export const recordReceiptReceived = async (
  dispatchId: number,
  previousData: Dispatch,
  update: UpdateFunction,
  notify: NotifyFunction
): Promise<void> => {
  await update(constants.R_DISPATCH, {
    id: dispatchId,
    data: {
      receiptReceived: nowDate()
    },
    previousData
  })

  notify('Receipt Received', {
    type: 'success'
  })
}

/**
 * Saves the dispatch report printed timestamp.
 *
 * @param dispatchId - ID of the dispatch
 * @param previousData - Previous dispatch record data
 * @param update - Update function
 */
export const saveDispatchReportPrinted = async (
  dispatchId: number,
  previousData: Dispatch,
  update: UpdateFunction
): Promise<void> => {
  await update(constants.R_DISPATCH, {
    id: dispatchId,
    previousData,
    data: {
      reportPrintedAt: nowDate()
    }
  })
}

/**
 * Saves the destruction report printed timestamp.
 *
 * @param destructionId - ID of the destruction
 * @param previousData - Previous destruction record data
 * @param update - Update function
 */
export const saveDestructionReportPrinted = async (
  destructionId: number,
  previousData: Destruction,
  update: UpdateFunction
): Promise<void> => {
  await update(constants.R_DESTRUCTION, {
    id: destructionId,
    previousData,
    data: {
      reportPrintedAt: nowDate()
    }
  })
}

/**
 * Saves the hastener printed timestamp and creates an audit entry.
 *
 * @param dispatchId - ID of the dispatch
 * @param previousData - Previous dispatch record data
 * @param update - Update function
 * @param audit - Audit function
 * @param notify - Notification function
 */
export const saveHastenerPrinted = async (
  dispatchId: number,
  previousData: Dispatch,
  update: UpdateFunction,
  audit: AuditFunction,
  notify: NotifyFunction
): Promise<void> => {
  try {
    await update(constants.R_DISPATCH, {
      id: dispatchId,
      previousData,
      data: {
        lastHastenerSent: nowDate()
      }
    })

    await audit({
      activityType: AuditType.EDIT,
      activityDetail: 'Hastener sent',
      securityRelated: false,
      resource: constants.R_DISPATCH,
      dataId: dispatchId,
      subjectId: null,
      subjectResource: null
    })
  } catch (error) {
    notify('Failed to update hastener sent date', { type: 'error' })
    throw error
  }
}

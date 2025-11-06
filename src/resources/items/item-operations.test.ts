import {
  addItemsToDestruction,
  addItemsToDispatch,
  removeItemsFromDestruction,
  recordReceiptReceived,
  saveDispatchReportPrinted,
  saveDestructionReportPrinted,
  saveHastenerPrinted,
  type AuditFunction,
  type NotifyFunction,
  type UpdateFunction,
  type DataProvider
} from './item-operations'
import * as constants from '../../constants'
import { AuditType } from '../../utils/activity-types'

// Mock functions
const createMockAudit = (): jest.MockedFunction<AuditFunction> => jest.fn()
const createMockNotify = (): jest.MockedFunction<NotifyFunction> => jest.fn()
const createMockUpdate = (): jest.MockedFunction<UpdateFunction> => jest.fn()
const createMockDataProvider = (): DataProvider => ({
  updateMany: jest.fn()
})

describe('item-operations', () => {
  describe('addItemsToDestruction', () => {
    it('should add eligible items to destruction job', async () => {
      const items: Item[] = [
        {
          id: 1,
          loanedDate: null,
          loanedTo: null,
          destructionDate: null,
          createdAt: '2024-01-01',
          createdBy: 1
        } as Item,
        {
          id: 2,
          loanedDate: null,
          loanedTo: null,
          destructionDate: null,
          createdAt: '2024-01-01',
          createdBy: 1
        } as Item
      ]
      const itemIds = [1, 2]
      const destructionJobId = 100
      const dataProvider = createMockDataProvider()
      const audit = createMockAudit()
      const notify = createMockNotify()

      await addItemsToDestruction(
        items,
        itemIds,
        destructionJobId,
        dataProvider,
        audit,
        notify
      )

      // Should create bidirectional audit entries (2 per item)
      expect(audit).toHaveBeenCalledTimes(4)

      // Should update items with destruction ID
      expect(dataProvider.updateMany).toHaveBeenCalledWith(constants.R_ITEMS, {
        ids: [1, 2],
        data: {
          destruction: destructionJobId
        }
      })

      // Should notify success
      expect(notify).toHaveBeenCalledWith(
        '2 items marked for destruction',
        { type: 'success' }
      )
    })

    it('should filter out loaned items', async () => {
      const items: Item[] = [
        {
          id: 1,
          loanedDate: null,
          loanedTo: null,
          destructionDate: null,
          createdAt: '2024-01-01',
          createdBy: 1
        } as Item,
        {
          id: 2,
          loanedDate: '2024-01-01',
          loanedTo: 'Someone',
          destructionDate: null,
          createdAt: '2024-01-01',
          createdBy: 1
        } as Item
      ]
      const itemIds = [1, 2]
      const destructionJobId = 100
      const dataProvider = createMockDataProvider()
      const audit = createMockAudit()
      const notify = createMockNotify()

      await addItemsToDestruction(
        items,
        itemIds,
        destructionJobId,
        dataProvider,
        audit,
        notify
      )

      // Should only update the eligible item
      expect(dataProvider.updateMany).toHaveBeenCalledWith(constants.R_ITEMS, {
        ids: [1],
        data: {
          destruction: destructionJobId
        }
      })
    })

    it('should filter out already destroyed items', async () => {
      const items: Item[] = [
        {
          id: 1,
          loanedDate: null,
          loanedTo: null,
          destructionDate: null,
          createdAt: '2024-01-01',
          createdBy: 1
        } as Item,
        {
          id: 2,
          loanedDate: null,
          loanedTo: null,
          destructionDate: '2024-01-01',
          createdAt: '2024-01-01',
          createdBy: 1
        } as Item
      ]
      const itemIds = [1, 2]
      const destructionJobId = 100
      const dataProvider = createMockDataProvider()
      const audit = createMockAudit()
      const notify = createMockNotify()

      await addItemsToDestruction(
        items,
        itemIds,
        destructionJobId,
        dataProvider,
        audit,
        notify
      )

      // Should only update the eligible item
      expect(dataProvider.updateMany).toHaveBeenCalledWith(constants.R_ITEMS, {
        ids: [1],
        data: {
          destruction: destructionJobId
        }
      })
    })
  })

  describe('addItemsToDispatch', () => {
    it('should add items to dispatch job', async () => {
      const items: Item[] = [
        { id: 1, createdAt: '2024-01-01', createdBy: 1 } as Item,
        { id: 2, createdAt: '2024-01-01', createdBy: 1 } as Item
      ]
      const itemIds = [1, 2]
      const dispatchJobId = 200
      const dataProvider = createMockDataProvider()
      const audit = createMockAudit()
      const notify = createMockNotify()

      await addItemsToDispatch(
        items,
        itemIds,
        dispatchJobId,
        dataProvider,
        audit,
        notify
      )

      // Should create bidirectional audit entries (2 per item)
      expect(audit).toHaveBeenCalledTimes(4)

      // Should update items with dispatch job ID
      expect(dataProvider.updateMany).toHaveBeenCalledWith(constants.R_ITEMS, {
        ids: [1, 2],
        data: {
          dispatchJob: dispatchJobId
        }
      })

      // Should notify success
      expect(notify).toHaveBeenCalledWith(
        '2 items added to dispatch',
        { type: 'success' }
      )
    })

    it('should only process items in the itemIds array', async () => {
      const items: Item[] = [
        { id: 1, createdAt: '2024-01-01', createdBy: 1 } as Item,
        { id: 2, createdAt: '2024-01-01', createdBy: 1 } as Item,
        { id: 3, createdAt: '2024-01-01', createdBy: 1 } as Item
      ]
      const itemIds = [1, 3]
      const dispatchJobId = 200
      const dataProvider = createMockDataProvider()
      const audit = createMockAudit()
      const notify = createMockNotify()

      await addItemsToDispatch(
        items,
        itemIds,
        dispatchJobId,
        dataProvider,
        audit,
        notify
      )

      // Should only update items 1 and 3
      expect(dataProvider.updateMany).toHaveBeenCalledWith(constants.R_ITEMS, {
        ids: [1, 3],
        data: {
          dispatchJob: dispatchJobId
        }
      })
    })
  })

  describe('removeItemsFromDestruction', () => {
    it('should remove items from destruction', async () => {
      const items: Item[] = [
        { id: 1, destruction: 100, createdAt: '2024-01-01', createdBy: 1 } as Item,
        { id: 2, destruction: 100, createdAt: '2024-01-01', createdBy: 1 } as Item
      ]
      const itemIds = [1, 2]
      const dataProvider = createMockDataProvider()
      const audit = createMockAudit()
      const notify = createMockNotify()

      await removeItemsFromDestruction(
        items,
        itemIds,
        dataProvider,
        audit,
        notify
      )

      // Should create bidirectional audit entries (2 per item)
      expect(audit).toHaveBeenCalledTimes(4)

      // Should clear destruction references
      expect(dataProvider.updateMany).toHaveBeenCalledWith(constants.R_ITEMS, {
        ids: [1, 2],
        data: {
          destruction: null,
          destructionDate: null
        }
      })

      // Should notify success
      expect(notify).toHaveBeenCalledWith('2 items removed from destruction')
    })

    it('should create correct audit entries', async () => {
      const items: Item[] = [
        { id: 1, destruction: 100, createdAt: '2024-01-01', createdBy: 1 } as Item
      ]
      const itemIds = [1]
      const dataProvider = createMockDataProvider()
      const audit = createMockAudit()
      const notify = createMockNotify()

      await removeItemsFromDestruction(
        items,
        itemIds,
        dataProvider,
        audit,
        notify
      )

      // Verify audit entries
      expect(audit).toHaveBeenCalledWith({
        activityType: AuditType.EDIT,
        activityDetail: 'Remove item from destruction',
        securityRelated: false,
        dataId: 100,
        resource: constants.R_DESTRUCTION,
        subjectId: 1,
        subjectResource: constants.R_ITEMS
      })

      expect(audit).toHaveBeenCalledWith({
        activityType: AuditType.EDIT,
        activityDetail: 'Remove item from destruction',
        securityRelated: false,
        dataId: 1,
        resource: constants.R_ITEMS,
        subjectId: 100,
        subjectResource: constants.R_DESTRUCTION
      })
    })
  })

  describe('recordReceiptReceived', () => {
    it('should update dispatch with receipt received date', async () => {
      const dispatchId = 1
      const previousData = { id: 1 } as Dispatch
      const update = createMockUpdate()
      const notify = createMockNotify()

      await recordReceiptReceived(dispatchId, previousData, update, notify)

      expect(update).toHaveBeenCalledWith(constants.R_DISPATCH, {
        id: dispatchId,
        data: {
          receiptReceived: expect.any(String)
        },
        previousData
      })

      expect(notify).toHaveBeenCalledWith('Receipt Received', {
        type: 'success'
      })
    })
  })

  describe('saveDispatchReportPrinted', () => {
    it('should update dispatch with report printed timestamp', async () => {
      const dispatchId = 1
      const previousData = { id: 1 } as Dispatch
      const update = createMockUpdate()

      await saveDispatchReportPrinted(dispatchId, previousData, update)

      expect(update).toHaveBeenCalledWith(constants.R_DISPATCH, {
        id: dispatchId,
        previousData,
        data: {
          reportPrintedAt: expect.any(String)
        }
      })
    })
  })

  describe('saveDestructionReportPrinted', () => {
    it('should update destruction with report printed timestamp', async () => {
      const destructionId = 1
      const previousData = { id: 1 } as Destruction
      const update = createMockUpdate()

      await saveDestructionReportPrinted(destructionId, previousData, update)

      expect(update).toHaveBeenCalledWith(constants.R_DESTRUCTION, {
        id: destructionId,
        previousData,
        data: {
          reportPrintedAt: expect.any(String)
        }
      })
    })
  })

  describe('saveHastenerPrinted', () => {
    it('should update dispatch with hastener sent date and create audit entry', async () => {
      const dispatchId = 1
      const previousData = { id: 1 } as Dispatch
      const update = createMockUpdate()
      const audit = createMockAudit()
      const notify = createMockNotify()

      await saveHastenerPrinted(dispatchId, previousData, update, audit, notify)

      expect(update).toHaveBeenCalledWith(constants.R_DISPATCH, {
        id: dispatchId,
        previousData,
        data: {
          lastHastenerSent: expect.any(String)
        }
      })

      expect(audit).toHaveBeenCalledWith({
        activityType: AuditType.EDIT,
        activityDetail: 'Hastener sent',
        securityRelated: false,
        resource: constants.R_DISPATCH,
        dataId: dispatchId,
        subjectId: null,
        subjectResource: null
      })
    })

    it('should handle errors and notify user', async () => {
      const dispatchId = 1
      const previousData = { id: 1 } as Dispatch
      const update = jest.fn().mockRejectedValue(new Error('Update failed'))
      const audit = createMockAudit()
      const notify = createMockNotify()

      await expect(
        saveHastenerPrinted(dispatchId, previousData, update, audit, notify)
      ).rejects.toThrow('Update failed')

      expect(notify).toHaveBeenCalledWith(
        'Failed to update hastener sent date',
        { type: 'error' }
      )
    })
  })
})

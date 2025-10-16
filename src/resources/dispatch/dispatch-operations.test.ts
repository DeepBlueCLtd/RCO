import { describe, it, expect } from '@jest/globals'
import { executeDispatch } from './dispatch-operations'
import { AuditType } from '../../utils/activity-types'
import * as constants from '../../constants'
import {
  createMockOperationDependencies,
  createMockItems,
  getUpdateManyCallParams
} from '../test-helpers/operation-test-helpers'

describe('executeDispatch', () => {
  it('should process all 50 items in a batch', async () => {
    const mockItems = createMockItems(50, 1, { dispatchJob: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDispatch(
      mockItems,
      1, // dispatchId
      1, // recordId
      { id: 1, data: { dispatchedAt: '2025-01-01' }, previousData: {} },
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    expect(mockUpdateMany).toHaveBeenCalledWith(
      constants.R_ITEMS,
      expect.objectContaining({
        ids: expect.arrayContaining([1, 2, 3, 25, 26, 49, 50]),
        data: expect.objectContaining({ dispatchedDate: expect.any(String) })
      })
    )

    const updateManyParams = getUpdateManyCallParams(mockUpdateMany)
    expect(updateManyParams.ids).toHaveLength(50)
    expect(mockAudit).toHaveBeenCalledTimes(51) // 1 + 50
    expect(mockNotify).toHaveBeenCalledWith('Element dispatched', { type: 'success' })
  })

  it('should handle exactly 25 items (boundary condition)', async () => {
    const mockItems = createMockItems(25, 1, { dispatchJob: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDispatch(
      mockItems,
      1,
      1,
      { id: 1, data: {}, previousData: {} },
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    const updateManyParams = getUpdateManyCallParams(mockUpdateMany)
    expect(updateManyParams.ids).toHaveLength(25)
    expect(mockAudit).toHaveBeenCalledTimes(26) // 1 + 25
  })

  it('should handle 26 items (edge case beyond default pagination)', async () => {
    const mockItems = createMockItems(26, 1, { dispatchJob: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDispatch(
      mockItems,
      1,
      1,
      { id: 1, data: {}, previousData: {} },
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    const updateManyParams = getUpdateManyCallParams(mockUpdateMany)
    expect(updateManyParams.ids).toHaveLength(26)
    expect(updateManyParams.ids[25]).toBe(26) // Verify 26th item is included
  })

  it('should handle 100 items (large batch)', async () => {
    const mockItems = createMockItems(100, 1, { dispatchJob: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDispatch(
      mockItems,
      1,
      1,
      { id: 1, data: {}, previousData: {} },
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    const updateManyParams = getUpdateManyCallParams(mockUpdateMany)
    expect(updateManyParams.ids).toHaveLength(100)
    expect(mockAudit).toHaveBeenCalledTimes(101) // 1 + 100
  })

  it('should create correct audit entries for dispatch job', async () => {
    const mockItems = createMockItems(1, 1, { dispatchJob: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDispatch(
      mockItems,
      5, // dispatchId
      10, // recordId
      { id: 5, data: {}, previousData: {} },
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    // First audit call should be for the dispatch job
    expect(mockAudit).toHaveBeenNthCalledWith(1, {
      activityType: AuditType.SENT,
      activityDetail: 'Dispatch Sent',
      securityRelated: false,
      resource: constants.R_DISPATCH,
      dataId: 5,
      subjectId: null,
      subjectResource: null
    })

    // Second audit call should be for the item
    expect(mockAudit).toHaveBeenNthCalledWith(2, {
      activityType: AuditType.SENT,
      activityDetail: 'Dispatch Sent',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: 1,
      subjectId: 10,
      subjectResource: constants.R_DISPATCH
    })
  })

  it('should call update with correct dispatch record data', async () => {
    const mockItems = createMockItems(1, 1, { dispatchJob: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    const updateParams = {
      id: 5,
      data: { dispatchedAt: '2025-01-15' },
      previousData: { name: 'Test Dispatch' }
    }

    await executeDispatch(
      mockItems,
      5,
      10,
      updateParams,
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    expect(mockUpdate).toHaveBeenCalledWith(constants.R_DISPATCH, updateParams)
  })

  it('should set dispatchedDate on all items', async () => {
    const mockItems = createMockItems(3, 1, { dispatchJob: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDispatch(
      mockItems,
      1,
      1,
      { id: 1, data: {}, previousData: {} },
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    expect(mockUpdateMany).toHaveBeenCalledWith(
      constants.R_ITEMS,
      expect.objectContaining({
        ids: [1, 2, 3],
        data: expect.objectContaining({ dispatchedDate: expect.any(String) })
      })
    )
  })
})

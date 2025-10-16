import { describe, it, expect } from '@jest/globals'
import { executeDestruction } from './destruction-operations'
import { AuditType } from '../../utils/activity-types'
import * as constants from '../../constants'
import {
  createMockOperationDependencies,
  createMockItems,
  getUpdateManyCallParams
} from '../test-helpers/operation-test-helpers'

describe('executeDestruction', () => {
  it('should process all 50 items in a batch', async () => {
    const mockItems = createMockItems(50, 1, { destruction: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDestruction(
      mockItems,
      1, // destructionId
      1, // recordId
      { id: 1, data: { finalisedAt: '2025-01-01', finalisedBy: 1 }, previousData: {} },
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    expect(mockUpdateMany).toHaveBeenCalledWith(
      constants.R_ITEMS,
      expect.objectContaining({
        ids: expect.arrayContaining([1, 2, 3, 25, 26, 49, 50]),
        data: expect.objectContaining({ destructionDate: expect.any(String) })
      })
    )

    const updateManyParams = getUpdateManyCallParams(mockUpdateMany)
    expect(updateManyParams.ids).toHaveLength(50)
    expect(mockAudit).toHaveBeenCalledTimes(51) // 1 + 50
    expect(mockNotify).toHaveBeenCalledWith('Element destroyed', { type: 'success' })
  })

  it('should handle exactly 25 items (boundary condition)', async () => {
    const mockItems = createMockItems(25, 1, { destruction: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDestruction(
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
    const mockItems = createMockItems(26, 1, { destruction: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDestruction(
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

  it('should handle 69 items (real-world case from issue #1137)', async () => {
    // This matches the actual bug scenario: 69 items (IDs 256-324)
    const mockItems = createMockItems(69, 256, { destruction: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDestruction(
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

    // Verify all 69 items are included
    expect(updateManyParams.ids).toHaveLength(69)

    // Verify the first 44 items that were previously missed are now included
    expect(updateManyParams.ids).toContain(256) // First item
    expect(updateManyParams.ids).toContain(299) // 44th item (last previously missed)
    expect(updateManyParams.ids).toContain(324) // Last item

    // Verify all 70 audit calls (1 for job + 69 for items)
    expect(mockAudit).toHaveBeenCalledTimes(70)
  })

  it('should create correct audit entries for destruction job', async () => {
    const mockItems = createMockItems(1, 1, { destruction: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    await executeDestruction(
      mockItems,
      5, // destructionId
      10, // recordId
      { id: 5, data: {}, previousData: {} },
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    // First audit call should be for the destruction job
    expect(mockAudit).toHaveBeenNthCalledWith(1, {
      activityType: AuditType.DESTROY,
      activityDetail: 'Destroyed',
      securityRelated: false,
      resource: constants.R_DESTRUCTION,
      dataId: 5,
      subjectId: 5,
      subjectResource: constants.R_ITEMS
    })

    // Second audit call should be for the item
    expect(mockAudit).toHaveBeenNthCalledWith(2, {
      activityType: AuditType.DESTROY,
      activityDetail: 'Destroyed',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: 1,
      subjectId: 10,
      subjectResource: constants.R_DESTRUCTION
    })
  })

  it('should call update with correct destruction record data', async () => {
    const mockItems = createMockItems(1, 1, { destruction: 1 })
    const { mockUpdate, mockUpdateMany, mockAudit, mockNotify } = createMockOperationDependencies()

    const updateParams = {
      id: 5,
      data: { finalisedAt: '2025-01-15', finalisedBy: 2 },
      previousData: { name: 'Test Destruction' }
    }

    await executeDestruction(
      mockItems,
      5,
      10,
      updateParams,
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    expect(mockUpdate).toHaveBeenCalledWith(constants.R_DESTRUCTION, updateParams)
  })
})

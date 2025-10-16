import { describe, it, expect, jest } from '@jest/globals'
import { executeDestruction } from './destruction-operations'
import { AuditType } from '../../utils/activity-types'
import * as constants from '../../constants'

describe('executeDestruction', () => {
  it('should process all 50 items in a batch', async () => {
    // Setup: Create 50 mock items
    const mockItems = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      itemNumber: `ITEM-${i + 1}`,
      destruction: 1
    })) as Item[]

    const mockUpdate = jest.fn().mockResolvedValue({})
    const mockUpdateMany = jest.fn().mockResolvedValue({})
    const mockAudit = jest.fn().mockResolvedValue(undefined)
    const mockNotify = jest.fn()

    const updateParams = {
      id: 1,
      data: { finalisedAt: '2025-01-01', finalisedBy: 1 },
      previousData: {}
    }

    // Execute
    await executeDestruction(
      mockItems,
      1, // destructionId
      1, // recordId
      updateParams,
      mockUpdate,
      mockUpdateMany,
      mockAudit,
      mockNotify
    )

    // Verify updateMany was called with all 50 item IDs
    expect(mockUpdateMany).toHaveBeenCalledWith(
      constants.R_ITEMS,
      expect.objectContaining({
        ids: expect.arrayContaining([1, 2, 3, 25, 26, 49, 50]),
        data: expect.objectContaining({
          destructionDate: expect.any(String)
        })
      })
    )

    const updateManyCall = mockUpdateMany.mock.calls[0][1]
    expect(updateManyCall.ids).toHaveLength(50)

    // Verify audit was called 51 times (1 for job + 50 for items)
    expect(mockAudit).toHaveBeenCalledTimes(51)

    // Verify notification was sent
    expect(mockNotify).toHaveBeenCalledWith('Element destroyed', {
      type: 'success'
    })
  })

  it('should handle exactly 25 items (boundary condition)', async () => {
    const mockItems = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      itemNumber: `ITEM-${i + 1}`,
      destruction: 1
    })) as Item[]

    const mockUpdate = jest.fn().mockResolvedValue({})
    const mockUpdateMany = jest.fn().mockResolvedValue({})
    const mockAudit = jest.fn().mockResolvedValue(undefined)
    const mockNotify = jest.fn()

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

    const updateManyCall = mockUpdateMany.mock.calls[0][1]
    expect(updateManyCall.ids).toHaveLength(25)
    expect(mockAudit).toHaveBeenCalledTimes(26) // 1 + 25
  })

  it('should handle 26 items (edge case beyond default pagination)', async () => {
    const mockItems = Array.from({ length: 26 }, (_, i) => ({
      id: i + 1,
      itemNumber: `ITEM-${i + 1}`,
      destruction: 1
    })) as Item[]

    const mockUpdate = jest.fn().mockResolvedValue({})
    const mockUpdateMany = jest.fn().mockResolvedValue({})
    const mockAudit = jest.fn().mockResolvedValue(undefined)
    const mockNotify = jest.fn()

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

    const updateManyCall = mockUpdateMany.mock.calls[0][1]
    expect(updateManyCall.ids).toHaveLength(26)
    expect(updateManyCall.ids[25]).toBe(26) // Verify 26th item is included
  })

  it('should handle 69 items (real-world case from issue #1137)', async () => {
    // This matches the actual bug scenario: 69 items (IDs 256-324)
    const mockItems = Array.from({ length: 69 }, (_, i) => ({
      id: 256 + i,
      itemNumber: `ITEM-${256 + i}`,
      destruction: 1
    })) as Item[]

    const mockUpdate = jest.fn().mockResolvedValue({})
    const mockUpdateMany = jest.fn().mockResolvedValue({})
    const mockAudit = jest.fn().mockResolvedValue(undefined)
    const mockNotify = jest.fn()

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

    const updateManyCall = mockUpdateMany.mock.calls[0][1]

    // Verify all 69 items are included
    expect(updateManyCall.ids).toHaveLength(69)

    // Verify the first 44 items that were previously missed are now included
    expect(updateManyCall.ids).toContain(256) // First item
    expect(updateManyCall.ids).toContain(299) // 44th item (last previously missed)
    expect(updateManyCall.ids).toContain(324) // Last item

    // Verify all 70 audit calls (1 for job + 69 for items)
    expect(mockAudit).toHaveBeenCalledTimes(70)
  })

  it('should create correct audit entries for destruction job', async () => {
    const mockItems = [{ id: 1, itemNumber: 'ITEM-1', destruction: 1 }] as Item[]
    const mockUpdate = jest.fn().mockResolvedValue({})
    const mockUpdateMany = jest.fn().mockResolvedValue({})
    const mockAudit = jest.fn().mockResolvedValue(undefined)
    const mockNotify = jest.fn()

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
    const mockItems = [{ id: 1, itemNumber: 'ITEM-1', destruction: 1 }] as Item[]
    const mockUpdate = jest.fn().mockResolvedValue({})
    const mockUpdateMany = jest.fn().mockResolvedValue({})
    const mockAudit = jest.fn().mockResolvedValue(undefined)
    const mockNotify = jest.fn()

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

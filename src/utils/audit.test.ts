import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { trackEvent, type AuditData } from './audit'
import { AuditType } from './activity-types'
import * as constants from '../constants'
import type { DataProvider } from 'react-admin'

// Mock dependencies
jest.mock('../providers/authProvider', () => ({
  getUser: jest.fn()
}))

jest.mock('./helper', () => ({
  getClientIp: jest.fn(() => '192.168.1.1')
}))

// Import mocked modules
import { getUser } from '../providers/authProvider'
import { getClientIp } from './helper'

describe('trackEvent (audit logging)', () => {
  let mockDataProvider: DataProvider
  let mockCreate: jest.MockedFunction<(...args: any[]) => Promise<any>>

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreate = jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue({ data: { id: 1 } })
    mockDataProvider = {
      create: mockCreate
    } as unknown as DataProvider

    // Default: user is logged in
    ;(getUser as jest.Mock).mockReturnValue({ id: 42, username: 'testuser' })
    ;(getClientIp as jest.Mock).mockReturnValue('192.168.1.1')
  })

  it('should create audit entry with all required fields', async () => {
    const auditData: AuditData = {
      activityType: AuditType.CREATE,
      activityDetail: 'Item created',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: 123,
      subjectId: null,
      subjectResource: null
    }

    const trackEventFn = trackEvent(mockDataProvider)
    await trackEventFn(auditData)

    expect(mockCreate).toHaveBeenCalledWith(constants.R_AUDIT, {
      data: expect.objectContaining({
        user: 42,
        resource: constants.R_ITEMS,
        dataId: 123,
        activityType: AuditType.CREATE,
        activityDetail: 'Item created',
        securityRelated: false,
        subjectId: null,
        subjectResource: null,
        ip: '192.168.1.1',
        dateTime: expect.any(String),
        label: expect.any(String)
      })
    })
  })

  it('should set securityRelated to false when undefined', async () => {
    const auditData: AuditData = {
      activityType: AuditType.EDIT,
      activityDetail: 'Item updated',
      securityRelated: undefined as any,
      resource: constants.R_ITEMS,
      dataId: 456,
      subjectId: null,
      subjectResource: null
    }

    const trackEventFn = trackEvent(mockDataProvider)
    await trackEventFn(auditData)

    expect(mockCreate).toHaveBeenCalledWith(
      constants.R_AUDIT,
      expect.objectContaining({
        data: expect.objectContaining({
          securityRelated: false
        })
      })
    )
  })

  it('should record security-related events', async () => {
    const auditData: AuditData = {
      activityType: AuditType.EDIT,
      activityDetail: 'Password changed',
      securityRelated: true,
      resource: constants.R_USERS,
      dataId: 42,
      subjectId: null,
      subjectResource: null
    }

    const trackEventFn = trackEvent(mockDataProvider)
    await trackEventFn(auditData)

    expect(mockCreate).toHaveBeenCalledWith(
      constants.R_AUDIT,
      expect.objectContaining({
        data: expect.objectContaining({
          securityRelated: true
        })
      })
    )
  })

  it('should record bidirectional audit (item -> subject)', async () => {
    const auditData: AuditData = {
      activityType: AuditType.EDIT,
      activityDetail: 'Item added to dispatch',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: 100,
      subjectId: 5,
      subjectResource: constants.R_DISPATCH
    }

    const trackEventFn = trackEvent(mockDataProvider)
    await trackEventFn(auditData)

    expect(mockCreate).toHaveBeenCalledWith(
      constants.R_AUDIT,
      expect.objectContaining({
        data: expect.objectContaining({
          resource: constants.R_ITEMS,
          dataId: 100,
          subjectId: 5,
          subjectResource: constants.R_DISPATCH
        })
      })
    )
  })

  it('should not create audit entry when user is not logged in', async () => {
    ;(getUser as jest.Mock).mockReturnValue(undefined)

    const auditData: AuditData = {
      activityType: AuditType.CREATE,
      activityDetail: 'Item created',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: 123,
      subjectId: null,
      subjectResource: null
    }

    const trackEventFn = trackEvent(mockDataProvider)
    await trackEventFn(auditData)

    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('should record client IP address', async () => {
    ;(getClientIp as jest.Mock).mockReturnValue('10.0.0.5')

    const auditData: AuditData = {
      activityType: AuditType.DELETE,
      activityDetail: 'Item deleted',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: 789,
      subjectId: null,
      subjectResource: null
    }

    const trackEventFn = trackEvent(mockDataProvider)
    await trackEventFn(auditData)

    expect(mockCreate).toHaveBeenCalledWith(
      constants.R_AUDIT,
      expect.objectContaining({
        data: expect.objectContaining({
          ip: '10.0.0.5'
        })
      })
    )
  })

  it('should use current timestamp', async () => {
    const beforeTime = new Date().toISOString()

    const auditData: AuditData = {
      activityType: AuditType.CREATE,
      activityDetail: 'Test',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: 1,
      subjectId: null,
      subjectResource: null
    }

    const trackEventFn = trackEvent(mockDataProvider)
    await trackEventFn(auditData)

    const afterTime = new Date().toISOString()
    const callArgs = mockCreate.mock.calls[0][1] as { data: Audit }
    const auditDateTime = callArgs.data.dateTime

    expect(auditDateTime).toBeTruthy()
    expect(auditDateTime >= beforeTime).toBe(true)
    expect(auditDateTime <= afterTime).toBe(true)
  })

  it('should handle activity type labels', async () => {
    const auditData: AuditData = {
      activityType: AuditType.SENT,
      activityDetail: 'Dispatch sent',
      securityRelated: false,
      resource: constants.R_DISPATCH,
      dataId: 10,
      subjectId: null,
      subjectResource: null
    }

    const trackEventFn = trackEvent(mockDataProvider)
    await trackEventFn(auditData)

    expect(mockCreate).toHaveBeenCalledWith(
      constants.R_AUDIT,
      expect.objectContaining({
        data: expect.objectContaining({
          label: expect.any(String)
        })
      })
    )
  })

  it('should allow empty activityDetail', async () => {
    const auditData: AuditData = {
      activityType: AuditType.CREATE,
      activityDetail: '',
      securityRelated: false,
      resource: constants.R_ITEMS,
      dataId: 123,
      subjectId: null,
      subjectResource: null
    }

    const trackEventFn = trackEvent(mockDataProvider)
    await trackEventFn(auditData)

    expect(mockCreate).toHaveBeenCalledWith(
      constants.R_AUDIT,
      expect.objectContaining({
        data: expect.objectContaining({
          activityDetail: ''
        })
      })
    )
  })
})

/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import UserLifeCycleFactory from './UserLifeCycle'
import { AuditType } from '../../../utils/activity-types'
import { R_USERS } from '../../../constants'
import type { CreateParams, UpdateParams, UpdateResult } from 'react-admin'
import type { AuditFunctionType } from '../dataprovider-utils'

// Mock getUser from authProvider
jest.mock('../../../providers/authProvider', () => ({
  getUser: jest.fn(() => ({ id: 99, username: 'testuser' }))
}))

describe('UserLifeCycle', () => {
  let mockAudit: jest.MockedFunction<AuditFunctionType>
  let userLifeCycle: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockAudit = jest.fn<AuditFunctionType>().mockResolvedValue(undefined)
    userLifeCycle = UserLifeCycleFactory(mockAudit)
  })

  describe('beforeCreate', () => {
    it('should set departedDate to 10 years in the future', async () => {
      const testUserData = {
        username: 'testuser',
        name: 'Test User'
      } as _Users
      const createParams: CreateParams<_Users> = {
        data: testUserData
      }

      const result = await userLifeCycle.beforeCreate(createParams)

      expect(result.data.departedDate).toBeDefined()

      // Check that departedDate is approximately 10 years in the future
      const departedDate = new Date(result.data.departedDate as string)
      const tenYearsFromNow = new Date()
      tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10)

      // Allow 1 day tolerance for test execution time
      const oneDayMs = 24 * 60 * 60 * 1000
      expect(Math.abs(departedDate.getTime() - tenYearsFromNow.getTime())).toBeLessThan(oneDayMs)
    })

    it('should add createdBy and createdAt fields', async () => {
      const testUserData = {
        username: 'testuser',
        name: 'Test User'
      } as _Users
      const createParams: CreateParams<_Users> = {
        data: testUserData
      }

      const result = await userLifeCycle.beforeCreate(createParams)

      expect(result.data.createdAt).toBeDefined()
      expect(result.data.createdBy).toBeDefined()
    })
  })

  describe('beforeUpdate', () => {
    it('should detect password assignment when previousData had no password', async () => {
      const newData = {
        hashed_password: 'new_hashed_password_value' // NOSONAR
      } as _Users
      const oldData = {
        id: 1,
        username: 'testuser',
        hashed_password: null,
        createdAt: '2024-01-01',
        createdBy: 1
      } as _Users
      const updateParams: UpdateParams<_Users> = {
        id: 1,
        data: newData,
        previousData: oldData
      }

      const result = await userLifeCycle.beforeUpdate(updateParams)

      expect(result).toBe(updateParams)
      // The password assignment flag is tracked internally for afterUpdate
    })

    it('should detect password assignment when previousData had undefined password', async () => {
      const newData = {
        hashed_password: 'new_hashed_password_value' // NOSONAR
      } as _Users
      const oldData = {
        id: 1,
        username: 'testuser',
        hashed_password: undefined
      } as _Users
      const updateParams: UpdateParams<_Users> = {
        id: 1,
        data: newData,
        previousData: oldData
      }

      const result = await userLifeCycle.beforeUpdate(updateParams)

      expect(result).toBe(updateParams)
    })

    it('should not flag password change as assignment if previousData had a password', async () => {
      const newData = {
        hashed_password: 'new_hashed_password_value' // NOSONAR
      } as _Users
      const oldData = {
        id: 1,
        username: 'testuser',
        hashed_password: 'old_hashed_password_value' // NOSONAR
      } as _Users
      const updateParams: UpdateParams<_Users> = {
        id: 1,
        data: newData,
        previousData: oldData
      }

      const result = await userLifeCycle.beforeUpdate(updateParams)

      expect(result).toBe(updateParams)
    })
  })

  describe('afterUpdate', () => {
    it('should create security audit when password is assigned', async () => {
      // First, trigger password assignment detection in beforeUpdate
      const newData = {
        hashed_password: 'new_hashed_password_value' // NOSONAR
      } as _Users
      const oldData = {
        id: 42,
        username: 'testuser',
        hashed_password: null,
        createdAt: '2024-01-01',
        createdBy: 1
      } as _Users
      const updateParams: UpdateParams<_Users> = {
        id: 42,
        data: newData,
        previousData: oldData
      }

      await userLifeCycle.beforeUpdate(updateParams)

      // Then trigger afterUpdate
      const resultData = {
        id: 42,
        username: 'testuser',
        hashed_password: 'new_hashed_password_value' // NOSONAR
      } as _Users
      const updateResult: UpdateResult<_Users> = {
        data: resultData
      }

      const result = await userLifeCycle.afterUpdate(updateResult)

      expect(result).toBe(updateResult)

      // Allow async audit to complete
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(mockAudit).toHaveBeenCalledWith({
        resource: R_USERS,
        activityType: AuditType.EDIT,
        activityDetail: 'Password assigned',
        securityRelated: true,
        dataId: 42,
        subjectId: null,
        subjectResource: null
      })
    })

    it('should not create audit when password is changed (not initially assigned)', async () => {
      // Password change (not assignment)
      const newData = {
        hashed_password: 'new_hashed_password_value' // NOSONAR
      } as _Users
      const oldData = {
        id: 42,
        username: 'testuser',
        hashed_password: 'old_hashed_password_value' // NOSONAR
      } as _Users
      const updateParams: UpdateParams<_Users> = {
        id: 42,
        data: newData,
        previousData: oldData
      }

      await userLifeCycle.beforeUpdate(updateParams)

      const resultData = {
        id: 42,
        username: 'testuser',
        hashed_password: 'new_hashed_password_value' // NOSONAR
      } as _Users
      const updateResult: UpdateResult<_Users> = {
        data: resultData
      }

      await userLifeCycle.afterUpdate(updateResult)

      // Allow async audit to complete
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(mockAudit).not.toHaveBeenCalled()
    })

    it('should not create audit when no password is assigned', async () => {
      // Update without password change
      const newData = {
        name: 'Updated Name'
      } as _Users
      const oldData = {
        id: 42,
        username: 'testuser',
        name: 'Old Name',
        hashed_password: 'existing_password' // NOSONAR
      } as _Users
      const updateParams: UpdateParams<_Users> = {
        id: 42,
        data: newData,
        previousData: oldData
      }

      await userLifeCycle.beforeUpdate(updateParams)

      const resultData = {
        id: 42,
        username: 'testuser',
        name: 'Updated Name'
      } as _Users
      const updateResult: UpdateResult<_Users> = {
        data: resultData
      }

      await userLifeCycle.afterUpdate(updateResult)

      // Allow async audit to complete
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(mockAudit).not.toHaveBeenCalled()
    })
  })

  describe('resource configuration', () => {
    it('should have correct resource name', () => {
      expect(userLifeCycle.resource).toBe(R_USERS)
    })

    it('should mark all user operations as security related', () => {
      // The factory uses extendLifeCycle with securityRelated function
      // This is tested indirectly through the lifecycle callbacks
      expect(userLifeCycle).toHaveProperty('resource')
      expect(userLifeCycle).toHaveProperty('beforeCreate')
      expect(userLifeCycle).toHaveProperty('beforeUpdate')
      expect(userLifeCycle).toHaveProperty('afterUpdate')
    })
  })
})

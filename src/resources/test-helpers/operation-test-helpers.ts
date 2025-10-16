import { jest } from '@jest/globals'
import { type UpdateParams } from 'react-admin'
import { type AuditData } from '../../utils/audit'

/**
 * Creates mock functions for testing operation functions
 */
export const createMockOperationDependencies = (): {
  mockUpdate: jest.Mock<(resource: string, params: UpdateParams) => Promise<any>>
  mockUpdateMany: jest.Mock<(resource: string, params: { ids: number[]; data: any }) => Promise<any>>
  mockAudit: jest.Mock<(data: AuditData) => Promise<void>>
  mockNotify: jest.Mock<(message: any, options?: any) => void>
} => ({
  mockUpdate: jest.fn<(resource: string, params: UpdateParams) => Promise<any>>().mockResolvedValue({}),
  mockUpdateMany: jest.fn<(resource: string, params: { ids: number[]; data: any }) => Promise<any>>().mockResolvedValue({}),
  mockAudit: jest.fn<(data: AuditData) => Promise<void>>().mockResolvedValue(undefined),
  mockNotify: jest.fn<(message: any, options?: any) => void>()
})

/**
 * Creates mock items for testing
 */
export const createMockItems = (count: number, startId: number = 1, additionalProps: Record<string, any> = {}): Item[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    itemNumber: `ITEM-${startId + i}`,
    ...additionalProps
  })) as Item[]
}

/**
 * Gets the second parameter from an updateMany mock call
 */
export const getUpdateManyCallParams = (mockUpdateMany: any): { ids: number[]; data: any } => {
  return mockUpdateMany.mock.calls[0][1] as { ids: number[]; data: any }
}

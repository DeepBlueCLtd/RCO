import { jest } from '@jest/globals'
import { type UpdateParams } from 'react-admin'
import { type AuditData } from '../../utils/audit'

/**
 * Creates mock functions for testing operation functions
 */
export const createMockOperationDependencies = (): {
  mockUpdate: jest.Mock<(resource: string, params: UpdateParams) => Promise<unknown>>
  mockUpdateMany: jest.Mock<(resource?: string, params?: { ids?: number[]; data?: unknown }) => Promise<unknown>>
  mockAudit: jest.Mock<(data: AuditData) => Promise<void>>
  mockNotify: jest.Mock<(message: string, options?: { type?: 'success' | 'error' | 'warning' | 'info' }) => void>
} => ({
  mockUpdate: jest.fn<(resource: string, params: UpdateParams) => Promise<unknown>>().mockResolvedValue({}),
  mockUpdateMany: jest.fn<(resource?: string, params?: { ids?: number[]; data?: unknown }) => Promise<unknown>>().mockResolvedValue({}),
  mockAudit: jest.fn<(data: AuditData) => Promise<void>>().mockResolvedValue(undefined),
  mockNotify: jest.fn<(message: string, options?: { type?: 'success' | 'error' | 'warning' | 'info' }) => void>()
})

/**
 * Creates mock items for testing
 */
export const createMockItems = (count: number, startId: number = 1, additionalProps: Record<string, unknown> = {}): Item[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    itemNumber: `ITEM-${startId + i}`,
    ...additionalProps
  })) as Item[]
}

/**
 * Gets the second parameter from an updateMany mock call
 */
export const getUpdateManyCallParams = (mockUpdateMany: unknown): { ids: number[]; data: unknown } => {
  return (mockUpdateMany as { mock: { calls: Array<[string, { ids: number[]; data: unknown }]> } }).mock.calls[0][1]
}

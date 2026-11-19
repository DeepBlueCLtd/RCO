import { describe, it, expect } from '@jest/globals'
import { toSoulFilters } from '../soul-filters'

// the builder used before: JSON with braces, spaces and quotes stripped
const previous = (filter: Record<string, unknown>): string =>
  JSON.stringify(filter).replace(/[{} ""]/g, '')

describe('toSoulFilters', () => {
  it('keeps spaces in values', () => {
    expect(toSoulFilters({ name: 'Big Box' })).toBe('name:Big Box')
    expect(toSoulFilters({ createdAt__gte: '2024-01-01 10:00:00' })).toBe(
      'createdAt__gte:2024-01-01 10:00:00'
    )
  })

  it('keeps spaces inside list values', () => {
    expect(toSoulFilters({ name: ['Big Box', 'Crate'] })).toBe(
      'name:[Big Box,Crate]'
    )
  })

  it('matches the previous builder for values without spaces', () => {
    const cases: Array<Record<string, unknown>> = [
      {},
      { batch: '12' },
      { batch: 12, mediaType__neq: 3 },
      { id: [1, 2, 3] },
      { name: ['a', 'b'] },
      { loanedTo__null: '', batch__notnull: '' },
      { active: 1 },
      { createdAt__gte: '2024-01-01T10:00:00.000Z' },
      { batch: undefined, active: 1 }
    ]
    for (const filter of cases) {
      expect(toSoulFilters(filter)).toBe(previous(filter))
    }
  })
})

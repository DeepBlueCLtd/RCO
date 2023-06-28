import { useState } from 'react'

type ReturnIdsType = number[] | undefined

export interface UseRefFilter {
  setFilterValue: (
    key: string,
    values: number[],
    displayed: string[]
  ) => ReturnIdsType
}

const findCommonValues = (arrays: number[][]): ReturnIdsType => {
  const sortedArrays = arrays.sort(
    (a: number[], b: number[]) => a.length - b.length
  )

  const commons = sortedArrays.shift()?.filter((v: number) => {
    return sortedArrays.every((a: number[]) => {
      return a.includes(v)
    })
  })
  return commons
}

export default function useRefFilter(): UseRefFilter {
  const [filters, setFilters] = useState<Record<string, number[]>>({})

  const getFilterIds = (ids: number[], displayed: string[]): ReturnIdsType => {
    const arrays = displayed.map((item: string) => filters[item])
    if (ids?.length > 0) {
      arrays.push(ids)
    }
    const newArrays = arrays.filter(
      (item: ReturnIdsType) => item && item.length > 0
    )

    return findCommonValues(newArrays)
  }

  const setFilterValue = (
    source: string,
    values: number[],
    displayed: string[]
  ): ReturnIdsType => {
    const _filters: Record<string, number[]> = {}
    displayed.forEach((item: string) => {
      if (filters[item]) {
        _filters[item] = filters[item]
      }
    })
    if (displayed.includes(source)) {
      _filters[source] = values
    }
    setFilters(_filters)

    const ids = getFilterIds(values, displayed)
    return ids
  }

  return { setFilterValue }
}

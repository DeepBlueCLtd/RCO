import { type RaRecord, useGetList, useListContext } from 'react-admin'
import { useEffect } from 'react'
import { Chip } from '@mui/material'

interface BooleanFilterProps<T> {
  source: keyof T
  label: string
  fieldName: keyof T
  resource: string
  nullable?: boolean
}

export default function BooleanFilter<T extends RaRecord>(
  props: BooleanFilterProps<T>
): React.ReactElement {
  const { source, label, resource, fieldName, nullable = false } = props

  const { setFilters, displayedFilters, filterValues } = useListContext<T>()

  const filterKey = `${[fieldName]}_${nullable ? 'eq' : 'neq'}`
  const { data = [], isLoading } = useGetList<T>(resource, {
    filter: {
      [filterKey]: process.env.MOCK ? undefined : null
    }
  })

  useEffect(() => {
    if (data.length !== 0) {
      const filteredIds = data.map((f) => f[source])
      const ids = filteredIds.length > 0 ? [...new Set(filteredIds)] : [-1]
      setFilters(
        {
          ...displayedFilters,
          [source]: ids,
          ...filterValues
        },
        displayedFilters
      )
    }
  }, [isLoading, data])

  return <Chip sx={{ marginBottom: 1 }} label={label} />
}

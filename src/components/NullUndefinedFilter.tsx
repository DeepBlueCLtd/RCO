import { Chip } from '@mui/material'
import { useEffect } from 'react'
import { useListContext, useGetList } from 'react-admin'

interface Props {
  label: string
  source: string
  fieldName: string
  resource: string
}

const NullUndefinedFilter = (props: Props): React.ReactElement => {
  const { label, source, fieldName, resource } = props
  const { setFilters, displayedFilters, filterValues } = useListContext()
  const { data = [], isLoading } = useGetList(resource, {
    filter: {
      [fieldName]: process.env.MOCK ? undefined : null
    }
  })

  useEffect(() => {
    if (data.length !== 0) {
      const filteredIds = data.map((f) => f.id)
      const ids = filteredIds.length > 0 ? [...new Set(filteredIds)] : [-1]
      setFilters(
        {
          [source]: ids,
          ...filterValues
        },
        displayedFilters
      )
    }
  }, [isLoading, data])

  return <Chip sx={{ marginBottom: 1 }} label={label} />
}

export default NullUndefinedFilter

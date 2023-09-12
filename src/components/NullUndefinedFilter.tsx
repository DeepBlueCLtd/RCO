import { Chip } from '@mui/material'
import { useEffect } from 'react'
import { useListContext } from 'react-admin'

interface Props {
  label: string
  source: string
}

const NullUndefinedFilter = (props: Props): React.ReactElement => {
  const { label, source } = props
  const { setFilters, displayedFilters, filterValues } = useListContext()

  useEffect(() => {
    setFilters(
      {
        ...filterValues,
        [source]: 'dummy'
      },
      displayedFilters
    )
  }, [])
  return <Chip sx={{ marginBottom: 1 }} label={label} />
}

export default NullUndefinedFilter

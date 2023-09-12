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
        // NOTE: react-admin doesn't re-query backend if right-hand value is null
        [source]: process.env.MOCK ? 'null' : 'dummy'
      },
      displayedFilters
    )
  }, [])
  return <Chip sx={{ marginBottom: 1 }} label={label} />
}

export default NullUndefinedFilter

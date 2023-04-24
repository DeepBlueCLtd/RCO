import {
  type Identifier,
  useGetIdentity,
  useListContext,
  useNotify
} from 'react-admin'
import { useEffect } from 'react'
import { TextField } from '@mui/material'

interface Props {
  label?: string
  source: string
}

export default function CreatedByMeFilter(props: Props) {
  const { source, label } = props
  const { data, isLoading } = useGetIdentity()
  const { setFilters, displayedFilters, filterValues } = useListContext()
  const notify = useNotify()

  useEffect(() => {
    if (!isLoading) {
      const createdBy: Identifier | undefined = data?.id
      if (createdBy === undefined) {
        notify('User not found!', { type: 'error' })
        return
      }
      setFilters({ ...filterValues, [source]: createdBy }, displayedFilters)
    }
  }, [isLoading])

  if (isLoading) return null

  return (
    <TextField
      value={data?.fullName}
      variant='outlined'
      label={label}
      name={source}
    />
  )
}

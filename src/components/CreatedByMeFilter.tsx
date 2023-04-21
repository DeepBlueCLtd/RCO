import { TextField } from '@mui/material'
import { useGetIdentity } from 'react-admin'

interface Props {
  label?: string
  source: string
}

export default function CreatedByMeFilter(props: Props) {
  const { source, label } = props
  const { data } = useGetIdentity()

  return (
    <TextField
      value={data?.fullName}
      disabled
      variant='outlined'
      label={label}
      name={source}
    />
  )
}

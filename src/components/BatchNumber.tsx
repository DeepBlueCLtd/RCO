import { type Theme } from '@mui/material'
import * as constants from '../constants'
import { Show, type ShowProps, TextField } from 'react-admin'
import { type ReactElement } from 'react'
import SourceField from './SourceField'
import { useLocation } from 'react-router-dom'
const sx = (theme: Theme) => ({
  width: '150px',
  fontWeight: 'bold',
  height: '35px',
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  background: theme.palette.primary.main,
  justifyContent: 'center',
  color: theme.palette.common.white + '!important'
})

type Props = Omit<ShowProps, 'children'> & {
  reference?: string
  queryParams?: string
}

export default function BatchNumber(props: Props): ReactElement {
  const location = useLocation()

  const reference: string | undefined = props.reference
  const queryParams: string | undefined = props.queryParams
  const searchParams: URLSearchParams = new URLSearchParams(location.search)
  const batch: number | undefined =
    typeof queryParams === 'undefined'
      ? Number(searchParams.get(queryParams))
      : undefined

  return (
    <Show
      sx={{ marginRight: 'auto' }}
      actions={false}
      resource={constants.R_BATCHES}
      id={batch}
      {...props}>
      {reference !== undefined ? (
        <SourceField
          source='batchId'
          reference={reference}
          sourceField='batchNumber'
          textProps={{ sx }}
        />
      ) : (
        <TextField source='batchNumber' sx={sx} />
      )}
    </Show>
  )
}

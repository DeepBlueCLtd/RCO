import { type Theme } from '@mui/material'
import * as constants from '../constants'
import { Show, type ShowProps, TextField } from 'react-admin'
import { type ReactElement } from 'react'
import SourceField from './SourceField'
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

type Props = Omit<ShowProps, 'children'> & { reference?: string }

export default function BatchNumber(props: Props): ReactElement {
  const reference: string | undefined = props.reference
  return (
    <Show
      sx={{ marginRight: 'auto' }}
      actions={false}
      resource={constants.R_BATCHES}
      {...props}>
      {reference !== undefined ? (
        <SourceField
          source='batchId'
          reference={reference}
          textProps={{ sx }}
        />
      ) : (
        <TextField source='batchNumber' sx={sx} />
      )}
    </Show>
  )
}

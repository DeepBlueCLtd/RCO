import { type Theme } from '@mui/material'
import * as constants from '../constants'
import { Show, type ShowProps, TextField } from 'react-admin'
import { type ReactElement } from 'react'

export default function BatchNumber(
  props: Omit<ShowProps, 'children'>
): ReactElement {
  return (
    <Show
      sx={{ marginRight: 'auto' }}
      actions={false}
      {...props}
      resource={constants.R_BATCHES}>
      <TextField
        source='batchNumber'
        sx={(theme: Theme) => ({
          width: '150px',
          fontWeight: 'bold',
          height: '35px',
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          background: theme.palette.primary.main,
          justifyContent: 'center',
          color: theme.palette.common.white
        })}
      />
    </Show>
  )
}

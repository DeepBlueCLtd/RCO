import { type Theme } from '@mui/material'
import * as constants from '../constants'
import { Show, TextField } from 'react-admin'
import { type ReactElement } from 'react'

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

export default function ItemNumber(): ReactElement {
  return (
    <Show
      sx={{ marginRight: 'auto' }}
      actions={false}
      resource={constants.R_ITEMS}>
      <TextField source='item_number' sx={sx} />
    </Show>
  )
}

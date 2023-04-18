import { type Theme } from '@mui/material'
import { Show, type ShowProps, TextField } from 'react-admin'
import { type ReactElement } from 'react'

const sx = (theme: Theme) => {
  const color: string = `${theme.palette.common.white} !important`
  
  return {
    width: '150px',
    fontWeight: 'bold',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    background: theme.palette.primary.main,
    justifyContent: 'center',
    color
  }
}

type Props = Omit<ShowProps, 'children'> & {
  source: string
}

export default function TopToolbarField(props: Props): ReactElement {
  const { source, ...rest } = props
  return (
    <Show sx={{ marginRight: 'auto' }} actions={false} {...rest}>
      <TextField source={source} sx={sx} />
    </Show>
  )
}

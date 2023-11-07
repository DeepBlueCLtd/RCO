import { type Theme } from '@mui/material'
import { Show, type ShowProps, TextField } from 'react-admin'
import { type ReactElement } from 'react'
import { type SystemStyleObject } from '@mui/system'

export const sx = (theme: Theme): SystemStyleObject<Theme> => {
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

type Props<T> = PartialBy<ShowProps, 'children'> & {
  source: keyof T
}

export default function TopToolbarField<T>(props: Props<T>): ReactElement {
  const { source, children, ...rest } = props
  return (
    <Show sx={{ marginRight: 'auto' }} actions={false} {...rest}>
      {typeof children !== 'undefined' ? (
        children
      ) : (
        <TextField source={source as string} sx={sx} />
      )}
    </Show>
  )
}
